# API Contract Expectations

This UI is designed to talk to `supportdesk-api`.

## Required headers

- `X-API-Key`: the API key (dev default comes from `.env`)

## Response headers

- `X-Request-ID`: if present, the UI surfaces it in errors to make debugging and log correlation easier.

## Base URL

- Config: `VITE_API_BASE_URL`
- Examples:
  - `http://localhost:8000`

## Endpoints used

- `GET /health`
- `GET /tickets?status=&q=&limit=&offset=`
- `GET /tickets/{id}`
- `PATCH /tickets/{id}/status`
