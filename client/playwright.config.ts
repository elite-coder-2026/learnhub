import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const BACKEND_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../backend')

const readEnvValue = (fileName: string, key: string): string | undefined => {
  try {
    const line = readFileSync(resolve(BACKEND_DIR, fileName), 'utf8')
      .split('\n')
      .find((entry) => entry.startsWith(`${key}=`))
    return line?.slice(key.length + 1).trim()
  } catch {
    return undefined
  }
}

const testDatabaseUrl = process.env.E2E_DATABASE_URL ?? readEnvValue('.env.test', 'DATABASE_URL')
const devDatabaseUrl = readEnvValue('.env', 'DATABASE_URL')

if (!testDatabaseUrl) {
  throw new Error('E2E needs a test database: set E2E_DATABASE_URL or DATABASE_URL in backend/.env.test')
}
if (testDatabaseUrl === devDatabaseUrl) {
  throw new Error('E2E database must not be the dev database (backend/.env DATABASE_URL)')
}

const apiPort = process.env.E2E_API_PORT ?? '3001'
const webPort = process.env.E2E_WEB_PORT ?? '5174'
const apiUrl = `http://localhost:${apiPort}`
process.env.E2E_API_URL = apiUrl
process.env.E2E_RESOLVED_DATABASE_URL = testDatabaseUrl
process.env.E2E_BACKEND_DIR = BACKEND_DIR

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${webPort}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm start',
      cwd: BACKEND_DIR,
      url: `${apiUrl}/courses`,
      reuseExistingServer: false,
      env: { DATABASE_URL: testDatabaseUrl, PORT: apiPort },
    },
    {
      command: `npx vite --port ${webPort} --strictPort`,
      url: `http://localhost:${webPort}`,
      reuseExistingServer: false,
      env: { VITE_API_URL: apiUrl },
    },
  ],
})
