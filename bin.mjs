#!/usr/bin/env node
import { Command } from 'commander'
import { runInit } from './commands/init.mjs'
import { runCommit } from './commands/commit.mjs'
import { runBranch } from './commands/branch.mjs'
import { runNewFile } from './commands/new-file.mjs'
import { runPush } from './commands/push.mjs'
import { runStart } from './commands/start.mjs'

const program = new Command()

program.name('uva').description('UVA CLI — Git workflow automation').version('1.1.0')

program.command('start').description('Show all available options interactively').action(runStart)

program
  .command('init')
  .description('Set up UVA CLI for this project')
  .option('--global', 'save as global config (~/.config/uva/config.json)')
  .action(runInit)

program
  .command('commit')
  .description('Create an interactive commit following Conventional Commits')
  .option('--type <type>', 'commit type (feat, fix, docs, style, refactor, test, chore)')
  .option('--ticket <id>', 'ticket ID, e.g. PROJ-42')
  .option('--message <msg>', 'commit message')
  .option('--files <paths>', 'files to stage, comma-separated paths')
  .option('--all', 'stage all changed files')
  .action(runCommit)

program
  .command('branch')
  .description('Create a new branch from a configured source')
  .option('--source <branch>', 'source branch to checkout from')
  .option('--ticket <id>', 'ticket ID, e.g. PROJ-42')
  .option('--type <type>', 'branch type (feat, fix, docs, style, refactor, test, chore)')
  .option('--name <name>', 'task name (will be slugified into the branch name)')
  .action(runBranch)

program
  .command('new-file')
  .description('Scaffold a file from a template (docs, git)')
  .option('--lang <lang>', 'language: en | pt-br')
  .option('--category <category>', 'category: docs | git')
  .option(
    '--type <type>',
    'file type: adr | decision-log | meeting-notes | rfc | runbook | pull-request',
  )
  .option('--name <name>', 'file title (docs only)')
  .option('--folder <path>', 'output folder path (docs only)')
  .action(runNewFile)

program
  .command('push')
  .description('Push the current branch to origin')
  .option('-y, --yes', 'skip confirmation and push immediately')
  .action(runPush)

program.parse()
