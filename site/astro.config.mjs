import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://ihfernando.github.io',
  base: '/uva-cli',
})
