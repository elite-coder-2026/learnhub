import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      css: true,
      setupFiles: ['./src/tests/setup.ts'],
      exclude: ['**/node_modules/**', '**/e2e/**'],
    },
  }),
)
