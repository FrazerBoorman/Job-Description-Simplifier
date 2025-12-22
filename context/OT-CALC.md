# OT-CALC — AVD Overtime Calculator (Service Manual)

## Purpose

## Key constants / storage keys

These names are part of the shared AVD template; keep them stable unless you are deliberately migrating data.

- `OPENAI_KEY_STORAGE = "avd_job_report_openai_key"` (shared across all tools)
- `STORAGE_KEY = "avd_ot_stable_calendar_autofetch_v4_4"` (OT-CALC persisted log/state)
- `MODEL_CANDIDATES` (must include `gpt-5.2` first, then fallbacks)
- `TOOL_CODE = "OT-CALC"`, `TOOL_NAME = "AVD Overtime Calculator"`

A stable daily overtime calculator for AVD engineers, with an **optional** Google Calendar event picker to reduce typing.
Manual entry must always work, even if Calendar/OAuth fails.

## Files

- `index.html` — single-file tool (UI + logic).
- `CODEX.md` — high-level behaviour and non-negotiables (front door).
- `context/OT-CALC.md` — this document (full detail).

## Tool identifiers

- **TOOL_CODE:** `OT-CALC`
- **Storage key (must stay stable):** `avd_ot_stable_calendar_autofetch_v4_4`
- **Shared OpenAI key localStorage:** `avd_job_report_openai_key`

## UX invariants

### Advanced date range disclosure

- Must be `<details class="calendar-range" id="advancedRangeDetails">`.
- **Closed by default on refresh** (`adv.open = false` on DOMContentLoaded).
- Must look like a **simple disclosure row**, not a button.
- Must have a **consistent caret marker** (custom triangle), and rotate on open/close.
- Inner panel appears only when open; no extra “Load” button is required beyond Apply/Reset.

### Hidden-by-default panels

These are part of the shared template:
- Debug panel
- Calendar settings
- API key panel
- AI Debugger
- Replacement index.html output

## Calendar behaviour invariants

### OAuth + auto-fetch

- On OAuth success:
  - status shows **Signed in**
  - `fetchEvents()` is called automatically (default range)

### Default range

- Default range is last 14 days **including today**:
  - start = today - 13 days
  - end = today
- Date strings must be computed in **local time** as `YYYY-MM-DD`.
  - Do **not** use `toISOString().slice(0,10)` for UI defaults; it can drift by a day depending on timezone.
- Advanced range inputs mirror the effective range:
  - if not using custom range, they are set to default every fetch
  - if using custom, their values drive the range

### Event list

- Events are sorted **newest first**
- Dropdown shows `Title — YYYY-MM-DD`
- Tool auto-selects the most recent event and auto-fills:
  - Job/Location: derived from option text before `—`
  - Date: from event start date

### Apply / Reset

- Apply:
  - sets `USE_CUSTOM_RANGE = true`
  - updates rangeStatus text
  - immediately re-fetches events
- Reset:
  - sets `USE_CUSTOM_RANGE = false`
  - restores default last-14-days dates
  - updates rangeStatus text
  - immediately re-fetches events

### Future events

- The tool must not block future end dates.
- When `toDate` is set in the future, events within that range should still load.

## Overtime calculation invariants

### Time boundaries

- `GRACE_END = 09:00`
- `CORE_END = 17:00`

### Deductions and payable overtime

- Pre‑09:00 overtime and post‑17:00 overtime each have a **15 minute deduction** when they exist, with special handling:
  - Field day:
    - if pre-09 overtime exists: deduct 15 minutes
    - if post-17 overtime exists: deduct 15 minutes
  - Office-finish day:
    - cap day at 17:00
    - keep pre-09 overtime with a 15 minute deduction
    - **no post-17 overtime**
  - Full office/admin day:
    - **no overtime at all** (both pre and post set to 0)

### OT Due and reporting integrity

- `OT Due` is calculated using **payable** overtime minutes (after deductions).
- The log table’s “Total overtime” column must reflect **payable** overtime, so that OT Due can be validated directly.
- The PDF export totals must sum the values shown in the table.

## Regression checklist (quick)

1. Refresh page → Advanced date range is closed.
2. Advanced row looks like an inline disclosure (not a button) and shows the caret marker.
3. Open Advanced → caret rotates; inner panel appears.
4. Sign in → events load automatically; newest-first; latest event auto-fills job + date.
5. Set custom range → Apply → events refresh immediately without extra clicks.
6. Reset → returns to last 14 days and refreshes immediately.
7. Calculation:
   - pre-09 and post-17 deductions apply correctly
   - “Total overtime” equals payable minutes
   - OT Due matches payable minutes * rate

## Safe-edit rules for this tool

- Do not rename IDs used in JS unless updating all references.
- Do not change `STORAGE_KEY` unless explicitly implementing a migration.
- Avoid style refactors that change the shared look; changes should be localised.


## Shared UI invariants

- All `<details>` panels closed by default on refresh.
- Open panels highlight; dashed border + padded container.
- Nested details inherit same caret/open styling.
