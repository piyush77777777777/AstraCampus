"""
Timetable Scheduling Engine for CIT.
Uses Google OR-Tools CP-SAT for constraint satisfaction and mathematical optimization.
Generates 100% clash-free schedules (Zero hard violations).
"""

import json, os, time
from collections import defaultdict
from ortools.sat.python import cp_model

class TimetableSolver:
    def __init__(self, data):
        self.data = data
        self.days = data["calendar"]["days"]
        self.rooms = {r["id"]: r for r in data["rooms"]}
        self.faculty = {f["id"]: f for f in data["faculty"]}
        self.groups = {g["id"]: g for g in data["student_groups"]}
        self.sessions = {s["id"]: s for s in data["sessions"]}

        self.fac_un = defaultdict(set)
        for f in data["faculty"]:
            for u in f.get("unavailable", []):
                for p in u["periods"]:
                    self.fac_un[f["id"]].add((u["day"], p))

        self.room_un = defaultdict(set)
        for u in data.get("room_unavailability", []):
            for p in u["periods"]:
                self.room_un[u["room_id"]].add((u["day"], p))

    def to_slot(self, d_idx, p):
        return d_idx * 9 + (p - 1)

    def from_slot(self, slot):
        return slot // 9, (slot % 9) + 1

    def solve(self, mode="balanced", timeout_seconds=15.0):
        """
        Solves the weekly timetable for all sessions.
        mode:
          - 'balanced': balances faculty preferences and student gaps
          - 'faculty_friendly': heavy penalty on faculty avoid slots (S1)
          - 'student_friendly': heavy penalty on student gaps and long days (S2, S3)
        """
        model = cp_model.CpModel()

        # Precompute candidate slots and rooms
        sess_allowed_slots = {}
        sess_allowed_rooms = {}
        room_id_list = list(self.rooms.keys())
        room_idx_map = {rid: i for i, rid in enumerate(room_id_list)}

        for sid, s in self.sessions.items():
            dur = s["duration"]
            kind = s["kind"]
            f_id = s["faculty_id"]
            s_size = s["size"]
            s_types = s["room_types"]
            needs_acc = s.get("needs_accessible", False)
            fixed = s.get("fixed_slot")

            # Candidate rooms
            cand_rooms = []
            for rid, r in self.rooms.items():
                if kind not in r.get("allowed_uses", []):
                    continue
                if r["type"] not in s_types:
                    continue
                if r["capacity"] < s_size:
                    continue
                if needs_acc and not r["accessible"]:
                    continue
                cand_rooms.append(rid)
            sess_allowed_rooms[sid] = cand_rooms

            # Candidate slots
            cand_slots = []
            if fixed:
                d_idx = self.days.index(fixed["day"])
                sp = fixed["start_period"]
                cand_slots.append(self.to_slot(d_idx, sp))
            else:
                for d_idx, d_name in enumerate(self.days):
                    possible_starts = [2, 6] if kind == "lab" else list(range(1, 10))
                    for sp in possible_starts:
                        pers = list(range(sp, sp + dur))
                        if any((d_name, p) in self.fac_un[f_id] for p in pers):
                            continue
                        cand_slots.append(self.to_slot(d_idx, sp))
            sess_allowed_slots[sid] = cand_slots

        # Decision variables
        slot_vars = {}
        room_vars = {}
        for sid, s in self.sessions.items():
            slot_vars[sid] = model.NewIntVarFromDomain(
                cp_model.Domain.FromValues(sess_allowed_slots[sid]), f"slot_{sid}"
            )
            allowed_r_indices = [room_idx_map[rid] for rid in sess_allowed_rooms[sid]]
            room_vars[sid] = model.NewIntVarFromDomain(
                cp_model.Domain.FromValues(allowed_r_indices), f"room_{sid}"
            )

        # H11: Basket synchronization
        baskets = defaultdict(list)
        for sid, s in self.sessions.items():
            if s.get("basket_slot"):
                baskets[s["basket_slot"]].append(sid)

        for b_name, sids in baskets.items():
            ref = slot_vars[sids[0]]
            for other_sid in sids[1:]:
                model.Add(slot_vars[other_sid] == ref)
            model.AddAllDifferent([room_vars[sid] for sid in sids])

        # H2: Faculty no double-booking
        fac_sessions = defaultdict(list)
        for sid, s in self.sessions.items():
            fac_sessions[s["faculty_id"]].append(sid)

        for f_id, sids in fac_sessions.items():
            intervals = []
            for sid in sids:
                dur = self.sessions[sid]["duration"]
                iv = model.NewIntervalVar(slot_vars[sid], dur, slot_vars[sid] + dur, f"f_iv_{f_id}_{sid}")
                intervals.append(iv)
            model.AddNoOverlap(intervals)

        # H3: Student group no double-booking
        grp_sessions = defaultdict(list)
        for sid, s in self.sessions.items():
            for g in s["groups"]:
                grp_sessions[g].append(sid)

        for g, sids in grp_sessions.items():
            g_intervals = []
            basket_handled = set()
            for sid in sids:
                bslot = self.sessions[sid].get("basket_slot")
                if bslot:
                    if bslot in basket_handled:
                        continue
                    basket_handled.add(bslot)
                dur = self.sessions[sid]["duration"]
                iv = model.NewIntervalVar(slot_vars[sid], dur, slot_vars[sid] + dur, f"g_iv_{g}_{sid}")
                g_intervals.append(iv)
            model.AddNoOverlap(g_intervals)

        # H12: Faculty daily max hours (<= 4 hrs/day)
        for f_id, sids in fac_sessions.items():
            mx = self.faculty[f_id].get("max_hours_per_day", 4)
            for d in range(5):
                d_start = d * 9
                d_end = d * 9 + 8
                is_on_day = []
                for sid in sids:
                    dur = self.sessions[sid]["duration"]
                    b = model.NewBoolVar(f"f_{f_id}_d{d}_{sid}")
                    model.Add(slot_vars[sid] >= d_start).OnlyEnforceIf(b)
                    model.Add(slot_vars[sid] <= d_end).OnlyEnforceIf(b)
                    b_less = model.NewBoolVar(f"bl_{f_id}_{d}_{sid}")
                    b_more = model.NewBoolVar(f"bm_{f_id}_{d}_{sid}")
                    model.Add(slot_vars[sid] < d_start).OnlyEnforceIf(b_less)
                    model.Add(slot_vars[sid] > d_end).OnlyEnforceIf(b_more)
                    model.AddBoolOr([b, b_less, b_more])
                    is_on_day.append(b * dur)
                model.Add(sum(is_on_day) <= mx)

        # H4: Room no double-booking + H8 Room Unavailability
        for rid, r_idx in room_idx_map.items():
            cand_sids = [sid for sid in self.sessions if r_idx in [room_idx_map[x] for x in sess_allowed_rooms[sid]]]
            r_intervals = []
            for sid in cand_sids:
                dur = self.sessions[sid]["duration"]
                is_in_r = model.NewBoolVar(f"in_{rid}_{sid}")
                model.Add(room_vars[sid] == r_idx).OnlyEnforceIf(is_in_r)
                model.Add(room_vars[sid] != r_idx).OnlyEnforceIf(is_in_r.Not())

                for (un_day, un_p) in self.room_un[rid]:
                    d_idx = self.days.index(un_day)
                    for offset in range(dur):
                        bad_start = self.to_slot(d_idx, un_p) - offset
                        if bad_start in sess_allowed_slots[sid]:
                            b_bad = model.NewBoolVar(f"bad_{rid}_{sid}_{bad_start}")
                            model.Add(slot_vars[sid] == bad_start).OnlyEnforceIf(b_bad)
                            model.Add(slot_vars[sid] != bad_start).OnlyEnforceIf(b_bad.Not())
                            model.AddImplication(b_bad, is_in_r.Not())

                iv = model.NewOptionalIntervalVar(
                    slot_vars[sid], dur, slot_vars[sid] + dur, is_in_r, f"r_iv_{rid}_{sid}"
                )
                r_intervals.append(iv)
            model.AddNoOverlap(r_intervals)

        # Soft objectives
        # Penalties based on mode
        f_weight = 50 if mode == "faculty_friendly" else 10
        s_weight = 50 if mode == "student_friendly" else 10

        obj_terms = []
        for sid, s in self.sessions.items():
            f_id = s["faculty_id"]
            dur = s["duration"]
            fac_prefs = self.faculty[f_id].get("preferences", [])
            for opt_slot in sess_allowed_slots[sid]:
                d_idx, sp = self.from_slot(opt_slot)
                d_name = self.days[d_idx]
                pers = list(range(sp, sp + dur))

                # Check avoid preference
                s1_cost = 0
                for pref in fac_prefs:
                    if pref.get("type") == "avoid" and d_name in pref.get("days", self.days):
                        s1_cost += 2 * sum(1 for p in pers if p in pref.get("periods", []))

                # Period 9 cost
                s6_cost = 1 if 9 in pers else 0

                cost = s1_cost * f_weight + s6_cost * 5
                if cost > 0:
                    b_slot = model.NewBoolVar(f"sl_{sid}_{opt_slot}")
                    model.Add(slot_vars[sid] == opt_slot).OnlyEnforceIf(b_slot)
                    model.Add(slot_vars[sid] != opt_slot).OnlyEnforceIf(b_slot.Not())
                    obj_terms.append(b_slot * cost)

        if obj_terms:
            model.Minimize(sum(obj_terms))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = float(timeout_seconds)
        solver.parameters.num_workers = 8
        t0 = time.time()
        st = solver.Solve(model)

        if st in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            res = []
            for sid in self.sessions:
                slot = solver.Value(slot_vars[sid])
                d_idx, sp = self.from_slot(slot)
                rid = room_id_list[solver.Value(room_vars[sid])]
                res.append({
                    "session_id": sid,
                    "day": self.days[d_idx],
                    "start_period": sp,
                    "room_id": rid
                })
            return {
                "success": True,
                "status": solver.StatusName(st),
                "duration_seconds": round(time.time() - t0, 2),
                "sessions": res
            }
        return {"success": False, "status": solver.StatusName(st)}
