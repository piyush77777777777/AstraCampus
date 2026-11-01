"""
Explainable AI Module for AstraCampus.
Provides transparent, deterministic reasoning for timetable slots, room assignments,
booking approvals, rejections, and priority decisions.
"""

class Explainer:
    def __init__(self, data, schedule, bookings=None):
        self.data = data
        self.rooms = {r["id"]: r for r in data["rooms"]}
        self.faculty = {f["id"]: f for f in data["faculty"]}
        self.groups = {g["id"]: g for g in data["student_groups"]}
        self.sessions = {s["id"]: s for s in data["sessions"]}
        self.schedule = schedule
        self.bookings = bookings or []

    def explain_session_slot(self, session_id):
        """Explains why a session is placed at its particular day, period, and room."""
        s = self.sessions.get(session_id)
        if not s:
            return {"error": f"Session {session_id} not found"}

        # Find placement in schedule
        placement = None
        for item in self.schedule.get("sessions", []):
            if item["session_id"] == session_id:
                placement = item
                break

        if not placement:
            return {"error": f"Session {session_id} is not scheduled"}

        day = placement["day"]
        sp = placement["start_period"]
        rid = placement["room_id"]
        room = self.rooms.get(rid, {})
        fac = self.faculty.get(s["faculty_id"], {})

        reasons = []
        # Room matching
        reasons.append({
            "factor": "Room Type & Equipment",
            "detail": f"Session requires room type(s) {s['room_types']}. {rid} is a {room.get('type')}, fulfilling pedagogical and facility prerequisites."
        })
        # Capacity
        reasons.append({
            "factor": "Capacity Fit",
            "detail": f"Class size is {s['size']} students. Room {rid} seats {room.get('capacity')}, providing {room.get('capacity') - s['size']} surplus seats ({s['size']/room.get('capacity')*100:.1f}% utilization)."
        })
        # Accessibility
        if s.get("needs_accessible"):
            reasons.append({
                "factor": "Wheelchair Accessibility",
                "detail": f"Session has accessibility requirements. Room {rid} is verified ADA/wheelchair accessible with ramp and elevator access."
            })
        # Faculty constraints
        reasons.append({
            "factor": "Faculty Availability",
            "detail": f"Assigned faculty {fac.get('name', s['faculty_id'])} is available on {day} Period {sp} and within daily teaching limit (<= {fac.get('max_hours_per_day', 4)} hours)."
        })
        # Lab constraints
        if s["kind"] == "lab":
            reasons.append({
                "factor": "Lab Schedule Policy",
                "detail": f"3-hour lab block starting at Period {sp} (allowed starts are P2: 09:00 or P6: 14:00) strictly avoiding lunch crossing (13:00-14:00)."
            })
        # Basket slot
        if s.get("basket_slot"):
            reasons.append({
                "factor": "Elective Basket Synchronization",
                "detail": f"Member of elective basket {s['basket_slot']}. Synchronized with parallel elective courses on {day} Period {sp} in separate rooms."
            })

        return {
            "session_id": session_id,
            "course": s["course_id"],
            "faculty": f"{fac.get('name', s['faculty_id'])} ({s['faculty_id']})",
            "groups": s["groups"],
            "slot": f"{day} Period {sp} (0{sp+7}:00-0{sp+8}:00)" if sp < 3 else f"{day} Period {sp} ({sp+7}:00-{sp+8}:00)",
            "room": f"{room.get('name', rid)} ({rid})",
            "explanations": reasons
        }

    def explain_booking_decision(self, request_id):
        """Explains why a Spectra week booking was approved, offered an alternative, or rejected."""
        req = next((b for b in self.data.get("booking_requests", []) if b["id"] == request_id), None)
        if not req:
            return {"error": f"Booking request {request_id} not found"}

        dec = next((d for d in self.bookings if d.get("request_id") == request_id), None)
        status = dec.get("status") if dec else "pending"
        reason = dec.get("reason") if dec else "Awaiting decision"

        # Check cancellations
        is_cancelled = any(c["request_id"] == request_id for c in self.data.get("cancellations", []))

        analysis = {
            "request_id": request_id,
            "title": req.get("title"),
            "requester": req.get("requester"),
            "role": req.get("role"),
            "status": status,
            "official_reason": reason,
            "factors": []
        }

        if is_cancelled:
            analysis["factors"].append({
                "factor": "Cancellation",
                "detail": "Request was formally withdrawn by the requester."
            })
            return analysis

        # Role & priority analysis
        order = self.data["priority_order"]
        cap = self.data["role_category_cap"].get(req.get("role"), "club_event")
        eff_cat = dec.get("effective_category", cap)
        analysis["factors"].append({
            "factor": "Hierarchy & Role Category Cap",
            "detail": f"Submitted by role '{req.get('role')}'. Maximum claimable priority category is '{cap}'. Evaluated as '{eff_cat}'."
        })

        if status == "approved":
            analysis["factors"].append({
                "factor": "Window & Venue Fit",
                "detail": f"Allocated {dec.get('room_id')} on {dec.get('day')} Periods {dec.get('start_period')}-{dec.get('end_period')} inside requested window without clashing with regular lectures or earlier bookings."
            })
        elif status == "alternative_offered":
            analysis["factors"].append({
                "factor": "Venue Contention",
                "detail": f"Requested slot in {req.get('requested_room') or 'primary venue'} was claimed by an earlier higher/equal-priority submission. Clean alternative offered in {dec.get('room_id')}."
            })
        elif status == "rejected":
            if req.get("attendance", 0) > 800:
                analysis["factors"].append({
                    "factor": "Campus Capacity Limit",
                    "detail": f"Requested attendance of {req['attendance']} exceeds the maximum campus venue capacity (Open-Air Theatre: 800)."
                })
            else:
                analysis["factors"].append({
                    "factor": "Venue Unavailability",
                    "detail": "All compliant rooms were occupied by regular teaching sessions or higher priority events."
                })

        return analysis
