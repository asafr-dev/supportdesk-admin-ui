<h1 align="center">SupportDesk Admin UI</h1>

<p align="center">
  Admin UI (demo) for <a href="https://github.com/asafr-dev/supportdesk-api">SupportDesk API</a> — built with React, TypeScript, Vite, Tailwind, TanStack Query for cache/retries/loading states, and strict runtime validation with Zod; consumes the standalone ticketing API.
</p>

<p align="center">
  <a href="https://github.com/asafr-dev/supportdesk-admin-ui/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/asafr-dev/supportdesk-admin-ui/ci.yml?branch=main&style=for-the-badge&label=CI"></a>
  <a href="https://github.com/asafr-dev/supportdesk-admin-ui/actions/workflows/codeql.yml"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/asafr-dev/supportdesk-admin-ui/codeql.yml?branch=main&style=for-the-badge&label=CODEQL"></a>
  <a href="https://codecov.io/gh/asafr-dev/supportdesk-admin-ui"><img alt="Coverage" src="https://img.shields.io/codecov/c/github/asafr-dev/supportdesk-admin-ui/main.svg?style=for-the-badge&logo=codecov&label=coverage"></a>
  <a href="https://www.codefactor.io/repository/github/asafr-dev/supportdesk-admin-ui"><img alt="CodeFactor" src="https://img.shields.io/codefactor/grade/github/asafr-dev/supportdesk-admin-ui?branch=main&style=for-the-badge"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/asafr-dev/supportdesk-admin-ui?style=for-the-badge"></a>
</p>

## 🎬 Demo

**Live demo:** [supportdesk-admin-ui-demo.up.railway.app](https://supportdesk-admin-ui-demo.up.railway.app)

## 🚀 Quickstart

### Requirements

- Linux
- Node 20+
- Docker

### Run locally

1. Start the API – from [SupportDesk API](https://github.com/asafr-dev/supportdesk-api#quickstart) repo.
2. Start this UI:

```bash
npm ci
npm run dev
```

Open: [http://localhost:9000](http://localhost:9000)

## 🧪 How to test

After installing dependencies:

```bash
npm run check
```

## 🗂️ Project structure

For the full directory map and “what goes where” conventions, see
[STRUCTURE.md](docs/STRUCTURE.md).

- `src/lib/api.ts` – API client
- `src/lib/schemas.ts` – Zod runtime schemas
- `nginx/default.conf.template` – `/api` reverse-proxy
- `Dockerfile` – builds + serves + proxies
- `docs/` – longer-form documentation (architecture, API contract)

## 📚 Documentation

See [documentation](docs/)

## 🤝 Contributing

See the [contributing guidelines](https://github.com/asafr-dev/.github/blob/main/CONTRIBUTING.md)

## 🔒 Security

See the [security policy](https://github.com/asafr-dev/.github/blob/main/SECURITY.md)

## 📄 License

See [LICENSE](LICENSE)
