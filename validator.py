#!/usr/bin/env python3
"""
Official Checker / Validator for CIT Timetable & Venue Management Hackathon.
Usage:
    python validator.py [path_to_schedule.json]
    python validator.py exports/schedule.json exports/schedule_after.json
"""

import sys
import json
import os

def load_json(filepath):
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        sys.exit(1)
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate_schedule(data):
    violations = []
    soft_penalties = []

    rooms = {r['id']: r for r in data.get('rooms', [])}
    faculty = {f['id']: f for f in data.get('faculty', [])}
    groups = {g['id']: g for g in data.get('studentGroups', [])}
    sessions = data.get('sessions', [])

    room_slots = {}
    faculty_slots = {}
    group_slots = {}
    fac_daily_hours = {}

    for s in sessions:
        s_id = s.get('id', 'UNKNOWN')
        day = s.get('day')
        period = s.get('startPeriod')
        r_id = s.get('roomId')
        f_id = s.get('facultyId')
        g_id = s.get('studentGroupId')
        dur = s.get('durationHours', 1)
        is_lab = s.get('isLab', False)
        room_type = s.get('roomType')

        # 1. Complete session check
        if not (day and period and r_id and f_id and g_id):
            violations.append(f"Session {s_id} is incomplete.")
            continue

        # 2. Room double-booking
        r_key = f"{r_id}_{day}_{period}"
        if r_key in room_slots:
            violations.append(f"Room {r_id} double booked at {day} {period} by {s_id} and {room_slots[r_key]}")
        else:
            room_slots[r_key] = s_id

        # 3. Faculty double-booking
        f_key = f"{f_id}_{day}_{period}"
        if f_key in faculty_slots:
            violations.append(f"Faculty {f_id} double booked at {day} {period} by {s_id} and {faculty_slots[f_key]}")
        else:
            faculty_slots[f_key] = s_id

        # 4. Student group double-booking
        g_key = f"{g_id}_{day}_{period}"
        if g_key in group_slots:
            violations.append(f"Student Group {g_id} double booked at {day} {period} by {s_id} and {group_slots[g_key]}")
        else:
            group_slots[g_key] = s_id

        # 5. Room capacity
        room = rooms.get(r_id)
        grp = groups.get(g_id)
        if room and grp and room.get('capacity', 0) < grp.get('size', 0):
            violations.append(f"Room {r_id} capacity ({room['capacity']}) < Group {g_id} size ({grp['size']})")

        # 6. Lab room type
        if is_lab and room and room.get('type') != room_type:
            violations.append(f"Lab session {s_id} requires {room_type} but placed in {room.get('type')}")

        # 7. Lunch boundary
        if period == 'LUNCH' or (is_lab and period == 'P4'):
            violations.append(f"Session {s_id} crosses into lunch break (13:00 - 14:00)")

        # 8. Faculty daily limit <= 4 hours
        fd_key = f"{f_id}_{day}"
        fac_daily_hours[fd_key] = fac_daily_hours.get(fd_key, 0) + dur
        if fac_daily_hours[fd_key] > 4:
            violations.append(f"Faculty {f_id} exceeds daily limit (4h) on {day}: {fac_daily_hours[fd_key]}h")

        # Soft penalties
        if period == 'P9':
            soft_penalties.append(f"Session {s_id} scheduled in late P9 period (17:00)")
        fac_obj = faculty.get(f_id)
        if fac_obj and any(av.get('day') == day and av.get('period') == period for av in fac_obj.get('avoidSlots', [])):
            soft_penalties.append(f"Faculty {f_id} scheduled in avoided time slot ({day} {period})")

    hard_penalty = len(violations) * 3
    correctness_score = max(0, 25 - hard_penalty)

    return {
        "total_sessions": len(sessions),
        "total_teaching_hours": sum(s.get('durationHours', 1) for s in sessions),
        "hard_violations_count": len(violations),
        "hard_violations": violations,
        "soft_penalties_count": len(soft_penalties),
        "soft_penalties": soft_penalties,
        "correctness_score": correctness_score,
        "max_correctness_marks": 25
    }

def main():
    path1 = sys.argv[1] if len(sys.argv) > 1 else 'exports/schedule.json'
    print(f"==================================================")
    print(f"      CIT ASTRACAMPUS OFFICIAL SCHEDULE VALIDATOR ")
    print(f"==================================================")
    print(f"Checking timetable: {path1}...\n")

    data = load_json(path1)
    res = validate_schedule(data)

    print(f"Total Sessions Checked : {res['total_sessions']}")
    print(f"Total Teaching Hours   : {res['total_teaching_hours']}")
    print(f"Hard Constraint Violations: {res['hard_violations_count']}")
    if res['hard_violations']:
        for v in res['hard_violations']:
            print(f"  [HARD VIOLATION] {v}")
    else:
        print("  [PASS] Zero hard constraint violations! (100% clash-free)")

    print(f"Soft Penalties Count   : {res['soft_penalties_count']}")
    print(f"\n>>> FINAL SCHEDULING SCORE: {res['correctness_score']} / {res['max_correctness_marks']} MARKS <<<")

    # If rescheduling comparison provided
    if len(sys.argv) > 2:
        path2 = sys.argv[2]
        print(f"\nChecking Rescheduled Timetable: {path2}...")
        data2 = load_json(path2)
        res2 = validate_schedule(data2)
        moved_count = data2.get('movedSessionsCount', len(data2.get('moves', [])))
        print(f"Hard Violations after change: {res2['hard_violations_count']} (6/6 marks if 0)")
        print(f"Sessions Moved              : {moved_count} (5/5 marks for minimal displacement)")
        print(f"Rescheduling Score          : {'15/15' if res2['hard_violations_count'] == 0 and moved_count <= 4 else '10/15'}")

if __name__ == '__main__':
    main()
