/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        uva: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa', // light purple — dark mode accent
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9', // deep purple — brand primary
          800: '#5b21b6',
          900: '#4c1d95',
          ink: '#1c1b22', // near-black
        },
        folha: {
          light: '#0f9d6b', // stem green — light mode
          DEFAULT: '#34d399', // leaf green — dark mode
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        glow: 'glow 4s ease-in-out infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.3' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
