# HealthDataConsent(HDC)

**HDC** is an open-source Minimum Viable Product (MVP) prototype for community controlled health data consent management. It demonstrates how individuals and authorised community stewards can record granular permissions, withdraw consent, deterministically verify proposed data uses, and inspect a chronological audit history.

> **Demonstration Notice:** All data in this MVP is synthetic and stored locally  via `localStorage`. It is not the actual production healthcare system and must not be used with real personal or patient records.
## Dashboard
<img width="1416" height="1860" alt="HDC" src="https://github.com/user-attachments/assets/7e1d4568-9f8d-4820-ab20-84612cf65270" />

## MVP Features
- **Overview Dashboard**: Dynamically calculates Total, Active, Withdrawn, and Expired consent metrics, renders an **Active Consent Rate** semicircular gauge, a **Consent Status Distribution** donut chart, a **Consent Purpose Landscape** 3D triangular prism chart, and previews the latest five consent records and recent audit activity.
- **Consent Records Register**: Searchable by Consent ID, Subject ID, or Organisation; filterable by `Active`, `Withdrawn`, and `Expired` status; sortable by granted date or expiry date; with empty-state handling.
- **Granular Consent Creation**: Validated form capturing pseudonymous Subject ID, Organisation, Purpose, multiple Data Categories, Expiry Date (preventing past dates), Consent Notice Version, and Consent Method. Automatically creates an active record and a `CONSENT_CREATED` audit event.
- **Consent Details & Withdrawal**: Inspect full consent metadata and related audit events. Active consents can be withdrawn after explicit confirmation, updating status to `Withdrawn`, recording a withdrawal timestamp, preserving the original record, and logging a `CONSENT_WITHDRAWN` audit event.
- **Automatic Expiry Detection**: Consents whose expiry date has passed are automatically evaluated as `Expired` (with `CONSENT_EXPIRED` logged) and are never approved during verification.
- **Fail-Closed Verification**: Evaluates Subject ID, Organisation, Purpose, Data Category, Active status, and non-expired date to return `APPROVED`, `DENIED`, or `REVIEW` (for incomplete or ambiguous requests), logging every check to the Audit Trail.
- **Append-Only Audit Trail**: Chronological, searchable, and filterable log of `CONSENT_CREATED`, `CONSENT_WITHDRAWN`, `CONSENT_VERIFIED`, and `CONSENT_EXPIRED` events without edit or delete actions.
- **Synthetic Dataset Controls**: Seeds  fictional consent records and provides a confirmed **Reset Synthetic Data** action in Settings.

## Technology Used

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** icons
- Browser `localStorage` for demonstration persistence

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To run type checks and a production build:

```bash
npm run lint
npm run build
```

## Important Notes Regarding this MVP

- **Client-side storage only**: Data lives in `localStorage` and does not sync across devices or users.
- **Application-level audit log**: Append only within the UI, but not cryptographically signed or tamper-proof because browser storage can be cleared locally.
- **No authentication or access control**: Designed as a single browser governance prototype without login, multi-tenancy, or role enforcement.
- **Synthetic dataset**: Uses fictional pseudonymous IDs (`SUB-1001`, etc.) and fictional organisations.

