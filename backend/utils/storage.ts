import { randomUUID } from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  S3_UPLOAD_URL_EXPIRES_IN,
  S3_DOWNLOAD_URL_EXPIRES_IN
} from '../config/env'

const isConfigured = Boolean(AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_S3_BUCKET)

const client = isConfigured
  ? new S3Client({
      region: AWS_REGION,
      credentials: { accessKeyId: AWS_ACCESS_KEY_ID!, secretAccessKey: AWS_SECRET_ACCESS_KEY! }
    })
  : null

export interface UploadUrlResult {
  uploadUrl: string
  key: string
}

export const createLessonContentUploadUrl = async (
  courseId: string,
  contentType: string
): Promise<UploadUrlResult> => {
  if (!client) throw new Error('Object storage is not configured — set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET')

  const key = `courses/${courseId}/lessons/${randomUUID()}`
  const command = new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: S3_UPLOAD_URL_EXPIRES_IN })

  return { uploadUrl, key }
}

export const getLessonContentDownloadUrl = async (key: string): Promise<string> => {
  if (!client) throw new Error('Object storage is not configured — set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET')

  const command = new GetObjectCommand({ Bucket: AWS_S3_BUCKET, Key: key })
  return getSignedUrl(client, command, { expiresIn: S3_DOWNLOAD_URL_EXPIRES_IN })
}
