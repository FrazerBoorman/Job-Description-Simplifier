# AVD Tools — Codex Front Door

This repository contains AVD single‑file tools (static `index.html`) with a shared UI/behaviour template.

## Non‑negotiables (apply to all tools)

- **Details panels (all tools):**
  - All `<details>` panels are **closed by default on refresh**.
  - When open, the summary row **highlights** and panels use **dashed border + padded container**.
  - Nested `<details>` automatically inherit the same caret + open-highlight styling.


- **Be Strict:** never invent facts, never silently change core business logic or calculations.
- **Minimise edits:** avoid refactors unless explicitly requested; keep unrelated sections untouched.
- **Versioning:** version pill uses semantic `v0.xx` and must be updated when behaviour/UI changes.
- **Hidden-by-default panels:** Debug, API key, AI Debugger, Replacement index output, Calendar settings.
- **Shared OpenAI key:** `localStorage['avd_job_report_openai_key']` (same key across tools).
- **Shared constants / storage keys (must remain stable unless intentionally migrated):**
  - `OPENAI_KEY_STORAGE = "avd_job_report_openai_key"` (localStorage key)
  - `MODEL_CANDIDATES` includes `gpt-5.2` first, with fallbacks.
  - Each tool has its own `STORAGE_KEY` for persisted UI state/logs (do not change without migration plan).

## OT-CALC (AVD Overtime Calculator)

- **Tool code:** `OT-CALC`
- **Core purpose:** daily overtime calculation + optional Google Calendar event picker convenience.
- **Calendar behaviour:** after OAuth success, auto-fetch events (default last 14 days), newest-first, auto-fill from latest event.
- **Date handling:** default last‑14‑days range must be computed in **local dates** (YYYY‑MM‑DD). Avoid `toISOString().slice(0,10)` because it can drift by a day in some timezones.
- **Advanced date range:** must be a `<details>/<summary>` disclosure row (not a button), closed by default, with a consistent caret marker.
- **Overtime integrity:** “Total overtime” in log/PDF must match payable overtime (after 15m deductions) and therefore align with OT Due.

## Where the full details live

- `context/OT-CALC.md` — invariants, regression checks, and implementation notes.
