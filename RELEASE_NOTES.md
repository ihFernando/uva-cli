## 1.4.0

### Commit flow reordered

File selection in `uva commit` now comes **first** — before choosing the commit type and ticket. This matches the natural mental model: you see what changed, then decide how to label it.

### `git switch` replaces `git checkout`

Branch switching and creation now use `git switch` and `git switch -c`, the modern Git commands recommended since v2.23.

### `uva init` removed from the start menu (when already configured)

Once a project has a `uva.config.json`, `uva init` no longer clutters the menu. Instead, a translated tip appears below the welcome banner:

> Tip: run `uva init` to reconfigure this project

If no config exists (first run), `uva init` still appears at the top of the menu as before.

---

## 1.3.0

### Session mode in `uva start`

`uva start` now keeps the menu alive after each command completes — no need to re-run it between actions. A welcome screen with the UVA logo appears once at startup showing the project name and current directory. A new **Exit** option (or `Ctrl+C`) ends the session.

### Welcome screen

The interactive session opens with a styled welcome box: ASCII grape logo in UVA purple, project name from `uva.config.json`, and the current directory path. The welcome message is fully translated (EN / PT-BR).

### Ticket pre-filled from current branch (`uva commit`)

When prompted for a ticket, UVA CLI now reads the current branch name and pre-fills the field if it finds a matching ticket (e.g. `feat/PROJ-42_...` → `PROJ-42`). The value is fully editable.

### i18n completeness

All strings in `uva start` (welcome message, exit option) are now covered by the locale files. A missing translation fallback in `uva init` was also fixed.

---

## 1.2.0

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
