# Stack

Admin SPA for SupportDesk API (React + Vite) with Docker/Nginx deploy.

| Area             | Technologies                                               | Evidence                                    |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------- |
| Language/runtime | TypeScript • Node.js 20+                                   | `.nvmrc`, `tsconfig.json`                   |
| UI               | React 18 • React Router • Vite                             | `package.json`                              |
| Data fetching    | TanStack Query (React Query)                               | `package.json`                              |
| Validation       | Zod                                                        | `package.json`                              |
| Styling          | Tailwind CSS • PostCSS • Autoprefixer                      | `tailwind.config.ts`, `postcss.config.js`   |
| Testing          | Vitest • jsdom                                             | `package.json`                              |
| Quality          | ESLint • Prettier • TypeScript (`tsc`)                     | `package.json`                              |
| Container/edge   | Docker (multi-stage) • Nginx (static + /api reverse-proxy) | `Dockerfile`, `nginx/default.conf.template` |
| CI/Security      | GitHub Actions • CodeQL                                    | `.github/workflows/*`                       |
| Deployment       | Railway (Dockerfile builder)                               | `railway.toml`                              |
