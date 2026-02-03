# Architecture

A small admin UI that demonstrates:

- clean separation between UI state and API calls
- strict runtime validation for API payloads
- predictable loading/error flows

## High-level flow

1. UI route renders
2. Data is fetched via TanStack Query
3. API calls go through a single client wrapper that:
   - sets `X-API-Key`
   - parses JSON
   - extracts `X-Request-ID` for debugging
4. Zod schemas validate payloads before the UI touches them

## Key modules

- `src/lib/api.ts`: API client (base URL, headers, request id surfacing)
- `src/lib/schemas.ts`: Zod schemas for tickets
- `src/routes/*`: route components + queries/mutations

## Error handling

- network/auth errors are normalized in the client wrapper
- the UI displays a helpful message + request id (when available)

## Repo layout

- `src/` app
- `src/routes/` pages
- `src/lib/` auth + API client + schemas
