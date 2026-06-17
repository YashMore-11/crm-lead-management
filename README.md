# CRM Lead Management Module
### UI/UX + Frontend Developer Assignment — Enjay IT Solutions

A fully functional Lead Management Module built for a CRM/SaaS product. Designed and developed to help sales teams find leads, understand lead status, take actions, and track activities — all from a clean, responsive interface.

---

## Live Demo

🔗 **[Live Demo Link]** — https://crm-lead-management-five.vercel.app

📁 **[GitHub Repository Link]** — https://github.com/YashMore-11/crm-lead-management

---

## Screens Built

### 1. Lead List View
- All required columns: Lead Name, Company, Phone, Email, Status, Owner, Last Activity, Next Follow-up, Remarks
- Search by name, phone, or email
- Filter by status (New / Contacted / Qualified / Lost)
- Sort by last activity date (newest/oldest)
- Full scrollable list (all 48 leads, infinite scroll pattern)
- Overdue follow-up indicator — red left border on row + "OVERDUE" tag
- Loading state (skeleton rows), empty state, no-results state
- Responsive — table on desktop, cards on mobile

### 2. Lead Detail View
- Slide-over drawer (keeps list in context, no page navigation)
- Lead summary: name, company, status pill, owner, phone, email, remarks
- **Edit Lead** — working inline form, updates lead everywhere instantly
- **Add Activity** — working form with type selector (Note, Call, Meeting, Email, WhatsApp), prepends to timeline
- **Change Status** — dropdown, updates status across list + Kanban in real time
- Activity timeline: Notes, Calls, Meetings, Visits, WhatsApp, Emails, Attachments, Status changes

### Bonus Features
- **Bulk selection + bulk status update** — select multiple leads, set status for all at once via floating action bar
- **Kanban board** — drag-and-drop cards between New / Contacted / Qualified / Lost columns; "Move to…" dropdown on each card for keyboard accessibility
- **Dark mode** — full UI, toggle in sidebar

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (functional components + hooks) |
| Build tool | Vite |
| Styling | Tailwind CSS (custom design tokens) |
| Icons | lucide-react |
| Data | Static mock data (simulates REST API responses) |
| Deployment | Vercel |

---

## Project Structure

```
src/
  components/
    Sidebar.jsx          # Navigation, dark mode toggle
    Toolbar.jsx          # Search, filter, sort, view switcher
    LeadTable.jsx        # Lead List View — table + mobile cards
    KanbanBoard.jsx      # Kanban board with drag-and-drop
    LeadDetailDrawer.jsx # Lead Detail View — slide-over panel
    ActivityTimeline.jsx # Activity feed with icons per type
    StatusBadge.jsx      # Reusable status pill component
    BulkActionBar.jsx    # Floating bulk selection bar
  data/
    mockData.js          # 48 mock leads + activity timelines
  utils/
    helpers.js           # Date formatting, overdue checks, avatars
  styles/
    index.css            # Tailwind directives + animations
```

---

## Design Decisions

**Slide-over drawer instead of a new page**
Opening a lead in a right-side drawer keeps the list visible in the background. Sales reps can close it and pick up exactly where they left off — no re-scrolling, no re-filtering. This matches how production CRMs like HubSpot and Pipedrive handle record drilldowns.

**3-line Lead Details cell (name + phone + email)**
The PDF lists Phone and Email as separate required columns. Stacking them under the lead name in one cell satisfies the requirement while keeping the table scannable — fewer columns means less horizontal scrolling and faster eye movement across rows.

**Red left border for overdue follow-ups**
The single most actionable piece of information for a sales rep is "which lead am I late on?" A thin red left border + OVERDUE tag surfaces this without requiring a separate filter step. Color alone is never the only signal — text label always accompanies it (accessibility).

**Owner initials avatar with deterministic color**
Each salesperson gets a consistent color avatar across the entire app (list, Kanban, detail view). This makes it fast to visually group leads by owner — useful for managers reviewing team workload at a glance.

**"Move to…" dropdown on Kanban cards**
Drag-and-drop has no keyboard equivalent by default. Every card has a small "Move to…" select element so keyboard users can change a lead's status without touching a mouse — satisfies the explicit accessibility requirement in the brief.

**Escape key — layered behavior**
With a form open (Edit Lead / Add Activity), Escape cancels the form first. Only when no form is open does Escape close the full drawer. This prevents accidental data loss — a common pain point in CRM tools.

**Owner vs Lead Owner — single column**
The brief lists both "Owner (Salesperson)" and "Lead Owner" as required columns. In every CRM context these refer to the same field (the assigned salesperson). Displaying a duplicate column would hurt scannability, so they are merged into one Owner column — this decision is intentional, not an oversight.

---

## Accessibility

- All icon-only controls have `aria-label`
- Detail drawer: `role="dialog"`, `aria-modal`, real focus trap (Tab/Shift+Tab cycles within drawer), focus returns to trigger on close
- Table rows keep native `<tr>`/`<td>` semantics for screen readers; one focusable "Open details" button per row for keyboard users
- Edit Lead and Add Activity forms: focus moves to first field on open, required fields marked with `required`
- Status changes use native `<select>` elements (fully keyboard operable)
- Color is never the only signal — text label always accompanies color (status pills, overdue indicator)
- Body text meets WCAG AA contrast in both light and dark mode

---

## Wireframes

Low-fidelity wireframes are attached separately (PNG files):
- `wireframe-1-lead-list.png` — Lead List View, desktop layout
- `wireframe-2-lead-detail.png` — Lead Detail slide-over drawer
- `wireframe-3-kanban.png` — Kanban board with drag-and-drop

---

## Time Taken

Approximately **6–7 hours** total:
- 1 hour — layout planning, data model, component structure
- 2.5 hours — Lead List View (table, filters, states, mobile cards)
- 1.5 hours — Lead Detail View (drawer, timeline, edit form, add activity)
- 1 hour — Kanban board, bulk selection, dark mode
- 30 min — accessibility polish, README

---

## What I Would Improve With More Time

- **Real API integration** — replace mock data with actual endpoints; connect Edit Lead and Add Activity forms to `PATCH`/`POST` with loading and error states
- **Row virtualization** — use `react-virtual` for smooth performance at thousands of leads (current full-list scroll is fine at this scale)
- **Saved filter presets** — "My leads", "Overdue follow-ups", "This week" — one-click views that sales reps use daily
- **Column sorting** — click any column header to sort, not just last activity
- **Unit + component tests** — filtering/sorting logic, drawer open/close, edit form validation, bulk update

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

To build for production:
```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import repo
3. Framework: Vite (auto-detected) → Deploy
4. Live URL ready in ~2 minutes
