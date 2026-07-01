# API Contract Expectations

This demo UI is designed to talk to [`supportdesk-api`](https://github.com/asafr-dev/supportdesk-api).

## Required headers

- None (no API key/auth headers). The client wrapper sets `Content-Type: application/json` for JSON requests.
- When present, pass through `X-Request-ID` in logs and surfaced errors so UI failures can be correlated with API logs.

## Response headers

- `X-Request-ID`: if present, the UI surfaces it in errors to make debugging and log correlation easier.

## Base URL / routing

- Frontend **always** calls the same-origin path prefix: **`/api/*`**.
- Dev: Vite proxy forwards `/api/*` to the API for HMR.
- Prod: the included Nginx (Dockerfile) forwards `/api/*` to the API.

## Endpoints used (via /api/\*)

- `GET /health`
- `GET /tickets?status=&q=&limit=&offset=`
- `GET /tickets/{id}`
- `PATCH /tickets/{id}/status`
