# AVD Tools — Codex Front Door (Shared Guardrails)

This repository contains AVD Tools single-file web apps (index.html) with a shared template.

## Non‑negotiable shared invariants (all tools)

1) **Versioning**
- Version pill uses the tool’s semantic version (e.g., `v0.11`).
- The version pill copies the full `index.html` to clipboard (with robust fallbacks).

2) **Shared OpenAI API key storage**
- Use **exactly**: `localStorage['avd_job_report_openai_key']`
- This key is shared across tools; never silently change this key name.

3) **Details panels (UI)**
- All `<details>` must:
  - Be **closed by default** on page load/refresh.
  - Use **dashed border** and **padded container** styling.
  - Use a **consistent caret marker** that rotates on open.
  - **Highlight when open**.
  - Nested `<details>` inherit the same styling automatically.

4) **Calendar range behaviour**
- Advanced date range must allow future end dates (do not silently clamp to “today”).
- Do not filter out future events unless explicitly requested.

5) **Safe edit discipline**
- Avoid refactors that change element IDs, storage keys, or business logic semantics.
- Prefer small, local fixes.
- Add regression checks in tool manual docs when behaviour is important.

## Tool manuals
- Job Description Simplifier: `context/JOB-SIMP.md`
