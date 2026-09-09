# 1.3.0

## What's new

### Session mode in `uva start`

`uva start` now keeps the menu alive after each command completes — no need to re-run it between actions. A welcome screen with the UVA logo appears once at startup showing the project name and current directory. A new **Exit** option (or `Ctrl+C`) ends the session.

### Welcome screen

The interactive session opens with a styled welcome box: ASCII grape logo in UVA purple, project name from `uva.config.json`, and the current directory path. The welcome message is fully translated (EN / PT-BR).

### Ticket pre-filled from current branch (`uva commit`)

When prompted for a ticket, UVA CLI now reads the current branch name and pre-fills the field if it finds a matching ticket (e.g. `feat/PROJ-42_...` → `PROJ-42`). The value is fully editable.

### i18n completeness

All strings in `uva start` (welcome message, exit option) are now covered by the locale files. A missing translation fallback in `uva init` was also fixed.

---

# 1.2.0

## What's new

### Global configuration (`uva init --global`)

UVA CLI can now be configured globally, so your personal defaults apply to every project that doesn't have its own `uva.config.json`.

```bash
uva init --global
```

The global config is saved to `~/.config/uva/config.json`. The resolution order is:

1. `uva.config.json` at the git root (project-level, takes priority)
2. `~/.config/uva/config.json` (global fallback)

To update your global settings at any time, re-run `uva init --global`.

### "All files" shortcut in `uva commit`

When there are 5 or more changed files, a new **All files** option appears at the top of the file selection list. Selecting it stages every changed file, skipping individual selection.
