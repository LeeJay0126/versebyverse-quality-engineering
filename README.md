# VerseByVerse Quality Engineering Portfolio

This repository contains quality assurance documentation, test cases, bug reports, and planned automation assets for the VerseByVerse web application.

VerseByVerse is a web-based Bible reading, note-taking, and community interaction platform. The application includes account creation, email verification, login/session handling, communities, posts, polls, Bible studies, Bible reading, notes, and notifications.

## Repository Contents

- `qa-docs/test-plan/` - Master test plan for the VerseByVerse web application
- `qa-docs/test-cases/` - Manual, API, database, security, and regression test case workbooks
- `qa-docs/bug-reports/` - Documented defects with reproduction details and supporting evidence
- `automation/` - Planned Playwright automation structure for API and end-to-end test coverage
- `test-data/` - Supporting data for repeatable QA scenarios
- `utils/` - Helper files and supporting utilities

## QA Coverage

The QA artifacts in this repository cover:

- Authentication, signup, login, logout, and email verification
- Session handling, authorization, and protected route behavior
- Community creation, membership, role permissions, and join request workflows
- Posts, announcements, polls, Bible studies, replies, and threaded discussions
- Bible reading, version selection, chapter navigation, and note management
- Notification creation, deduplication, visibility, and read state behavior
- API contract validation and error handling
- Database integrity, relationships, constraints, state transitions, and data exposure checks
- Security-oriented functional testing, including session and authorization scenarios

## Automation Plan

Playwright automation is planned for the highest-value repeatable flows. The automation structure is organized under `automation/` and is intended to support both API-level and browser-based end-to-end testing.

Planned automation coverage includes:

- Smoke tests for application availability and core navigation
- Authentication flows such as signup, login, logout, and protected route checks
- Email verification and resend behavior where test environment support is available
- Community membership and role-permission scenarios
- Post creation, reply, poll, and notification workflows
- Bible reading and notes regression checks
- API validation for core backend endpoints

Automation will prioritize stable, high-risk flows first, while exploratory and role-heavy scenarios will continue to be covered through manual testing where human judgment provides more value.

## Key Documents

- `qa-docs/test-plan/Test-Plan-VerseByVerse.pdf` - Master test plan
- `qa-docs/test-cases/Done/Authentication/` - Authentication, authorization, session, signup, login, and verification test cases
- `qa-docs/test-cases/Done/CommunitySystem/` - Community, membership, posts, replies, and notification test cases
- `qa-docs/test-cases/Done/BibleReading/` - Bible reading and notes test cases
- `qa-docs/test-cases/Done/Me/API/` - API test case workbooks
- `qa-docs/test-cases/Done/Me/DB/` - Database validation test case workbooks
- `qa-docs/bug-reports/` - Active and completed bug reports

## Skills Demonstrated

- Master test planning
- Manual test case design
- Risk-based testing
- Functional, regression, smoke, and exploratory testing
- API testing
- Database validation
- Security-oriented functional testing
- Defect reporting and retesting
- Playwright automation planning
- QA portfolio organization

## Project Status

This repository is maintained as a QA portfolio project. Current artifacts focus on structured manual test coverage, defect documentation, API and database validation planning, and the foundation for future Playwright automation.
