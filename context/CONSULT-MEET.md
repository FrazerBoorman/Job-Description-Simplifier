# CONSULT-MEET — Consultation Meeting Processor (Service Manual)

## Purpose
Process a consultation meeting end-to-end: load the calendar event, transcribe the call (audio or text), generate a structured summary, propose kit from the product workbook, and produce a proposal draft.

## Workflow
1) **Calendar intake:** Google OAuth (same client ID as other tools) pulls events from the last 14 days + today, with an optional advanced range override (both start + end required). The newest event auto-populates the form. Status + AI status surfaces stay visible.
2) **Audio/text processing:** Upload an audio file (`accept="audio/*"`) or a plain text transcript. Audio is transcribed via Whisper (`AUDIO_MODEL = "whisper-1"`); summaries use `TEXT_MODEL = "gpt-4.1-mini"`. The transcript, structured summary, and raw/AI debug logs are retained for downstream steps.
3) **Product suggestions:** Upload the workbook template (SheetJS-powered). Expected layout:
   - Sheets: `Products`, `Guided`, `Checklists`
   - Products headers on row 3; data rows 4–500 across columns A–H
   - Checklist columns: Product=C, Qty=G, Link=J, Notes=K
   - MISC block starts at row 278 (headers on 277)
   AI proposals honour the “Allow AI pricing links” toggle (default OFF). The filled workbook can be downloaded.
4) **Proposal generation:** Upload the priced/edited workbook to generate a proposal preview and download a `.doc` proposal. Uses the most recent transcript + structured summary + workbook data.

## Guardrails / Regression checks
- Keep `OPENAI_KEY_STORAGE = "avd_job_report_openai_key"` stable; API key panel remains hidden by default.
- Preserve sheet names, header rows, column positions, and row ranges listed above; product writes must target the existing `Checklists` layout.
- Advanced date range must remain a `<details>` disclosure with caret styling; default window stays last 14 days + today.
- AI Debugger (uses `DEBUG_MODEL = "gpt-5.1"`) must continue to capture console + browser errors + structured logs before sending.

## Related docs
- Tool Codex: `/tools/consultation-meeting-processor/CODEX.md`
- UI invariants: `/tools/consultation-meeting-processor/AVD-UI-CORE.md`
