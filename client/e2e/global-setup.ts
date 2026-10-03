import { execSync } from 'node:child_process'

const globalSetup = async (): Promise<void> => {
  const databaseUrl = process.env.E2E_RESOLVED_DATABASE_URL
  const backendDir = process.env.E2E_BACKEND_DIR
  if (!databaseUrl || !backendDir) throw new Error('E2E global setup must run through playwright.config.ts')

  execSync('npm run seed', {
    cwd: backendDir,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
}

export default globalSetup
