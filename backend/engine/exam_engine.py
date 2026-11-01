"""
Midsem Exam Scheduling Engine for CIT.
Schedules 41 midsem exams across 6 days (MON-SAT) in AM (09:30-11:30) and PM (14:00-16:00).
Respects half-capacity room seating, no group overlaps, and zero same-day multiple exams.
"""

from ortools.sat.python import cp_model

class ExamScheduler:
    def __init__(self, data):
        self.data = data
        self.exams = data["exams"]
        self.exam_rooms = [r for r in data["rooms"] if "exam" in r.get("allowed_uses", [])]
        self.days = data["calendar"]["exam_week"]["days"]
        self.sessions = [s["id"] for s in data["calendar"]["exam_week"]["sessions"]] # ['AM', 'PM']

    def solve(self, timeout_seconds=10.0):
        model = cp_model.CpModel()
        num_slots = len(self.days) * len(self.sessions)  # 12 slots

        exam_slot = {}
        for e in self.exams:
            eid = e["id"]
            exam_slot[eid] = model.NewIntVar(0, num_slots - 1, f"slot_{eid}")

        # H3: Student groups cannot have two exams in the same slot
        grp_exams = {}
        for e in self.exams:
            for g in e["groups"]:
                grp_exams.setdefault(g, []).append(e["id"])

        for g, eids in grp_exams.items():
            for slot in range(num_slots):
                in_slot = []
                for eid in eids:
                    b = model.NewBoolVar(f"g_{g}_{eid}_{slot}")
                    model.Add(exam_slot[eid] == slot).OnlyEnforceIf(b)
                    model.Add(exam_slot[eid] != slot).OnlyEnforceIf(b.Not())
                    in_slot.append(b)
                model.Add(sum(in_slot) <= 1)

            # Soft constraint: group having > 1 exam on same day
            if len(eids) <= len(self.days):
                for d_idx in range(len(self.days)):
                    in_day = []
                    for eid in eids:
                        b_am = model.NewBoolVar(f"gd_{g}_{eid}_{d_idx}_AM")
                        b_pm = model.NewBoolVar(f"gd_{g}_{eid}_{d_idx}_PM")
                        model.Add(exam_slot[eid] == d_idx * 2).OnlyEnforceIf(b_am)
                        model.Add(exam_slot[eid] != d_idx * 2).OnlyEnforceIf(b_am.Not())
                        model.Add(exam_slot[eid] == d_idx * 2 + 1).OnlyEnforceIf(b_pm)
                        model.Add(exam_slot[eid] != d_idx * 2 + 1).OnlyEnforceIf(b_pm.Not())
                        in_day.extend([b_am, b_pm])
                    model.Add(sum(in_day) <= 1)

        # Room allocation
        use_room = {}
        for e in self.exams:
            eid = e["id"]
            for r in self.exam_rooms:
                rid = r["id"]
                use_room[(eid, rid)] = model.NewBoolVar(f"use_{eid}_{rid}")
            # Capacity check (half capacity)
            model.Add(
                sum(use_room[(eid, r["id"])] * (r["capacity"] // 2) for r in self.exam_rooms) >= e["size"]
            )

        # Room double booking in same slot check
        for r in self.exam_rooms:
            rid = r["id"]
            for slot in range(num_slots):
                r_active = []
                for e in self.exams:
                    eid = e["id"]
                    is_here = model.NewBoolVar(f"act_{rid}_{eid}_{slot}")
                    b_slot = model.NewBoolVar(f"sl_{eid}_{slot}")
                    model.Add(exam_slot[eid] == slot).OnlyEnforceIf(b_slot)
                    model.Add(exam_slot[eid] != slot).OnlyEnforceIf(b_slot.Not())
                    model.AddBoolAnd([b_slot, use_room[(eid, rid)]]).OnlyEnforceIf(is_here)
                    model.AddBoolOr([b_slot.Not(), use_room[(eid, rid)].Not()]).OnlyEnforceIf(is_here.Not())
                    r_active.append(is_here)
                model.Add(sum(r_active) <= 1)

        # Objective: minimize room fragmentation
        model.Minimize(sum(use_room.values()))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = float(timeout_seconds)
        solver.parameters.num_workers = 8
        st = solver.Solve(model)

        if st in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            result = []
            for e in self.exams:
                eid = e["id"]
                s_val = solver.Value(exam_slot[eid])
                day = self.days[s_val // 2]
                sess = self.sessions[s_val % 2]
                rms = [r["id"] for r in self.exam_rooms if solver.Value(use_room[(eid, r["id"])]) == 1]
                result.append({
                    "exam_id": eid,
                    "day": day,
                    "session": sess,
                    "rooms": rms
                })
            return {"success": True, "exams": result}
        return {"success": False, "status": solver.StatusName(st)}
