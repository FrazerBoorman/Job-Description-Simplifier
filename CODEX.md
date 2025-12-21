# AVD-Tools — Codex Front Door

This monorepo hosts every AVD single-page tool under `/tools/<TOOL_CODE>/`. Each tool keeps its own HTML, CSS, and JS with no shared assets.

## Pointers (always read first)
- **UI invariants:** [`/AVD-UI-CORE.md`](./AVD-UI-CORE.md)
- **Tool manuals:** `/tools/<TOOL_CODE>/context/<TOOL_CODE>.md`
- **Tool-level guardrails:** `/tools/<TOOL_CODE>/CODEX.md`

## Layout
- Landing page: `/index.html` (lists tools via `/tools.json`).
- Manifest: `/tools.json` (`code`, `name`, `path`, `description`).
- Tools live in `/tools/<TOOL_CODE>/` with:
  - `index.html` (self-contained UI)
  - `CODEX.md` (pointers to this file + UI core + tool manual)
  - `context/<TOOL_CODE>.md` (manual, invariants, regression checks)

## Banner requirement (CODEX ONLY)
Each tool `index.html` must include a **3-pointer banner** near the top of the document or main script that links to:
1) `/CODEX.md`
2) `/AVD-UI-CORE.md`
3) `/tools/<TOOL_CODE>/context/<TOOL_CODE>.md`

## Editing discipline
- Preserve OAuth + Calendar behaviour and OpenAI storage key (`localStorage['avd_job_report_openai_key']`).
- Keep `<details>` styling and behaviour aligned with [`/AVD-UI-CORE.md`](./AVD-UI-CORE.md).
- Avoid refactors that change IDs, storage keys, or semantics unless required by the manual.
