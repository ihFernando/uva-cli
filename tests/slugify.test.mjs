import { test } from 'node:test'
import assert from 'node:assert/strict'
import { slugify } from '../lib/slugify.mjs'

test('converts spaces to hyphens', () => {
  assert.equal(slugify('add login screen'), 'add-login-screen')
})

test('lowercases text', () => {
  assert.equal(slugify('Add Login Screen'), 'add-login-screen')
})

test('removes diacritics', () => {
  assert.equal(slugify('criação de tela'), 'criacao-de-tela')
})

test('removes special characters', () => {
  assert.equal(slugify('hello! world?'), 'hello-world')
})

test('collapses multiple spaces into one hyphen', () => {
  assert.equal(slugify('hello   world'), 'hello-world')
})

test('trims leading and trailing hyphens', () => {
  assert.equal(slugify('  hello  '), 'hello')
})

test('handles empty string', () => {
  assert.equal(slugify(''), '')
})
