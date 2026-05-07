# VerseByVerse Quality Engineering Portfolio

This repository contains quality assurance documentation, test cases, bug reports, and Playwright automation assets for the VerseByVerse web application.

VerseByVerse is a web-based Bible reading, note-taking, and community interaction platform. The application includes account creation, email verification, login/session handling, communities, posts, polls, Bible studies, Bible reading, notes, and notifications.

## Repository Contents

- `qa-docs/test-plan/` - Master test plan for the VerseByVerse web application
- `qa-docs/test-cases/` - Manual, API, database, security, and regression test case workbooks
- `qa-docs/bug-reports/` - Documented defects with reproduction details and supporting evidence
- `automation/` - Playwright API and end-to-end automation with reusable helpers and report outputs
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

## Playwright Automation

Playwright automation is implemented under `automation/` for high-value repeatable API and browser workflows. The suite is designed to run against local or deployed VerseByVerse environments through `.env` configuration.

Current automation coverage includes:

- API preflight checks for backend health and configured authenticated test users
- API validation for authentication/session behavior and unauthenticated access
- Notes API coverage for create, read, update, delete, search, filtering, and negative cases
- Community API coverage for discovery, authentication guards, community creation, listing, detail retrieval, and cleanup
- Community post API coverage for post creation, list/detail retrieval, and validation handling
- Browser E2E smoke checks for login, signup, protected routes, authenticated navigation, and core page availability
- Playwright HTML, JSON, and JUnit reporting artifacts

Run details are documented in `automation/README.md`. The recommended flow is to run the preflight checks first, then API tests, then browser E2E tests when the frontend and backend are available.

## Key Documents

- `qa-docs/test-plan/Test-Plan-VerseByVerse.pdf` - Master test plan
- `qa-docs/test-cases/Authentication/` - Authentication, authorization, session, signup, login, and verification test cases
- `qa-docs/test-cases/CommunitySystem/` - Community, membership, posts, replies, and notification test cases
- `qa-docs/test-cases/BibleReading/` - Bible reading and notes test cases
- `qa-docs/test-cases/API/` - API test case workbooks
- `qa-docs/test-cases/DB/` - Database validation test case workbooks
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
- Playwright API and browser automation
- Test data setup and cleanup helpers
- CI-ready HTML, JSON, and JUnit test reporting
- QA portfolio organization

## Project Status

This repository is maintained as a QA portfolio project. Current artifacts include structured manual test coverage, defect documentation, API and database validation workbooks, and executable Playwright automation for API and browser regression coverage.
