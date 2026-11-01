"""
AstraCampus Backend API Server.
FastAPI REST server providing timetable generation, disruption handling,
Spectra bookings, midsem exams, AI Copilot NLP, and Explainable AI.
"""

import os, json
from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.services.data_manager import DataManager
from backend.services.auth import ROLES, DEMO_USERS, get_user_by_role
from backend.services.llm_gateway import LLMGateway
from backend.engine.solver import TimetableSolver
from backend.engine.booking_engine import BookingEngine
from backend.engine.exam_engine import ExamScheduler
from backend.engine.rescheduler import Rescheduler
from backend.engine.explainer import Explainer
from backend.engine.constraints.hard_rules import validate_timetable_rules, RULE_DESCRIPTIONS
from backend.engine.constraints.soft_rules import calculate_soft_penalties, SOFT_RULE_INFO

app = FastAPI(
    title="AstraCampus Engine API",
    description="Campus Command Center & Intelligent Scheduling Engine for Chilika Institute of Technology (CIT)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dm = DataManager.get_instance()
llm_gateway = LLMGateway(dm.raw_data)

@app.get("/api/status")
def get_status():
    sched = dm.current_schedule
    assign = {s["session_id"]: (s["day"], s["start_period"], s["room_id"]) for s in sched.get("sessions", [])}
    violations = validate_timetable_rules(dm.current_data, assign) if assign else []
    soft_pen, total_soft, _ = calculate_soft_penalties(dm.current_data, assign) if assign else ({}, 0, {})

    fest = sched.get("fest_week", {})
    bookings = fest.get("bookings", [])
    approved = sum(1 for b in bookings if b.get("status") == "approved")
    alts = sum(1 for b in bookings if b.get("status") == "alternative_offered")
    rejected = sum(1 for b in bookings if b.get("status") == "rejected")

    return {
        "app_name": "AstraCampus",
        "institute": "Chilika Institute of Technology (CIT)",
        "dataset_id": dm.current_data.get("dataset_id"),
        "hard_violations_count": len(violations),
        "hard_violations": violations,
        "soft_penalty_total": total_soft,
        "soft_penalties": soft_pen,
        "stats": {
            "rooms_count": len(dm.current_data.get("rooms", [])),
            "faculty_count": len(dm.current_data.get("faculty", [])),
            "student_groups_count": len(dm.current_data.get("student_groups", [])),
            "sessions_count": len(dm.current_data.get("sessions", [])),
            "exams_count": len(dm.current_data.get("exams", [])),
            "booking_requests_count": len(dm.current_data.get("booking_requests", [])),
            "approved_bookings": approved,
            "alternative_bookings": alts,
            "rejected_bookings": rejected
        },
        "has_active_disruption": dm.active_disruption is not None,
        "has_pending_disruption": dm.pending_disruption is not None
    }

@app.get("/api/users")
def get_demo_users():
    return {
        "users": DEMO_USERS,
        "roles_meta": ROLES
    }

@app.get("/api/data/all")
def get_all_data():
    return {
        "rooms": dm.current_data.get("rooms", []),
        "faculty": dm.current_data.get("faculty", []),
        "student_groups": dm.current_data.get("student_groups", []),
        "courses": dm.current_data.get("courses", []),
        "calendar": dm.current_data.get("calendar", {}),
        "room_unavailability": dm.current_data.get("room_unavailability", []),
        "cancellations": dm.current_data.get("cancellations", []),
        "priority_order": dm.current_data.get("priority_order", []),
        "role_category_cap": dm.current_data.get("role_category_cap", {})
    }

@app.get("/api/schedule")
def get_schedule():
    sched = dm.current_schedule
    assign = {s["session_id"]: (s["day"], s["start_period"], s["room_id"]) for s in sched.get("sessions", [])}
    violations = validate_timetable_rules(dm.current_data, assign) if assign else []
    soft_pen, total_soft, breakdown = calculate_soft_penalties(dm.current_data, assign) if assign else ({}, 0, {})

    # Map session details
    sess_dict = {s["id"]: s for s in dm.current_data.get("sessions", [])}
    fac_dict = {f["id"]: f for f in dm.current_data.get("faculty", [])}
    rooms_dict = {r["id"]: r for r in dm.current_data.get("rooms", [])}

    enriched = []
    for item in sched.get("sessions", []):
        sid = item["session_id"]
        s = sess_dict.get(sid, {})
        f = fac_dict.get(s.get("faculty_id"), {})
        r = rooms_dict.get(item["room_id"], {})
        enriched.append({
            **item,
            "course_id": s.get("course_id"),
            "kind": s.get("kind"),
            "groups": s.get("groups", []),
            "faculty_id": s.get("faculty_id"),
            "faculty_name": f.get("name", s.get("faculty_id")),
            "size": s.get("size"),
            "duration": s.get("duration", 1),
            "room_name": r.get("name", item["room_id"]),
            "room_type": r.get("type"),
            "room_capacity": r.get("capacity"),
            "basket_slot": s.get("basket_slot")
        })

    return {
        "dataset_id": dm.current_data.get("dataset_id"),
        "team": sched.get("team", "AstraCampus"),
        "sessions": enriched,
        "hard_violations": violations,
        "soft_penalties": soft_pen,
        "soft_total": total_soft,
        "soft_breakdown": breakdown,
        "rule_descriptions": RULE_DESCRIPTIONS,
        "soft_rule_info": SOFT_RULE_INFO
    }

@app.post("/api/schedule/solve")
def solve_schedule(mode: str = Body("balanced", embed=True)):
    solver = TimetableSolver(dm.current_data)
    res = solver.solve(mode=mode, timeout_seconds=20.0)
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=f"Solver failed: {res.get('status')}")

    dm.current_schedule["sessions"] = res["sessions"]
    dm.log_action("Admin", "SOLVE_TIMETABLE", f"Generated new timetable using CP-SAT (mode={mode})")

    # Update exports
    export_path = os.path.join(os.path.dirname(__file__), "..", "..", "exports", "schedule.json")
    with open(export_path, "w", encoding="utf-8") as f:
        json.dump(dm.current_schedule, f, indent=2)

    return res

@app.get("/api/exams")
def get_exams():
    exam_sched = dm.current_schedule.get("exams", [])
    if not exam_sched:
        scheduler = ExamScheduler(dm.current_data)
        res = scheduler.solve(timeout_seconds=10.0)
        if res.get("success"):
            exam_sched = res["exams"]
            dm.current_schedule["exams"] = exam_sched

    # Enrich exams with metadata
    ex_dict = {e["id"]: e for e in dm.current_data.get("exams", [])}
    rooms_dict = {r["id"]: r for r in dm.current_data.get("rooms", [])}

    enriched = []
    for item in exam_sched:
        eid = item["exam_id"]
        e = ex_dict.get(eid, {})
        seat_sum = sum(rooms_dict[rid]["capacity"] // 2 for rid in item.get("rooms", []) if rid in rooms_dict)
        enriched.append({
            **item,
            "course_ids": e.get("course_ids", []),
            "groups": e.get("groups", []),
            "size": e.get("size", 0),
            "allocated_seats_half_cap": seat_sum,
            "surplus_seats": seat_sum - e.get("size", 0),
            "duration_hours": e.get("duration_hours", 2)
        })

    return {
        "calendar": dm.current_data["calendar"]["exam_week"],
        "exams": enriched
    }

@app.get("/api/fest/bookings")
def get_fest_bookings():
    fest = dm.current_schedule.get("fest_week", {})
    bookings = fest.get("bookings", [])
    if not bookings:
        b_engine = BookingEngine(dm.current_data, dm.current_schedule)
        res = b_engine.solve()
        fest = {
            "bookings": res["bookings"],
            "session_overrides": res["session_overrides"]
        }
        dm.current_schedule["fest_week"] = fest
        bookings = fest["bookings"]

    # Enrich bookings
    req_dict = {r["id"]: r for r in dm.current_data.get("booking_requests", [])}
    dec_dict = {b["request_id"]: b for b in bookings}

    b_engine = BookingEngine(dm.current_data, dm.current_schedule)

    enriched_requests = []
    for req in dm.current_data.get("booking_requests", []):
        rid = req["id"]
        dec = dec_dict.get(rid, {})
        eff_cat = b_engine.effective_category(req)
        enriched_requests.append({
            **req,
            "effective_category": eff_cat,
            "decision": dec,
            "status": dec.get("status", "pending"),
            "allocated_room": dec.get("room_id"),
            "allocated_day": dec.get("day"),
            "allocated_start": dec.get("start_period"),
            "allocated_end": dec.get("end_period"),
            "reason": dec.get("reason", "")
        })

    return {
        "requests": enriched_requests,
        "session_overrides": fest.get("session_overrides", []),
        "booking_score": sum(
            (5 if r["effective_category"] == "institute_event" else
             4 if r["effective_category"] == "guest_lecture" else
             3 if r["effective_category"] == "department_event" else 2) *
            (1 if r["status"] == "approved" else 0.5 if r["status"] == "alternative_offered" else 0)
            for r in enriched_requests
        )
    }

@app.post("/api/disruption/preview")
def preview_disruption(disruption_payload: dict = Body(...)):
    """Runs disruption repair and impact analysis without committing."""
    rescheduler = Rescheduler(dm.current_data, dm.current_schedule)
    result = rescheduler.repair(disruption_payload)
    dm.pending_disruption = {
        "payload": disruption_payload,
        "result": result
    }
    return result

@app.post("/api/disruption/approve")
def approve_disruption():
    """Admin approves pending disruption, applying changes to active schedule."""
    if not dm.pending_disruption:
        # If no pending disruption, test load default sample disruption
        dis_file = os.path.join(os.path.dirname(__file__), "..", "data", "sample_disruption.json")
        with open(dis_file, "r", encoding="utf-8") as f:
            sample_dis = json.load(f)
        rescheduler = Rescheduler(dm.current_data, dm.current_schedule)
        result = rescheduler.repair(sample_dis)
        dm.pending_disruption = {
            "payload": sample_dis,
            "result": result
        }

    p = dm.pending_disruption
    dm.current_data = Rescheduler(dm.current_data, dm.current_schedule).apply_disruption_to_data(p["payload"])
    dm.current_schedule["sessions"] = p["result"]["repaired_schedule"]["sessions"]
    dm.active_disruption = p["payload"]
    dm.pending_disruption = None

    dm.log_action("Admin", "APPROVE_DISRUPTION", "Approved and applied schedule disruption changes.")

    # Write schedule_after.json
    export_after = os.path.join(os.path.dirname(__file__), "..", "..", "exports", "schedule_after.json")
    with open(export_after, "w", encoding="utf-8") as f:
        json.dump(dm.current_schedule, f, indent=2)

    return {"success": True, "message": "Disruption approved and schedule updated."}

@app.post("/api/disruption/reject")
def reject_disruption():
    dm.pending_disruption = None
    dm.log_action("Admin", "REJECT_DISRUPTION", "Rejected proposed disruption changes.")
    return {"success": True, "message": "Disruption proposal rejected."}

@app.post("/api/ai/parse")
def parse_ai_request(text: str = Body(..., embed=True), role: str = Body("club", embed=True)):
    return llm_gateway.parse_natural_language_request(text, user_role=role)

@app.post("/api/ai/explain")
def explain_decision(type: str = Body(..., embed=True), id: str = Body(..., embed=True)):
    explainer = Explainer(dm.current_data, dm.current_schedule, dm.current_schedule.get("fest_week", {}).get("bookings", []))
    if type == "session":
        return explainer.explain_session_slot(id)
    elif type == "booking":
        return explainer.explain_booking_decision(id)
    else:
        raise HTTPException(status_code=400, detail="Invalid explain type. Must be 'session' or 'booking'.")

@app.post("/api/admin/reset")
def reset_demo():
    return dm.reset_to_initial()

@app.get("/api/audit-log")
def get_audit_log():
    return {"audit_log": dm.audit_log}

@app.get("/api/export/schedule")
def download_schedule():
    export_path = os.path.join(os.path.dirname(__file__), "..", "exports", "schedule.json")
    if os.path.exists(export_path):
        return FileResponse(export_path, media_type="application/json", filename="schedule.json")
    return dm.current_schedule

@app.get("/api/download/source-code")
def download_source_code():
    zip_path = os.path.join(os.path.dirname(__file__), "..", "exports", "AstraCampus_SourceCode.zip")
    if os.path.exists(zip_path):
        return FileResponse(zip_path, media_type="application/zip", filename="AstraCampus_SourceCode.zip")
    raise HTTPException(status_code=404, detail="Source code archive not found.")

@app.get("/api/download/standalone")
def download_standalone_script():
    script_path = os.path.join(os.path.dirname(__file__), "..", "astracampus_standalone.py")
    if os.path.exists(script_path):
        return FileResponse(script_path, media_type="text/x-python", filename="astracampus_standalone.py")
    raise HTTPException(status_code=404, detail="Standalone script not found.")

# Static frontend mount if dist directory exists
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if not os.path.exists(dist_dir):
    dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
