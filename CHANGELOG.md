# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-09-13

### Changed

- **commit flow**: file selection now comes first, before choosing the commit type and ticket — matches the natural mental model of "what changed → how to label it"
- **git commands**: replaced `git checkout` with `git switch` and `git checkout -b` with `git switch -c`, as recommended by Git since v2.23
- **start menu**: `uva init` is hidden from the menu when a project config already exists; a translated tip (`Tip: run uva init to reconfigure this project`) is shown below the welcome banner instead

## [1.3.0]

- Session loop — stay in the menu after each command instead of exiting
- Welcome screen with project name and current directory
- Ticket pre-fill from branch name on commit
- Global configuration support (`~/.config/uva/config.json`)
- Multi-language support: English and Portuguese (pt-BR)

## [1.2.0]

- `uva branch` command with interactive branch creation
- `uva push` command
- Configurable branch formats: `type-ticket-name`, `type-name`, `ticket-type-name`

## [1.1.0]

- `uva commit` command with interactive commit flow
- Configurable commit formats: `conventional-ticket`, `conventional`, `ticket-conventional`
- `uva init` setup wizard

## [1.0.0]

- Initial release
