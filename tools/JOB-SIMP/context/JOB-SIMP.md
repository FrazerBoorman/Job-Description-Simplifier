# JOB-SIMP — Job Description Simplifier (Tool Manual)

## Identity
- Tool name: Job Description Simplifier
- Tool code: JOB-SIMP
- Version: v0.12
- Last updated: 2025-12-21

## Purpose
Pull a Google Calendar event (title + **full description/notes** + location) or accept pasted text, then produce a shorter, clearer job description that keeps operational facts for engineers.

## Key flows

### 1) Calendar sign-in & event loading
- Uses Google OAuth token client.
- Loads events within the selected date range.
- Future events are included (default end date is **14 days ahead**).

### 2) Event selection → populate inputs
When an event is chosen:
- `#originalTitle` = event summary
- `#originalText` = structured AI-parse block that includes description, location, organiser/creator, attendees, join links, visibility/status, and extended properties when present.

**Reliability requirements**
- If the `events.list` payload does not include the full description, the tool must call:
  - `GET /calendar/v3/calendars/{calendarId}/events/{eventId}`
  - Request fields: `id,summary,description,location,start,end`
- The returned event replaces the cached item so subsequent selects are instant.

### 3) Simplify
- Combines Title + Details into a single prompt.
- Calls OpenAI Responses API with model fallback (`gpt-5.2` preferred, fallbacks allowed per `/AVD-UI-CORE.md`).
- Output must preserve operational detail; no invented facts.

## Shared invariants
- Shared OpenAI key storage: `localStorage['avd_job_report_openai_key']`.
- `<details>` styling + behaviour (closed by default, caret, open highlight, dashed border, padded container) is shared.
- Banner pointers must link to `/CODEX.md`, `/AVD-UI-CORE.md`, and this manual.

## Regression checks (quick)
1) Select an event that has a long Description in Google Calendar → `Full description / notes` populates fully.
2) Select an event with empty Description but a Location → notes area shows “Location: …”.
3) If you later add a `fields=` param to `events.list`, description still populates due to `events.get` fallback.
4) Refresh page → all `<details>` are closed by default.
5) Banner links remain present and point to the three guard-rail docs.
