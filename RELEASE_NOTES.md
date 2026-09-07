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
