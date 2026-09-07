# 1.1.0

## What's new

### Multi-language support (English and Português BR)

All interactive prompts, messages, and errors are now fully localized. During `uva init`, the first question is the language preference — the answer is saved to `uva.config.json` and used by every subsequent command.

Supported languages:

- English (`en`)
- Português (BR) (`pt-br`)

To change the language of an existing project, re-run `uva init`.

### New config field: `project.lang`

The chosen language is stored in `uva.config.json` under `project.lang`:

```json
{
  "project": {
    "name": "My Project",
    "lang": "pt-br"
  }
}
```

Accepted values: `"en"` and `"pt-br"`. Defaults to `"en"` if the field is absent.
