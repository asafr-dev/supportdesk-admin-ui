# supportdesk-admin-ui

![ci](https://github.com/asafr-dev/supportdesk-admin-ui/actions/workflows/ci.yml/badge.svg?branch=main)

> CI powered by [reusable-workflows](https://github.com/asafr-dev/reusable-workflows) repo
> (GitHub Actions).
>
> **Built as a portfolio MVP.** This UI targets the FastAPI service (`supportdesk-api`)
> — not `supportdesk-app`.

## Overview

An admin UI for the SupportDesk API (`supportdesk-api`) focused on fast review + clean frontend patterns.

It demonstrates:

- React + TypeScript + Vite + Tailwind
- React Router (auth-guarded routes)
- TanStack Query for cache/retries/loading states
- Strict runtime validation with Zod
- Clean API client wrapper (adds `X-API-Key`, surfaces `X-Request-ID`)
- CI + unit tests

## Quickstart

### Run locally

1. Start the API service first:

- Repo: [supportdesk-api](https://github.com/asafr-dev/supportdesk-api)

2. Start this UI:

```bash
cp .env.example .env
npm ci
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### Docker (optional)

The included `Dockerfile` builds a static bundle and serves it with Nginx.
Environment variables are baked at build time (set `.env` before building).

```bash
cp .env.example .env
docker build -t supportdesk-admin-ui .
docker run --rm -p 8080:80 supportdesk-admin-ui
```

Open: [http://localhost:8080](http://localhost:8080)

### Configure

- `VITE_API_BASE_URL` default API base URL
- `VITE_DEFAULT_API_KEY` optional default key (UI can override)

## How to test

```bash
npm run test
```

### Typecheck

```bash
npm run typecheck
```

## Project structure

- `docs/`: documentation + full directory map → [docs/STRUCTURE.md](docs/STRUCTURE.md)
- `src/`: source code
- `.github/workflows/`: CI automation

## Documentation

See [Documentation](docs/)

## Contributing

See the [contributing guidelines](https://github.com/asafr-dev/.github/blob/main/CONTRIBUTING.md).

## Security

See the [security policy](https://github.com/asafr-dev/.github/blob/main/SECURITY.md).

## License

See [LICENSE](LICENSE).
