"""
Soft Constraint definitions and scoring mirroring the official validator.
"""

from collections import defaultdict

SOFT_RULE_INFO = {
    "S1": {"name": "Faculty Preference", "weight": "2 pts/hour", "desc": "Faculty scheduled at a time they asked to avoid"},
    "S2": {"name": "Student Free Periods", "weight": "1 pt/gap period", "desc": "Free period between two classes on same day (excl. lunch)"},
    "S3": {"name": "Student Daily Load", "weight": "3 pts/hour > 6", "desc": "Student group has more than 6 hours of classes in a day"},
    "S4": {"name": "Repeat Course Lectures", "weight": "3 pts/extra lecture", "desc": "Group has two lectures of the same course on the same day"},
    "S5": {"name": "Low Room Occupancy", "weight": "1 pt/session", "desc": "Session uses less than 40% of the room's seating capacity"},
    "S6": {"name": "Late Evening Teaching", "weight": "1 pt/session", "desc": "Session scheduled in Period 9 (17:00-18:00)"}
}

def calculate_soft_penalties(data, assign):
    """
    assign: dict of session_id -> (day, start_period, room_id)
    Returns: (penalty_dict, total_penalty, penalty_breakdown)
    """
    pen = defaultdict(int)
    breakdown = defaultdict(list)
    rooms = {r["id"]: r for r in data["rooms"]}
    faculty = {f["id"]: f for f in data["faculty"]}
    sessions = {s["id"]: s for s in data["sessions"]}
    days = data["calendar"]["days"]

    grp_day = defaultdict(set)
    grp_hours = defaultdict(int)
    grp_course = defaultdict(int)
    seen_basket = set()

    for sid, (day, start, rid) in assign.items():
        s = sessions.get(sid)
        r = rooms.get(rid)
        if s is None or r is None:
            continue

        per = list(range(start, start + s["duration"]))
        f_id = s["faculty_id"]

        # S1: Faculty avoid preference
        for pref in faculty.get(f_id, {}).get("preferences", []):
            if pref.get("type") == "avoid" and day in pref.get("days", days):
                hit_periods = [p for p in per if p in pref.get("periods", [])]
                if hit_periods:
                    cost = 2 * len(hit_periods)
                    pen["S1"] += cost
                    breakdown["S1"].append(f"{f_id} teaches in avoided slot {day} P{hit_periods} ({cost} pts)")

        # S5: Low room occupancy (< 40%)
        if r["capacity"] and (s["size"] / r["capacity"] < 0.4):
            pen["S5"] += 1
            breakdown["S5"].append(f"{sid} (size {s['size']}) uses {r['capacity']} cap room {rid} ({s['size']/r['capacity']*100:.1f}%)")

        # S6: Period 9
        if 9 in per:
            pen["S6"] += 1
            breakdown["S6"].append(f"{sid} scheduled in P9 on {day}")

        # Group metrics
        for g in s["groups"]:
            for p in per:
                grp_day[(g, day)].add(p)
            if s.get("basket_slot"):
                if (g, s["basket_slot"]) in seen_basket:
                    continue
                seen_basket.add((g, s["basket_slot"]))
            grp_hours[(g, day)] += s["duration"]
            if s["kind"] == "lecture" and not s.get("basket_slot"):
                grp_course[(g, day, s["course_id"])] += 1

    # S2: Gaps between classes on same day
    for (g, day), ps in grp_day.items():
        if ps:
            gaps = [p for p in range(min(ps), max(ps) + 1) if p not in ps]
            if gaps:
                pen["S2"] += len(gaps)
                breakdown["S2"].append(f"Group {g} on {day} has {len(gaps)} gap periods: {gaps}")

    # S3: Daily hours > 6
    for (g, day), h in grp_hours.items():
        if h > 6:
            cost = 3 * (h - 6)
            pen["S3"] += cost
            breakdown["S3"].append(f"Group {g} on {day} has {h} hours of classes (+{h-6} hrs, {cost} pts)")

    # S4: Same course lecture twice in a day
    for (g, day, c_id), c in grp_course.items():
        if c > 1:
            cost = 3 * (c - 1)
            pen["S4"] += cost
            breakdown["S4"].append(f"Group {g} has {c} lectures of {c_id} on {day} ({cost} pts)")

    # S4 for basket courses
    bc = defaultdict(int)
    for sid, (day, start, rid) in assign.items():
        s = sessions.get(sid)
        if s and s.get("basket_slot"):
            bc[(s["course_id"], day)] += 1
    for (c_id, day), c in bc.items():
        if c > 1:
            cost = 3 * (c - 1)
            pen["S4"] += cost
            breakdown["S4"].append(f"Basket course {c_id} runs {c} times on {day} ({cost} pts)")

    for k in ("S1", "S2", "S3", "S4", "S5", "S6"):
        pen.setdefault(k, 0)

    total = sum(pen.values())
    return dict(sorted(pen.items())), total, dict(breakdown)
