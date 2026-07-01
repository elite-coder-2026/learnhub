import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

const CERTIFICATES_DIR = path.join(__dirname, '..', 'certificates')

interface CertificatePdfInput {
  certificateId: string
  studentName: string
  courseTitle: string
  issuedAt: Date
}

export const generateCertificatePdf = async (input: CertificatePdfInput): Promise<string> => {
  fs.mkdirSync(CERTIFICATES_DIR, { recursive: true })

  const filePath = path.join(CERTIFICATES_DIR, `${input.certificateId}.pdf`)

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' })
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.fontSize(28).text('Certificate of Completion', { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(16).text('This certifies that', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(24).text(input.studentName, { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(16).text('has successfully completed', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(20).text(input.courseTitle, { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(12).text(`Issued on ${input.issuedAt.toDateString()}`, { align: 'center' })
    doc.fontSize(10).text(`Certificate ID: ${input.certificateId}`, { align: 'center' })

    doc.end()
    stream.on('finish', () => resolve())
    stream.on('error', reject)
  })

  return filePath
}
