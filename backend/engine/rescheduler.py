"""
Rescheduling & Disruption Engine for CIT.
Handles last-minute faculty leaves, emergency room closures, new session additions,
and minimal session movements with an approval state machine.
"""

import copy, json
from collections import defaultdict

class Rescheduler:
    def __init__(self, data, baseline_schedule):
        self.data = copy.deepcopy(data)
        self.baseline = copy.deepcopy(baseline_schedule)
        self.days = self.data["calendar"]["days"]
        self.rooms = {r["id"]: r for r in self.data["rooms"]}
        self.faculty = {f["id"]: f for f in self.data["faculty"]}
        self.groups = {g["id"]: g for g in self.data["student_groups"]}
        self.sessions = {s["id"]: s for s in self.data["sessions"]}

    def apply_disruption_to_data(self, disruption_dict):
        """Applies changes to internal data structure."""
        d = copy.deepcopy(self.data)
        fac = {f["id"]: f for f in d["faculty"]}
        for ch in disruption_dict.get("changes", []):
            t = ch["type"]
            if t == "faculty_unavailable":
                for day in ch["days"]:
                    fac[ch["faculty_id"]]["unavailable"].append({
                        "day": day,
                        "periods": ch["periods"],
                        "reason": ch.get("reason", "")
                    })
            elif t == "room_unavailable":
                for day in ch["days"]:
                    d["room_unavailability"].append({
                        "room_id": ch["room_id"],
                        "day": day,
                        "periods": ch["periods"],
                        "reason": ch.get("reason", "")
                    })
            elif t == "add_faculty":
                d["faculty"].append(ch["faculty"])
                fac[ch["faculty"]["id"]] = ch["faculty"]
            elif t == "add_session":
                d["sessions"].append(ch["session"])
            elif t == "remove_session":
                d["sessions"] = [s for s in d["sessions"] if s["id"] != ch["session_id"]]
        return d

    def repair(self, disruption_dict):
        """
        Calculates a minimally disruptive repaired schedule.
        Returns: {
            "repaired_schedule": {...},
            "stability": {...},
            "impact_analysis": {...},
            "diffs": [...]
        }
        """
        new_data = self.apply_disruption_to_data(disruption_dict)
        sessions_dict = {s["id"]: s for s in new_data["sessions"]}
        fac_dict = {f["id"]: f for f in new_data["faculty"]}
        rooms_dict = {r["id"]: r for r in new_data["rooms"]}

        fac_un = defaultdict(set)
        for f in new_data["faculty"]:
            for u in f.get("unavailable", []):
                for p in u["periods"]:
                    fac_un[f["id"]].add((u["day"], p))

        room_un = defaultdict(set)
        for u in new_data.get("room_unavailability", []):
            for p in u["periods"]:
                room_un[u["room_id"]].add((u["day"], p))

        # Start from baseline
        assign = {}
        for item in self.baseline.get("sessions", []):
            sid = item["session_id"]
            if sid in sessions_dict:
                assign[sid] = (item["day"], item["start_period"], item["room_id"])

        # Detect directly invalidated sessions
        invalid_sids = set()
        for sid, (day, sp, rid) in list(assign.items()):
            s = sessions_dict[sid]
            f_id = s["faculty_id"]
            pers = list(range(sp, sp + s["duration"]))
            # Faculty unavailable?
            if any((day, p) in fac_un[f_id] for p in pers):
                invalid_sids.add(sid)
            # Room unavailable?
            if any((day, p) in room_un[rid] for p in pers):
                invalid_sids.add(sid)

        # Removed sessions
        removed_sids = set(s["id"] for s in self.data["sessions"]) - set(sessions_dict.keys())
        for rsid in removed_sids:
            if rsid in assign:
                del assign[rsid]

        # Added sessions
        added_sids = set(sessions_dict.keys()) - set(s["id"] for s in self.data["sessions"])

        # Sessions needing assignment: invalid_sids + added_sids
        to_place = list(invalid_sids) + list(added_sids)
        for isid in invalid_sids:
            del assign[isid]

        # Greedily repair with minimal perturbation:
        # First priority: same (day, period), just find a different room (room-only change)
        for sid in to_place[:]:
            s = sessions_dict[sid]
            dur = s["duration"]
            kind = s["kind"]
            s_size = s["size"]
            f_id = s["faculty_id"]

            old_loc = None
            for item in self.baseline.get("sessions", []):
                if item["session_id"] == sid:
                    old_loc = (item["day"], item["start_period"])
                    break

            if old_loc:
                day, sp = old_loc
                pers = list(range(sp, sp + dur))
                if not any((day, p) in fac_un[f_id] for p in pers):
                    # Check busy rooms at this time
                    busy_rooms = {loc[2] for l_sid, loc in assign.items() if loc[0] == day and any(p in pers for p in range(loc[1], loc[1] + sessions_dict[l_sid]["duration"]))}
                    cand_rooms = [
                        r["id"] for r in new_data["rooms"]
                        if kind in r.get("allowed_uses", [])
                        and r["type"] in s["room_types"]
                        and r["capacity"] >= s_size
                        and (not s.get("needs_accessible") or r.get("accessible"))
                        and r["id"] not in busy_rooms
                        and not any((day, p) in room_un[r["id"]] for p in pers)
                    ]
                    if cand_rooms:
                        # Sort by least wasted capacity
                        cand_rooms.sort(key=lambda rid: rooms_dict[rid]["capacity"])
                        assign[sid] = (day, sp, cand_rooms[0])
                        to_place.remove(sid)

        # If any remain (or added sessions), find least disruptive slot
        for sid in to_place:
            s = sessions_dict[sid]
            dur = s["duration"]
            kind = s["kind"]
            s_size = s["size"]
            f_id = s["faculty_id"]
            groups = s["groups"]
            mx = fac_dict[f_id].get("max_hours_per_day", 4)

            best_slot = None
            for day in self.days:
                # check faculty daily hours
                current_f_hours = sum(sessions_dict[l_sid]["duration"] for l_sid, loc in assign.items() if loc[0] == day and sessions_dict[l_sid]["faculty_id"] == f_id)
                if current_f_hours + dur > mx:
                    continue

                possible_starts = [2, 6] if kind == "lab" else list(range(1, 10 - dur + 1))
                for sp in possible_starts:
                    pers = list(range(sp, sp + dur))
                    if pers[0] <= 5 < pers[-1]:
                        continue  # crosses lunch
                    if any((day, p) in fac_un[f_id] for p in pers):
                        continue

                    # Faculty double booking check
                    f_busy = any(
                        loc[0] == day and any(p in pers for p in range(loc[1], loc[1] + sessions_dict[l_sid]["duration"]))
                        for l_sid, loc in assign.items() if sessions_dict[l_sid]["faculty_id"] == f_id
                    )
                    if f_busy:
                        continue

                    # Student group double booking check
                    g_busy = any(
                        loc[0] == day and any(p in pers for p in range(loc[1], loc[1] + sessions_dict[l_sid]["duration"]))
                        for l_sid, loc in assign.items() if any(g in sessions_dict[l_sid]["groups"] for g in groups)
                    )
                    if g_busy:
                        continue

                    # Room check
                    busy_rooms = {
                        loc[2] for l_sid, loc in assign.items()
                        if loc[0] == day and any(p in pers for p in range(loc[1], loc[1] + sessions_dict[l_sid]["duration"]))
                    }
                    cand_rooms = [
                        r["id"] for r in new_data["rooms"]
                        if kind in r.get("allowed_uses", [])
                        and r["type"] in s["room_types"]
                        and r["capacity"] >= s_size
                        and (not s.get("needs_accessible") or r.get("accessible"))
                        and r["id"] not in busy_rooms
                        and not any((day, p) in room_un[r["id"]] for p in pers)
                    ]
                    if cand_rooms:
                        cand_rooms.sort(key=lambda rid: rooms_dict[rid]["capacity"])
                        best_slot = (day, sp, cand_rooms[0])
                        break
                if best_slot:
                    break

            if best_slot:
                assign[sid] = best_slot
            else:
                raise RuntimeError(f"Could not find valid clash-free slot for {sid}")

        # Compute diffs and stability
        base_map = {item["session_id"]: item for item in self.baseline.get("sessions", [])}
        moved_ids = []
        time_changed = 0
        room_only_changed = 0
        diffs = []

        affected_fac = set()
        affected_groups = set()
        affected_rooms = set()

        for sid, (day, sp, rid) in assign.items():
            if sid in base_map:
                b_item = base_map[sid]
                b_loc = (b_item["day"], b_item["start_period"], b_item["room_id"])
                curr_loc = (day, sp, rid)
                if b_loc != curr_loc:
                    moved_ids.append(sid)
                    s = sessions_dict[sid]
                    affected_fac.add(s["faculty_id"])
                    affected_groups.update(s["groups"])
                    affected_rooms.add(b_item["room_id"])
                    affected_rooms.add(rid)

                    is_time = (b_loc[0] != curr_loc[0] or b_loc[1] != curr_loc[1])
                    if is_time:
                        time_changed += 1
                        chg_type = "time_and_room" if b_loc[2] != curr_loc[2] else "time_only"
                    else:
                        room_only_changed += 1
                        chg_type = "room_only"

                    diffs.append({
                        "session_id": sid,
                        "course_id": s["course_id"],
                        "kind": s["kind"],
                        "change_type": chg_type,
                        "before": {"day": b_loc[0], "start_period": b_loc[1], "room_id": b_loc[2]},
                        "after": {"day": curr_loc[0], "start_period": curr_loc[1], "room_id": curr_loc[2]},
                        "reason": f"Disruption mitigation: {chg_type.replace('_', ' ')}"
                    })
            else:
                # Newly added session
                s = sessions_dict[sid]
                affected_fac.add(s["faculty_id"])
                affected_groups.update(s["groups"])
                affected_rooms.add(rid)
                diffs.append({
                    "session_id": sid,
                    "course_id": s["course_id"],
                    "kind": s["kind"],
                    "change_type": "session_added",
                    "before": None,
                    "after": {"day": day, "start_period": sp, "room_id": rid},
                    "reason": "New session added via disruption"
                })

        # Check removed sessions
        for rsid in removed_sids:
            b_item = base_map[rsid]
            diffs.append({
                "session_id": rsid,
                "course_id": rsid.split("-")[0],
                "kind": "lecture",
                "change_type": "session_removed",
                "before": {"day": b_item["day"], "start_period": b_item["start_period"], "room_id": b_item["room_id"]},
                "after": None,
                "reason": "Session removed via disruption"
            })

        # Calculate risk score (0-100)
        risk_score = min(100, len(moved_ids) * 15 + time_changed * 25 + len(affected_groups) * 5)

        repaired_sched = {
            "team": self.baseline.get("team", "AstraCampus"),
            "dataset_id": self.baseline.get("dataset_id", "cit-public-v1"),
            "sessions": [
                {"session_id": sid, "day": d, "start_period": p, "room_id": r}
                for sid, (d, p, r) in assign.items()
            ]
        }

        return {
            "repaired_schedule": repaired_sched,
            "stability": {
                "sessions_moved": len(moved_ids),
                "time_changed": time_changed,
                "room_only_changed": room_only_changed,
                "moved_ids": sorted(moved_ids)
            },
            "impact_analysis": {
                "risk_score": risk_score,
                "risk_level": "LOW" if risk_score < 30 else ("MEDIUM" if risk_score < 70 else "HIGH"),
                "affected_faculty_count": len(affected_fac),
                "affected_faculty": sorted(affected_fac),
                "affected_groups_count": len(affected_groups),
                "affected_groups": sorted(affected_groups),
                "affected_rooms_count": len(affected_rooms),
                "affected_rooms": sorted(affected_rooms)
            },
            "diffs": diffs
        }
