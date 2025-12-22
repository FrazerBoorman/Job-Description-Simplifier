# JOB-REPORT — Job Report Generator (Service Manual)

## Purpose
Convert calendar jobs into polished reports with minimal input: pull recent events, auto-fill the form, let AI tidy the narrative, then export to preview/PDF/Word/email.

## Workflow
1) **Calendar intake:** Google OAuth fetches events for the last 14 days + today (newest first) with an optional advanced range override (both start + end required; future dates allowed). After sign-in, events load automatically and AI runs on the latest event.
2) **Auto-fill + inputs:** Selecting an event fills employee (from calendar ID), job type/date/address, description, tech check, contacts (name/email/phone/address), and time-on-site defaults. Manual edits are preserved. Version guard uses `APP_VERSION = "v0.10"` with `VERSION_GUARD_KEY = "avd_tool_job_report_generator_last_version"`.
3) **AI assist:** Uses `OPENAI_MODEL = "gpt-4.1-mini"` (`DEBUG_MODEL_CANDIDATES` include gpt-5.2 → gpt-4.1-mini) and stores the API key in `localStorage['avd_job_report_openai_key']`. AI debugger captures console + browser errors, request/response snippets, and produces replacement index/html guidance when possible.
4) **Outputs:** Live HTML preview plus export to PDF or Word (`.doc`), and a mailto helper that preloads the subject/body. Media attachments are listed (names only) in the report text.

## Guardrails / Regression checks
- Keep OAuth/calendar flow, field IDs, and default ranges intact; advanced date range remains a `<details>` disclosure with existing caret/spacing.
- Preserve time parsing and duration calculations; ensure auto-run after sign-in continues to select and process the newest event.
- Keep export surfaces (preview, PDF, Word, mailto) and AI Debugger panels hidden by default unless opened.
- Do not change storage keys or model lists without coordinating a migration/rollout.

## Related docs
- Tool Codex: `/tools/job-report-generator/CODEX.md`
- UI invariants: `/tools/job-report-generator/AVD-UI-CORE.md`
