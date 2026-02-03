# Repository structure

Purpose: a fast map of this repo for onboarding and “where does X go?”

## Directory map (trimmed)

```text
.
├── README.md  # Main entrypoint (what it is + quickstart + links)
├── LICENSE
├── Dockerfile
├── package.json
├── docs  # Longer-form docs (architecture, runbooks, decisions)
│   ├── STRUCTURE.md  # Repo map (you are here)
│   ├── API_CONTRACT.md  # Key doc
│   └── ARCHITECTURE.md  # Key doc
├── src  # Application/source code
│   ├── __tests__
│   ├── app
│   ├── components
│   └── main.tsx
└── .github  # GitHub metadata (CI, automation, templates)
    ├── workflows  # GitHub Actions workflows
    ├── dependabot.yml
    └── CODEOWNERS
```

## Conventions (what goes where)

- `docs/`: canonical docs; README links here.
- `src/`: application code; keep build output out of source control.
- `.github/`: CI + automation; keep workflow logic out of README.
