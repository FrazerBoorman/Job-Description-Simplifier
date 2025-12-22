# AVD UI Core (Shared Invariants)

This file defines the non-negotiable UI and behavioural rules shared across all AVD tools.

## Details panels
- Closed by default on page load/refresh.
- Dashed border + padded container.
- Custom caret indicator that rotates on open.
- Subtle highlight when open (no bright blue flashes).
- Nested `<details>` automatically inherit styling and behaviour.

## Shared storage + models
- OpenAI key **must** use `localStorage['avd_job_report_openai_key']`.
- Model candidates to prefer/rotate: `gpt-5.2`, `gpt-5.2-mini`, `gpt-5.2-nano`, `gpt-4.1`, `gpt-4.1-mini`.

## Hidden-by-default panels (expected across tools)
- Debug log / API responses.
- API key + model selector.
- AI Debugger (Be Strict) / replacement `index.html` output areas when present.
- Calendar ID and Advanced date range controls.
- Any other advanced or diagnostic panels (keep closed by default).

## Behaviour
- Do not change OAuth or Calendar flows without explicit need; advanced date ranges must allow future end dates.
- Keep tools self-contained (no shared CSS/JS files yet); each tool owns its own `index.html`.
- Banner pointers (see `/CODEX.md`) must remain present in each tool.
