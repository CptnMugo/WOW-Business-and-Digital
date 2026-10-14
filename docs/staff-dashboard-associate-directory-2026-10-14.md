# Staff dashboard usability and Associate directory — 14 October 2026

This change is staged in a feature branch. Do not publish before approval, build checks, and regression tests.

## Dashboard navigation
- Four independent sections: Associate directory, Website enquiries, Taster/adviser/corporate enquiries, Career Accelerator student applications.
- All begin collapsed, so staff can reach the relevant section immediately.
- Clicking a section heading opens or closes it; opening another section closes the previous one.
- Individual records remain expandable within an open section.
- Staff authentication and saved-data APIs remain unchanged.

## Associate directory: first phase
- The directory is a secure view of **existing** Associate category records in data/enquiries.jsonl.
- Filters: any-text, specialist skills/qualifications/experience, sector, location, and CV uploaded.
- Profile displays availability, CV download (existing authenticated route), and full original form details.
- No separate or duplicate Associate database is created; this avoids reconciliation and lost records.
- The directory currently supports **text matching**, not verified qualifications or automatic project eligibility scoring.
- **Future phase**: add separate private, access-controlled staffing CRM metadata (status, notes, tags, suitability, consent/retention checks, project shortlist) keyed by original reference. Do not alter original application answers or invent expertise. Any shortlist should be a human-reviewed suggestion, not automated hiring decisions.

## Acceptance checks
1. Sign in as authorised staff and check all four sections begin closed.
2. Open each section; close by clicking again; opening another section hides the previous section.
3. Open Associate directory, load records, filter by known name and expertise/sector/location and remove filters; verify old Associate submissions including 13 October remain visible.
4. Check Website enquiries excludes Associate records while Associate directory includes only Associates.
5. Check authenticated CV download still works, and unauthorised CV request returns 401.
6. Test student application opening and saving unchanged; admissions reviews, payments and public forms remain unchanged.
7. Verify keyboard navigation and screen reader expanded states.
8. Run npm run lint, npm run build and dashboard regression tests on a staging deployment before merging; these steps have not been executed with the GitHub-only edit.
9. Back up data before any deployment. Live status not verified.

## Dependency
The separate urgent forms/login fix is Pull Request #6. This feature branch was created from main to avoid merging unrelated unverified fixes; reconcile both with the latest main before deployment.
