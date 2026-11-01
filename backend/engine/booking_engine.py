"""
Spectra Week (Week 7) Venue Booking & Allocation Engine.
Implements the multi-tiered priority hierarchy, role caps, conflict validation,
and automatic alternative venue search with clear reasoning.
"""

from collections import defaultdict

class BookingEngine:
    def __init__(self, data, baseline_timetable):
        self.data = data
        self.rooms = {r["id"]: r for r in data["rooms"]}
        self.priority_order = data["priority_order"]
        self.role_caps = data["role_category_cap"]
        self.cancellations = {c["request_id"]: c for c in data.get("cancellations", [])}
        self.sessions = {s["id"]: s for s in data["sessions"]}
        self.baseline = baseline_timetable

        self.room_un = defaultdict(set)
        for u in data.get("room_unavailability", []):
            for p in u["periods"]:
                self.room_un[u["room_id"]].add((u["day"], p))

    def effective_category(self, req):
        role = req.get("role", "club")
        cap = self.role_caps.get(role, "club_event")
        req_cat = req.get("requested_category", "club_event")
        order = self.priority_order
        a = order.index(req_cat) if req_cat in order else len(order) - 1
        cap_idx = order.index(cap) if cap in order else len(order) - 1
        return order[max(a, cap_idx)]

    def solve(self):
        # Build base room occupancy
        room_busy = defaultdict(list)
        grp_busy = defaultdict(set)
        for item in self.baseline.get("sessions", []):
            sid = item["session_id"]
            day = item["day"]
            sp = item["start_period"]
            rid = item["room_id"]
            s = self.sessions.get(sid)
            if s:
                for p in range(sp, sp + s["duration"]):
                    room_busy[(rid, day, p)].append(sid)
                    for g in s["groups"]:
                        grp_busy[(g, day, p)].add(sid)

        # Sort booking requests strictly by priority then submitted_at
        reqs = self.data.get("booking_requests", [])
        sorted_reqs = sorted(
            reqs,
            key=lambda r: (self.priority_order.index(self.effective_category(r)), r.get("submitted_at", ""))
        )

        decisions = []
        overrides = []
        max_score = 0
        actual_score = 0

        CAT_WEIGHT = {
            "institute_event": 5,
            "guest_lecture": 4,
            "department_event": 3,
            "club_event": 2
        }

        for req in sorted_reqs:
            req_id = req["id"]
            eff_cat = self.effective_category(req)
            weight = CAT_WEIGHT.get(eff_cat, 2)

            if req_id not in self.cancellations:
                max_score += weight

            # 1. Check if cancelled
            if req_id in self.cancellations:
                c_info = self.cancellations[req_id]
                note = c_info.get("note", "Withdrawn by requester")
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "effective_category": eff_cat,
                    "reason": f"Request was cancelled ({note})"
                })
                continue

            att = req["attendance"]
            dur = req["duration_periods"]
            needs = set(req.get("needs", []))
            mand_groups = req.get("mandatory_for_groups", [])
            req_room = req.get("requested_room")

            # Check campus max capacity
            max_cap = max(r["capacity"] for r in self.data["rooms"] if "event" in r.get("allowed_uses", []))
            if att > max_cap:
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "effective_category": eff_cat,
                    "reason": f"No venue on campus seats {att} (largest is OAT at {max_cap})"
                })
                continue

            # Eligible rooms
            eligible_rooms = []
            for r in self.data["rooms"]:
                if "event" not in r.get("allowed_uses", []):
                    continue
                if r["type"] not in req["room_types"]:
                    continue
                if r["capacity"] < att:
                    continue
                feats = set(r.get("features", [])) | ({"accessible"} if r.get("accessible") else set())
                if not needs.issubset(feats):
                    continue
                eligible_rooms.append(r["id"])

            if not eligible_rooms:
                type_rooms = [r for r in self.data["rooms"] if r["type"] in req["room_types"]]
                if not type_rooms:
                    reason = f"No venue of requested type ({req['room_types']}) exists for events"
                elif all(r["capacity"] < att for r in type_rooms):
                    reason = f"No venue of requested type seats {att} attendees"
                elif needs:
                    reason = f"No venue has all required amenities: {sorted(needs)}"
                else:
                    reason = "No eligible venues match constraints"
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "effective_category": eff_cat,
                    "reason": reason
                })
                continue

            # Prioritize requested room if eligible
            if req_room and req_room in eligible_rooms:
                eligible_rooms.sort(key=lambda x: 0 if x == req_room else 1)

            # Try to place within requested windows
            approved_slot = None
            for win in req.get("windows", []):
                day = win["day"]
                from_p = win["from_period"]
                to_p = win["to_period"]

                for sp in range(from_p, to_p - dur + 2):
                    ep = sp + dur - 1
                    if ep > 13:
                        continue
                    pers = list(range(sp, ep + 1))
                    # Check mandatory groups
                    if any(grp_busy[(g, day, p)] for g in mand_groups for p in pers):
                        continue
                    # Check room availability
                    for rid in eligible_rooms:
                        if any((day, p) in self.room_un[rid] for p in pers):
                            continue
                        if not any(room_busy[(rid, day, p)] for p in pers):
                            approved_slot = (rid, day, sp, ep)
                            break
                    if approved_slot:
                        break
                if approved_slot:
                    break

            if approved_slot:
                rid, day, sp, ep = approved_slot
                for p in range(sp, ep + 1):
                    room_busy[(rid, day, p)].append(req_id)
                decisions.append({
                    "request_id": req_id,
                    "status": "approved",
                    "effective_category": eff_cat,
                    "day": day,
                    "start_period": sp,
                    "end_period": ep,
                    "room_id": rid,
                    "reason": f"Approved for {rid} during requested window"
                })
                actual_score += weight
                continue

            # Try to find alternative slot
            alt_slot = None
            for day in self.data["calendar"]["days"]:
                for sp in range(10, 14 - dur):
                    ep = sp + dur - 1
                    pers = list(range(sp, ep + 1))
                    if any(grp_busy[(g, day, p)] for g in mand_groups for p in pers):
                        continue
                    for rid in eligible_rooms:
                        if any((day, p) in self.room_un[rid] for p in pers):
                            continue
                        if not any(room_busy[(rid, day, p)] for p in pers):
                            alt_slot = (rid, day, sp, ep)
                            break
                    if alt_slot:
                        break
                if alt_slot:
                    break

            if alt_slot:
                rid, day, sp, ep = alt_slot
                for p in range(sp, ep + 1):
                    room_busy[(rid, day, p)].append(req_id)
                decisions.append({
                    "request_id": req_id,
                    "status": "alternative_offered",
                    "effective_category": eff_cat,
                    "day": day,
                    "start_period": sp,
                    "end_period": ep,
                    "room_id": rid,
                    "reason": f"Requested slot in {req.get('requested_room') or 'primary venue'} was booked by an earlier request; alternative provided in {rid}"
                })
                actual_score += weight * 0.5
            else:
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "effective_category": eff_cat,
                    "reason": "Requested window in conflict and no alternative venue was free"
                })

        return {
            "bookings": decisions,
            "session_overrides": overrides,
            "booking_score": actual_score,
            "max_score": max_score,
            "approved_count": sum(1 for d in decisions if d["status"] == "approved"),
            "alt_count": sum(1 for d in decisions if d["status"] == "alternative_offered"),
            "rejected_count": sum(1 for d in decisions if d["status"] == "rejected")
        }
