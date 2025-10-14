// utils/sendEmail.js
const SibApiV3Sdk = require('sib-api-v3-sdk')
const dotenv = require('dotenv')

dotenv.config()

// Initialized Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

/**
 * Sending email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} htmlContent - HTML content of email
 */
const sendEmail = async (to, subject, htmlContent) => {
  const emailData = {
    sender: { name: 'TaskPro', email: 'mlangaviclyde@gmail.com' }, 
    to: [{ email: to }],
    subject,
    htmlContent,
  }

  try {
    console.log('📤 Sending email to:', to)
    const response = await apiInstance.sendTransacEmail(emailData)
    console.log('Email sent successfully:', response.messageId || response)
  } catch (error) {
    console.error(' Failed to send email:')
    console.error(error.response?.text || error.message)
  }
}

module.exports = { sendEmail }
