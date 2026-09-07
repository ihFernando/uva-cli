<p align="center">
  <img src="https://raw.githubusercontent.com/ihFernando/uva-cli/main/assets/uva-cli-lockup.svg" alt="uva-cli" width="420" />
</p>

<p align="center">
  <strong>Interactive Git workflow automation for teams</strong><br>
  Branch naming, Conventional Commits, and more — all guided, all configurable.
</p>

<p align="center">
  <a href="https://npmjs.com/package/uva-cli">
    <img src="https://img.shields.io/npm/v/uva-cli.svg?color=6D28D9&label=npm" alt="npm version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-0F9D6B.svg" alt="MIT license" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-A78BFA.svg" alt="Node.js ≥18" />
</p>

---

## What is UVA CLI?

UVA CLI turns repetitive Git operations into short, interactive wizards. Instead of memorizing your team's branch naming conventions or commit message formats, the CLI guides you through them — and adapts to whatever conventions your project uses.

No more "how should I name this branch?" or "what goes in the ticket field?". Just run `uva` and follow the prompts.

## Features

- **Per-project config** — run `uva init` once; conventions are saved to `uva.config.json`
- **Conventional Commits** — pick the type, add a ticket (optional), write the message
- **Branch creation** — checks out the source branch, pulls, and creates your new branch in one step
- **Multiple formats** — commit and branch naming patterns are chosen during setup, not hard-coded
- **Zero lock-in** — conventions changed? Re-run `uva init`

## Install

```bash
npm install -g uva-cli
```

Or run without a global install:

```bash
npx uva-cli init
```

### Command not found?

If your shell can't find `uva` after a global install, the npm global bin directory isn't in your `PATH`. Add this to your `~/.zshrc` (or `~/.bashrc`):

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Then reload your shell:

```bash
source ~/.zshrc
```

## Quick start

### 1. Set up your project

Run this once inside any Git repository:

```bash
uva init
```

You'll be asked:

- Project name
- Do you use a ticket tracker? (Jira, Linear, GitHub Issues…)
- Ticket prefix (e.g. `PROJ`, `ENG`, `FC`)
- Commit message format
- Branch naming format
- Which branches you can branch from (e.g. `main,develop`)

This creates a **`uva.config.json`** at your repository root. Commit it — everyone on your team shares the same setup automatically.

### 2. Use the commands

```bash
uva start     # interactive menu — pick what to do
uva commit    # guided commit: type → ticket → message → file selection
uva branch    # guided branch: source → ticket → type → task name
uva push      # confirms and pushes the current branch to origin
```

## Commands

| Command        | Description                                                 |
| :------------- | :---------------------------------------------------------- |
| `uva init`     | Set up UVA CLI for this project — creates `uva.config.json` |
| `uva start`    | Interactive menu with all available options                 |
| `uva commit`   | Create an interactive commit following Conventional Commits |
| `uva branch`   | Create a new branch from a configured source branch         |
| `uva new-file` | Scaffold a file from a template (docs, frontend, backend)   |
| `uva push`     | Push the current branch to origin                           |

## Configuration

`uva.config.json` is created by `uva init` and lives at the root of your repository. You can edit it by hand at any time.

```json
{
  "project": {
    "name": "My Project"
  },
  "commit": {
    "ticketEnabled": true,
    "ticketPrefix": "PROJ",
    "ticketPlaceholder": "PROJ-42",
    "format": "conventional-ticket"
  },
  "branch": {
    "sources": ["main", "develop"],
    "ticketEnabled": true,
    "areaEnabled": false,
    "areas": [],
    "format": "type-ticket-name"
  }
}
```

### Commit formats

| `format` value        | Example output                     |
| :-------------------- | :--------------------------------- |
| `conventional-ticket` | `feat(PROJ-42): add login screen`  |
| `conventional`        | `feat: add login screen`           |
| `ticket-conventional` | `[PROJ-42] feat: add login screen` |

### Branch formats

| `format` value     | Example output                  |
| :----------------- | :------------------------------ |
| `type-ticket-name` | `feat/PROJ-42_add-login-screen` |
| `type-name`        | `feat/add-login-screen`         |
| `ticket-type-name` | `PROJ-42/feat/add-login-screen` |

## File templates (`uva new-file`)

`uva new-file` scaffolds files from opinionated templates. The flow is: **language → category → type → title → folder**. Date and author (from `git config`) are filled in automatically.

Available languages: **English** and **Português (BR)**.

### Docs

Documentation templates in Markdown, meant to live alongside your source code in a `docs/` folder.

| Type              | When to use                                                                                                                                                                                                   | Default output             |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------- |
| **ADR**           | Record an architectural decision: context, decision, rationale, consequences, and alternatives. Based on [Michael Nygard's format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions). | `docs/decisions/<slug>.md` |
| **Decision Log**  | Lightweight alternative to ADRs — good for product, process, or quick technical calls.                                                                                                                        | `docs/decisions/<slug>.md` |
| **Meeting Notes** | Agenda, discussion notes, decisions made, and action items in one place.                                                                                                                                      | `docs/meetings/<slug>.md`  |
| **RFC**           | Propose a significant change before work starts. Captures motivation, design, drawbacks, and alternatives. Inspired by the Rust and React RFC processes.                                                      | `docs/rfcs/<slug>.md`      |
| **Runbook**       | Step-by-step operational guide for a known scenario — incident response, deployment, rollback.                                                                                                                | `docs/runbooks/<slug>.md`  |

### Git

GitHub workflow files written to the standard paths GitHub expects.

| Type            | When to use                                                                                                                                                   | Output                             |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------- |
| **PR Template** | Standardize pull request descriptions across the team. Includes title format, dependency declaration, change description, test instructions, and a checklist. | `.github/pull_request_template.md` |

## Requirements

- Node.js ≥ 18
- Git

## License

[MIT](LICENSE)
