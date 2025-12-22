# OT-CALC — Tool Codex

Read these first:
- Root guardrails: [`../../CODEX.md`](../../CODEX.md)
- UI invariants: [`./AVD-UI-CORE.md`](./AVD-UI-CORE.md)
- Tool manual: [`../../context/OT-CALC.md`](../../context/OT-CALC.md)

Shared guardrails:
- Keep `<details>` styling/behaviour intact (closed by default, dashed border, caret rotation, open highlight).
- Preserve shared OpenAI key storage: `localStorage['avd_job_report_openai_key']`.
- Avoid refactors that change IDs, storage keys, or OAuth/calendar flow unless the manual requires it.

OT-CALC specifics:
- **Tool code:** `OT-CALC`; purpose: daily overtime calculation with optional Google Calendar event picker.
- **Calendar behaviour:** after OAuth success, auto-fetch events (default last 14 days), newest-first, auto-fill from latest event.
- **Date handling:** default last‑14‑days window computed in local dates (YYYY‑MM‑DD); avoid `toISOString().slice(0,10)` drift.
- **Advanced date range:** must remain a `<details>/<summary>` disclosure row (closed by default) with the existing caret marker.
- **Overtime integrity:** “Total overtime” in log/PDF must match payable overtime (after 15m deductions) and align with OT Due.
