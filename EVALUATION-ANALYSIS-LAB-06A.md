# HED3505-EVALUATION-ANALYSIS-LAB-06A
## Learner Check-in & Session Architecture

Date: 19 September 2026
Status: CONTROLLED PREVIEW IMPLEMENTED

## Flow
Welcome / Check-in
→ Student Lab Dashboard
→ LAB 1–5
→ Evidence Export

## Learner fields
- Student ID
- Display name
- Section

## Security boundary
This is Learner Identification, NOT authentication.
Data is stored only in browser localStorage.
No password is collected.
No backend is used.
The dashboard masks the student ID.
The full entered student ID is included only in the locally generated evidence export.

## Future production option
If explicitly authorized later:
Supabase Auth / institutional email or OTP
→ authenticated UID
→ student profile mapping
→ controlled progress/evidence storage

## Not authorized in this phase
- production authentication
- centralized collection
- password storage
- automatic grading
- public student roster

## Next gate
06B — real-device verification of check-in, persistence, dashboard progress, LAB access, and evidence metadata.
