# JOB-REPORT — Tool Codex

Read these first:
- Root guardrails: [`../../CODEX.md`](../../CODEX.md)
- UI invariants: [`./AVD-UI-CORE.md`](./AVD-UI-CORE.md)
- Tool manual: [`../../context/JOB-REPORT.md`](../../context/JOB-REPORT.md)

Guardrails:
- Preserve OAuth + calendar flow (default last 14 days + overrideable) and keep the shared OpenAI key storage: `localStorage['avd_job_report_openai_key']`.
- Keep `APP_VERSION` + `VERSION_GUARD_KEY` intact and avoid changing event/field IDs, time parsing, or auto-fill behaviour without the manual’s signoff.
- Models/constants must remain stable unless intentionally upgraded: `OPENAI_MODEL = "gpt-4.1-mini"` with `DEBUG_MODEL_CANDIDATES = ["gpt-5.2","gpt-5.1","gpt-5-mini","gpt-4.1-mini"]`.
- Retain the export surface (preview, PDF, Word, email) and AI Debugger panels as-is, including hidden-by-default behaviour.
