# Third-Party Libraries and Declarations — AstraCampus

*This document complies with Section 6 of the Hackathon Rules and Problem Statement.*

---

## 1. Backend Libraries (Python 3.10+)

| Library | Version | License | Purpose |
| :--- | :--- | :--- | :--- |
| **ortools** | `9.15.6755` | Apache 2.0 | Google Optimization Tools CP-SAT constraint satisfaction solver for weekly timetable and midsem exam scheduling. |
| **fastapi** | `0.162.0` | MIT | High-performance asynchronous REST API framework for campus scheduling endpoints. |
| **uvicorn** | `0.54.0` | BSD-3-Clause | Production ASGI web server. |
| **pydantic** | `2.14.2` | MIT | Data parsing and validation for request schemas. |
| **python-multipart** | `0.0.33` | Apache 2.0 | Form data and disruption file upload handling. |

---

## 2. Frontend Libraries (Node.js & React)

| Library | Version | License | Purpose |
| :--- | :--- | :--- | :--- |
| **react** | `^18.3.1` | MIT | Component-based UI library. |
| **react-dom** | `^18.3.1` | MIT | React rendering in browser DOM. |
| **lucide-react** | `^0.468.0` | ISC | Modern SVG iconography for academic command center. |
| **vite** | `^5.4.11` | MIT | Frontend build tooling and local development server. |
| **@vitejs/plugin-react** | `^4.3.4` | MIT | Fast refresh and JSX compilation for React. |

---

## 3. External Datasets & Org Files

- **`cit_public.json`**: Official Chilika Institute of Technology dataset provided in the CrunchWeek starter pack.
- **`validator.py`**: Official Hackathon validator script provided by organizers.
- **`sample_disruption.json`**: Official practice disruption schema.
- **`sample_requests.md`**: Official natural language benchmark test cases.
