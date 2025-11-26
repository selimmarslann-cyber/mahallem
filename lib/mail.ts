/**
 * Email Service - Zoho SMTP Integration
 * 
 * Reusable email sending service using nodemailer
 */

import nodemailer from 'nodemailer'

// Zoho SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

/**
 * Send email
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - Email HTML content
 * @returns Promise with message info
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<nodemailer.SentMessageInfo> {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Email configuration is missing. Please set MAIL_USER and MAIL_PASS environment variables.')
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

/**
 * Send OTP email
 * @param to - Recipient email address
 * @param code - 6-digit OTP code
 * @returns Promise with message info
 */
export async function sendOtpEmail(
  to: string,
  code: string
): Promise<nodemailer.SentMessageInfo> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mahallem - Doğrulama Kodu</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6000 0%, #FF5500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">MAHALLEM</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #FF6000; margin-top: 0;">Doğrulama Kodunuz</h2>
        <p>Merhaba,</p>
        <p>Mahallem hesabınız için doğrulama kodunuz:</p>
        <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px dashed #FF6000;">
          <h1 style="color: #FF6000; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">Bu kod 5 dakika süreyle geçerlidir.</p>
        <p style="color: #666; font-size: 14px;">Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          Bu otomatik bir e-postadır. Lütfen yanıtlamayın.
        </p>
      </div>
    </body>
    </html>
  `

  return sendMail(to, 'Mahallem - Doğrulama Kodu', html)
}

