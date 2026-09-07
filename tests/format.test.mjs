import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCommitMessage, buildBranchName } from '../lib/format.mjs'

// --- buildCommitMessage ---

test('conventional-ticket: wraps ticket in parentheses', () => {
  assert.equal(
    buildCommitMessage('conventional-ticket', {
      type: 'feat',
      ticket: 'PROJ-42',
      message: 'add login screen',
    }),
    'feat(PROJ-42): add login screen',
  )
})

test('conventional: no ticket in message', () => {
  assert.equal(
    buildCommitMessage('conventional', { type: 'fix', ticket: '', message: 'fix crash on load' }),
    'fix: fix crash on load',
  )
})

test('ticket-conventional: ticket comes first in brackets', () => {
  assert.equal(
    buildCommitMessage('ticket-conventional', {
      type: 'feat',
      ticket: 'PROJ-42',
      message: 'add login screen',
    }),
    '[PROJ-42] feat: add login screen',
  )
})

test('unknown format falls back to conventional', () => {
  assert.equal(
    buildCommitMessage('unknown-format', { type: 'chore', ticket: '', message: 'update deps' }),
    'chore: update deps',
  )
})

// --- buildBranchName ---

test('type-ticket-name: joins with slash and underscore', () => {
  assert.equal(
    buildBranchName('type-ticket-name', {
      type: 'feat',
      ticket: 'PROJ-42',
      name: 'add login screen',
    }),
    'feat/PROJ-42_add-login-screen',
  )
})

test('type-name: no ticket in branch', () => {
  assert.equal(
    buildBranchName('type-name', { type: 'fix', ticket: '', name: 'fix crash on load' }),
    'fix/fix-crash-on-load',
  )
})

test('ticket-type-name: ticket is first segment', () => {
  assert.equal(
    buildBranchName('ticket-type-name', {
      type: 'feat',
      ticket: 'PROJ-42',
      name: 'add login screen',
    }),
    'PROJ-42/feat/add-login-screen',
  )
})

test('unknown format falls back to type-name', () => {
  assert.equal(
    buildBranchName('unknown-format', { type: 'docs', ticket: '', name: 'update readme' }),
    'docs/update-readme',
  )
})

test('slugifies the task name in all formats', () => {
  assert.equal(
    buildBranchName('type-ticket-name', {
      type: 'feat',
      ticket: 'PROJ-1',
      name: 'Add Ação de Login!',
    }),
    'feat/PROJ-1_add-acao-de-login',
  )
})
