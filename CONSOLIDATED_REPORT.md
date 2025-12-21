# AVD-Tools Consolidated Report

## Tools migrated / staged
- **Job-Description-Simplifier** → **JOB-SIMP** (derived from repo name)
  - Path: `tools/JOB-SIMP/`
  - Monorepo URL: `tools/JOB-SIMP/` (GitHub Pages: `https://<user>.github.io/AVD-Tools/tools/JOB-SIMP/`)
  - Manual interventions: added 3-pointer CODEX banner, updated manual + codex pointers, preserved OAuth/calendar/OpenAI flows.
- **Consultation-Meeting-Processor** → **consultation-meeting-processor**
  - Path: `tools/consultation-meeting-processor/`
  - Monorepo URL: `tools/consultation-meeting-processor/`
  - Status: Placeholder only (source repo not accessible; network 403). Needs real tool import.
- **Job-Report-Generator** → **job-report-generator**
  - Path: `tools/job-report-generator/`
  - Monorepo URL: `tools/job-report-generator/`
  - Status: Placeholder only (source repo not accessible; network 403). Needs real tool import.
- **Overtime-Calculator** → **overtime-calculator**
  - Path: `tools/overtime-calculator/`
  - Monorepo URL: `tools/overtime-calculator/`
  - Status: Placeholder only (source repo not accessible; network 403). Needs real tool import.

## TOOL_CODE stubs
- Placeholder slugs used for three tools due to missing source code; replace with real content when available.

## Invariant checks (self-audit)
- JOB-SIMP: 3-pointer banner present; `<details>` styling preserved; OpenAI key name unchanged; calendar future range allowed; tool remains single-file.
- Placeholder tools: include 3-pointer banners and manuals indicating migration blocker (no functional logic present yet).

## Known follow-ups / drift risks
- Configure GitHub Pages for the AVD-Tools repository (main branch, root) once pushed to GitHub.
- Acquire source for Consultation-Meeting-Processor, Job-Report-Generator, and Overtime-Calculator (GitHub access denied with HTTP 403 in this environment) and replace placeholders with real tool files; re-run path checks afterward.
- Re-run OAuth/OpenAI live checks in a network-enabled browser context after deployment.
