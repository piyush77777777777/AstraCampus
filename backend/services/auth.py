"""
Role-Based Access Control and Demo Accounts for CIT AstraCampus.
Implements the 4 hackathon roles and privilege checks.
"""

ROLES = {
    "admin": {
        "title": "Dean's Office (Admin)",
        "can_generate_timetable": True,
        "can_approve_disruptions": True,
        "can_approve_displacements": True,
        "can_reset_demo_data": True,
        "can_book_category_cap": "institute_event",
        "description": "Full administrative authority over campus scheduling, timetable generation, and disruption approval."
    },
    "department_coordinator": {
        "title": "Department Coordinator (CSE)",
        "can_generate_timetable": False,
        "can_approve_disruptions": False,
        "can_approve_displacements": False,
        "can_reset_demo_data": False,
        "can_book_category_cap": "department_event",
        "description": "Manages departmental sessions, requests lab and hall bookings for department events."
    },
    "faculty": {
        "title": "Faculty Member (Prof. Ananya Roy - F01)",
        "can_generate_timetable": False,
        "can_approve_disruptions": False,
        "can_approve_displacements": False,
        "can_reset_demo_data": False,
        "can_book_category_cap": "guest_lecture",
        "description": "Views personal schedule, marks leave/unavailability, and requests guest lectures."
    },
    "club": {
        "title": "Club Representative (Dramatics / Tech Club)",
        "can_generate_timetable": False,
        "can_approve_disruptions": False,
        "can_approve_displacements": False,
        "can_reset_demo_data": False,
        "can_book_category_cap": "club_event",
        "description": "Submits venue booking requests for cultural and technical events during Spectra week."
    }
}

DEMO_USERS = [
    {
        "id": "u-admin",
        "username": "admin",
        "name": "Prof. B. K. Mohapatra",
        "email": "dean.academics@cit.edu",
        "role": "admin",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=admin_cit",
        "department": "Dean's Office"
    },
    {
        "id": "u-dept",
        "username": "dept_coord",
        "name": "Dr. Rajesh K. Sharma",
        "email": "cse.coord@cit.edu",
        "role": "department_coordinator",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=dept_cit",
        "department": "Computer Science & Engineering"
    },
    {
        "id": "u-faculty",
        "username": "faculty_f01",
        "name": "Dr. Ananya Roy (F01)",
        "email": "ananya.roy@cit.edu",
        "role": "faculty",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=fac_f01",
        "department": "Computer Science & Engineering"
    },
    {
        "id": "u-club",
        "username": "club_rep",
        "name": "Aryan Patel (Spectra Convener)",
        "email": "spectra.convenor@cit.edu",
        "role": "club",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=club_rep",
        "department": "Student Activity Centre"
    }
]

def get_user_by_role(role_name):
    for u in DEMO_USERS:
        if u["role"] == role_name:
            return u
    return DEMO_USERS[0]
