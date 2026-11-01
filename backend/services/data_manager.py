"""
Data Manager for AstraCampus.
Loads datasets, tracks active timetable, midsem exams, Spectra bookings,
disruption proposals, audit logs, and allows instant reset of demo data.
"""

import json, os, copy
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "cit_public.json")
DISRUPTION_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "sample_disruption.json")
BASELINE_EXPORT = os.path.join(os.path.dirname(__file__), "..", "..", "exports", "schedule.json")
AFTER_EXPORT = os.path.join(os.path.dirname(__file__), "..", "..", "exports", "schedule_after.json")

class DataManager:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.load_data()

    def load_data(self):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            self.raw_data = json.load(f)

        self.current_data = copy.deepcopy(self.raw_data)

        # Load baseline schedule
        if os.path.exists(BASELINE_EXPORT):
            with open(BASELINE_EXPORT, "r", encoding="utf-8") as f:
                self.current_schedule = json.load(f)
        else:
            self.current_schedule = {"sessions": [], "fest_week": {}, "exams": []}

        self.pending_disruption = None
        self.active_disruption = None
        self.audit_log = [
            {
                "timestamp": datetime.now().isoformat(),
                "actor": "System",
                "action": "INIT",
                "details": "CIT AstraCampus initialized with official dataset cit-public-v1"
            }
        ]

    def reset_to_initial(self):
        """Resets all data, schedules, bookings, and disruptions back to pristine demo state."""
        self.load_data()
        self.audit_log.append({
            "timestamp": datetime.now().isoformat(),
            "actor": "Dean's Office (Admin)",
            "action": "RESET_DEMO_DATA",
            "details": "System state cleanly reset to initial baseline demo configuration."
        })
        return {"success": True, "message": "Demo data successfully reset to baseline."}

    def log_action(self, actor, action, details):
        self.audit_log.append({
            "timestamp": datetime.now().isoformat(),
            "actor": actor,
            "action": action,
            "details": details
        })
