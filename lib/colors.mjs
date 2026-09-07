/**
 * Brand colors — ANSI true color (24-bit).
 * Falls back to basic ANSI if the terminal reports no true-color support.
 *
 * Dark-mode palette used for terminal output:
 *   uva    #A78BFA  (light purple — readable on dark bg)
 *   folha  #34D399  (light green)
 *   bg     #6D28D9  (deep purple — banner background)
 *   tinta  #1C1B22  (near-black ink)
 */

const TRUE_COLOR =
  process.env.COLORTERM === 'truecolor' ||
  process.env.COLORTERM === '24bit' ||
  process.env.TERM_PROGRAM === 'iTerm.app' ||
  process.env.TERM_PROGRAM === 'vscode'

function hexRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Apply foreground and/or background hex color to text. */
function paint(text, { fg, bg } = {}) {
  if (!TRUE_COLOR) return text
  let codes = ''
  if (bg) {
    const [r, g, b] = hexRgb(bg)
    codes += `\x1b[48;2;${r};${g};${b}m`
  }
  if (fg) {
    const [r, g, b] = hexRgb(fg)
    codes += `\x1b[38;2;${r};${g};${b}m`
  }
  return `${codes}${text}\x1b[0m`
}

// ── Brand helpers ──────────────────────────────────────────────────────────

/** Light purple text — for general UVA highlights. */
export const uva = (text) => paint(text, { fg: '#A78BFA' })

/** Light green text — for success messages and outros. */
export const folha = (text) => paint(text, { fg: '#34D399' })

/** Deep-purple background + light-purple text — for the intro banner pill. */
export const banner = (text) => paint(` ${text} `, { fg: '#A78BFA', bg: '#6D28D9' })

/** Light-purple dim text — for secondary info (falls back to the raw string). */
export const dim = (text) => paint(text, { fg: '#6D4FA8' })
