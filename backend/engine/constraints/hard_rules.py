"""
Hard Constraint definitions and validations mirroring the official validator.
Each constraint provides a reason code and clear human-readable explanation.
"""

from collections import defaultdict

RULE_DESCRIPTIONS = {
    "H1": "Every session must be scheduled exactly once with valid day, start period, and room.",
    "H2": "A faculty member cannot be double-booked in two places at the same time.",
    "H3": "A student group cannot be double-booked in two places at the same time (except elective basket sessions).",
    "H4": "A room cannot be double-booked by two sessions or events at the same time.",
    "H5": "Room capacity must be at least the session size (halved effective capacity during exams).",
    "H6": "Room type must match what the session requires (e.g. Physics lab only in Physics lab).",
    "H7": "Faculty unavailability (leave/commitments) must be strictly respected.",
    "H8": "Room unavailability (maintenance/closures) must be strictly respected.",
    "H9": "No session can run across lunch (13:00-14:00). 3-hour labs can only start at P2 or P6.",
    "H10": "Sessions requiring accessibility must be assigned an accessible room.",
    "H11": "All sessions in the same elective basket must run at the exact same day and start period.",
    "H12": "A faculty member cannot teach more than their daily limit (4 hours in CIT).",
    "H13": "Approved bookings must not clash with rooms, classes, or mandatory groups, and must fit in requested windows.",
    "H14": "A session with a fixed slot must stay in that exact slot."
}

def validate_timetable_rules(data, assign):
    """
    assign: dict of session_id -> (day, start_period, room_id)
    Returns: list of violations [{"rule": "H...", "where": "timetable", "detail": "..."}]
    """
    violations = []
    days = data["calendar"]["days"]
    lunch = data["calendar"]["lunch"]["after_period"]
    lab_starts = set(data["calendar"]["lab_start_periods"])
    rooms = {r["id"]: r for r in data["rooms"]}
    faculty = {f["id"]: f for f in data["faculty"]}
    sessions = {s["id"]: s for s in data["sessions"]}

    fac_un = defaultdict(set)
    for f in data["faculty"]:
        for u in f.get("unavailable", []):
            for p in u["periods"]:
                fac_un[f["id"]].add((u["day"], p))

    room_un = defaultdict(set)
    for u in data.get("room_unavailability", []):
        for p in u["periods"]:
            room_un[u["room_id"]].add((u["day"], p))

    room_occ = defaultdict(list)
    fac_occ = defaultdict(list)
    grp_occ = defaultdict(set)
    fac_day = defaultdict(int)
    basket_time = defaultdict(set)

    for sid in sessions:
        if sid not in assign:
            violations.append({"rule": "H1", "where": "timetable", "detail": f"Session {sid} is not scheduled"})

    for sid, (day, start, rid) in assign.items():
        s = sessions.get(sid)
        if s is None:
            violations.append({"rule": "H1", "where": "timetable", "detail": f"Unknown session id {sid}"})
            continue
        if day not in days:
            violations.append({"rule": "H1", "where": "timetable", "detail": f"{sid}: invalid day {day}"})
            continue
        if not isinstance(start, int) or start < 1 or start + s["duration"] - 1 > 9:
            violations.append({"rule": "H9", "where": "timetable", "detail": f"{sid}: runs outside P1-P9"})
            continue

        r = rooms.get(rid)
        if r is None:
            violations.append({"rule": "H1", "where": "timetable", "detail": f"{sid}: unknown room {rid}"})
            continue

        per = list(range(start, start + s["duration"]))
        if per[0] <= lunch < per[-1]:
            violations.append({"rule": "H9", "where": "timetable", "detail": f"{sid}: crosses lunch ({day} P{per[0]}-P{per[-1]})"})
        if s["kind"] == "lab" and start not in lab_starts:
            violations.append({"rule": "H9", "where": "timetable", "detail": f"{sid}: lab must start at P2 or P6"})

        fx = s.get("fixed_slot")
        if fx and (fx["day"] != day or fx["start_period"] != start):
            violations.append({"rule": "H14", "where": "timetable", "detail": f"{sid}: fixed slot violated"})

        if r["capacity"] < s["size"]:
            violations.append({"rule": "H5", "where": "timetable", "detail": f"{sid}: size {s['size']} > {rid} cap {r['capacity']}"})

        if r["type"] not in s["room_types"]:
            violations.append({"rule": "H6", "where": "timetable", "detail": f"{sid}: needs {s['room_types']}, {rid} is {r['type']}"})

        if s.get("needs_accessible") and not r.get("accessible", False):
            violations.append({"rule": "H10", "where": "timetable", "detail": f"{sid}: needs accessible room, {rid} is not"})

        f_id = s["faculty_id"]
        for p in per:
            room_occ[(rid, day, p)].append(sid)
            fac_occ[(f_id, day, p)].append(sid)
            bkey = s.get("basket_slot") or sid
            for g in s["groups"]:
                grp_occ[(g, day, p)].add(bkey)

            if (day, p) in fac_un[f_id]:
                violations.append({"rule": "H7", "where": "timetable", "detail": f"{sid}: faculty {f_id} unavailable {day} P{p}"})
            if (day, p) in room_un[rid]:
                violations.append({"rule": "H8", "where": "timetable", "detail": f"{sid}: room {rid} unavailable {day} P{p}"})

        fac_day[(f_id, day)] += s["duration"]
        if s.get("basket_slot"):
            basket_time[s["basket_slot"]].add((day, start))

    for (rid, day, p), sids in room_occ.items():
        if len(sids) > 1:
            violations.append({"rule": "H4", "where": "timetable", "detail": f"{rid} double-booked {day} P{p}: {', '.join(sorted(sids))}"})

    for (f_id, day, p), sids in fac_occ.items():
        if len(sids) > 1:
            violations.append({"rule": "H2", "where": "timetable", "detail": f"{f_id} double-booked {day} P{p}: {', '.join(sorted(sids))}"})

    for (g, day, p), keys in grp_occ.items():
        if len(keys) > 1:
            violations.append({"rule": "H3", "where": "timetable", "detail": f"Group {g} double-booked {day} P{p}: {', '.join(sorted(keys))}"})

    for b, times in basket_time.items():
        if len(times) > 1:
            violations.append({"rule": "H11", "where": "timetable", "detail": f"Basket {b} not synchronized: {sorted(times)}"})

    for (f_id, day), h in fac_day.items():
        mx = faculty[f_id].get("max_hours_per_day", 4)
        if h > mx:
            violations.append({"rule": "H12", "where": "timetable", "detail": f"{f_id} teaches {h} hrs on {day} (limit {mx})"})

    return violations
