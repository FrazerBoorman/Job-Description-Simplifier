# CONSULT-MEET — Tool Codex

Read these first:
- Root guardrails: [`../../CODEX.md`](../../CODEX.md)
- UI invariants: [`./AVD-UI-CORE.md`](./AVD-UI-CORE.md)
- Tool manual: [`../../context/CONSULT-MEET.md`](../../context/CONSULT-MEET.md)

Guardrails:
- Preserve Google OAuth + calendar flow (default last 14 days + optional override) and keep the shared OpenAI key storage: `localStorage['avd_job_report_openai_key']`.
- Maintain spreadsheet expectations: `Products`, `Guided`, and `Checklists` sheets; headers on row 3 with data rows 4–500 across cols A–H; MISC block starts at row 278.
- Keep checklist writes aligned (Product=C, Qty=G, Link=J, Notes=K) and avoid changing storage keys or IDs without the manual’s go-ahead.
- Models/constants must stay stable unless explicitly bumped: `TEXT_MODEL = "gpt-4.1-mini"`, `AUDIO_MODEL = "whisper-1"`, `DEBUG_MODEL = "gpt-5.1"`.
