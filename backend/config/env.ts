const jwtSecret: string | undefined = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export const JWT_SECRET: string = jwtSecret
export const JWT_EXPIRES_IN = '1h' as const

export const SMTP_HOST: string | undefined = process.env.SMTP_HOST
export const SMTP_PORT: number = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
export const SMTP_USER: string | undefined = process.env.SMTP_USER
export const SMTP_PASS: string | undefined = process.env.SMTP_PASS
export const SMTP_FROM: string = process.env.SMTP_FROM ?? 'no-reply@learnhub.dev'

export const FRAUD_API_URL: string | undefined = process.env.FRAUD_API_URL

export const AWS_REGION: string | undefined = process.env.AWS_REGION
export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY
export const AWS_S3_BUCKET: string | undefined = process.env.AWS_S3_BUCKET
export const S3_UPLOAD_URL_EXPIRES_IN = 900 as const
export const S3_DOWNLOAD_URL_EXPIRES_IN = 3600 as const
