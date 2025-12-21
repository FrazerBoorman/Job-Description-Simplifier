# AVD-Tools Consolidated Report

## Tools migrated
- **Job-Description-Simplifier** → **JOB-SIMP** (derived from repo name)
  - Path: `tools/JOB-SIMP/`
  - Monorepo URL: `tools/JOB-SIMP/` (GitHub Pages: `https://<user>.github.io/AVD-Tools/tools/JOB-SIMP/`)
  - Manual interventions: added 3-pointer CODEX banner, updated manual + codex pointers, preserved OAuth/calendar/OpenAI flows.

## TOOL_CODE stubs
- None generated in this migration.

## Invariant checks (self-audit)
- 3-pointer banner present in tool `index.html`.
- `<details>` styling preserved (closed by default, dashed border, caret rotation, open highlight).
- OpenAI storage key remains `localStorage['avd_job_report_openai_key']` with model fallback list intact.
- Calendar advanced range still permits future end dates.
- UI remains single-file and self-contained (no shared CSS/JS introduced).

## Known follow-ups / drift risks
- Configure GitHub Pages for the AVD-Tools repository (main branch, root) once pushed to GitHub.
- Discover and migrate remaining AVD tool repositories (e.g., Overtime-Calculator) into `/tools/<TOOL_CODE>/` when access is available; add them to `tools.json`.
- Re-run OAuth/OpenAI live checks in a network-enabled browser context after deployment.
