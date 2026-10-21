const nodemailer = require('nodemailer');
const env = require('../config/env');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Creates and returns a Nodemailer transporter using the latest credentials.
 * Automatically reloads .env and cleans whitespace from Google 16-letter App Passwords.
 */
const getTransporter = () => {
  dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

  const user = (process.env.EMAIL_USER || env.EMAIL_USER || 'mhd.developer10@gmail.com').trim();
  const rawPass = process.env.EMAIL_PASSWORD || env.EMAIL_PASSWORD || '';
  const pass = rawPass.trim().replace(/\s+/g, '');

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || env.EMAIL_PORT, 10) || 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Plain text version of the Developer Notification Email.
 * Crucial for spam filters to verify multipart/alternative integrity.
 */
const createDeveloperEmailText = (data) => {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `NEW PORTFOLIO INQUIRY RECEIVED
========================================

Sender Name:      ${data.name}
Sender Email:     ${data.email}
Phone / WhatsApp: ${data.phone || 'Not provided'}
Subject:          ${data.subject}
Received At:      ${timestamp}

INQUIRY MESSAGE:
----------------------------------------
${data.message}

----------------------------------------
To reply directly to ${data.name}, email: ${data.email}
Sent via Momin Mahmmadbhai Portfolio Website (mominmahmmadbhai.dev).
Sidhpur, Patan, Gujarat, India.
`;
};

/**
 * Clean, table-based HTML template for Developer Notification Email.
 */
const createDeveloperEmailHtml = (data) => {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Contact Inquiry</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden;">
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px; border-bottom: 3px solid #0ea5e9;">
        <h2 style="color: #ffffff; margin: 0 0 4px 0; font-size: 20px;">New Portfolio Inquiry</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">Received via Portfolio Contact Form</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="width: 140px; font-weight: bold; color: #475569; font-size: 14px;">Sender Name:</td>
            <td style="color: #0f172a; font-size: 14px;"><strong>${data.name}</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="font-weight: bold; color: #475569; font-size: 14px;">Sender Email:</td>
            <td style="color: #0ea5e9; font-size: 14px;"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="font-weight: bold; color: #475569; font-size: 14px;">Phone / WhatsApp:</td>
            <td style="color: #0f172a; font-size: 14px;">${data.phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="font-weight: bold; color: #475569; font-size: 14px;">Subject:</td>
            <td style="color: #0f172a; font-size: 14px;">${data.subject}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="font-weight: bold; color: #475569; font-size: 14px;">Received At:</td>
            <td style="color: #64748b; font-size: 13px;">${timestamp}</td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Message Content:</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Reply to ${data.name}
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Momin Mahmmadbhai • Full-Stack Developer • Sidhpur, Patan, Gujarat, India
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Plain text version of Client Confirmation Email.
 * Essential for spam filter passing and mobile watch/screen reader compatibility.
 */
const createClientConfirmationEmailText = (data) => {
  return `Hello ${data.name},

Thank you for reaching out through my portfolio website.

This email confirms that I have received your message regarding "${data.subject}". I will review your requirements and get back to you as soon as possible.

A summary of the information you submitted:
--------------------------------------------------
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Subject: ${data.subject}

Your Message:
${data.message}
--------------------------------------------------

If your inquiry is urgent, feel free to connect with me directly:
- WhatsApp: +91 93165 15672 (https://wa.me/919316515672)
- Telegram: @Mohammad_041 (https://telegram.me/Mohammad_041)
- Portfolio: https://mominmahmmadbhai.dev/

Warm regards,
Momin Mahmmadbhai
Full-Stack MERN Developer
Sidhpur, Patan, Gujarat, India

---
You are receiving this confirmation email because you submitted a contact inquiry on https://mominmahmmadbhai.dev/. If you did not make this request, please disregard this email.
`;
};

/**
 * Clean, trusted HTML template for Client Confirmation Email.
 * Structured to pass modern anti-spam filters (Gmail, Outlook, Yahoo).
 */
const createClientConfirmationEmailHtml = (data) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your message to Momin Mahmmadbhai has been received</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden;">
    <tr>
      <td style="background-color: #0f172a; padding: 28px 32px; text-align: center; border-bottom: 3px solid #10b981;">
        <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: bold;">Message Received</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">Momin Mahmmadbhai — Full-Stack Developer</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 15px; margin-top: 0;">Hello <strong>${data.name}</strong>,</p>
        <p style="font-size: 14px; color: #334155;">
          Thank you for reaching out through my portfolio website. I have received your message regarding <strong>"${data.subject}"</strong> and will review your inquiry and get back to you shortly.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; margin: 24px 0;">
          <h4 style="margin: 0 0 12px 0; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Summary of Your Submission:</h4>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px;">
            <tr>
              <td style="width: 100px; color: #64748b; font-weight: bold;">Name:</td>
              <td style="color: #0f172a;">${data.name}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: bold;">Email:</td>
              <td style="color: #0f172a;">${data.email}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: bold;">Phone:</td>
              <td style="color: #0f172a;">${data.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: bold;">Subject:</td>
              <td style="color: #0f172a;">${data.subject}</td>
            </tr>
          </table>
          <div style="margin-top: 12px; padding: 10px 12px; background-color: #ffffff; border-left: 3px solid #10b981; border-radius: 4px;">
            <span style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Message:</span>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #334155; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; border-radius: 6px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #475569; text-align: center;">
          <strong style="color: #0f172a;">For urgent discussions, reach out directly:</strong><br>
          <a href="https://wa.me/919316515672" style="color: #059669; text-decoration: none; font-weight: bold; margin: 0 6px;">WhatsApp (+91 93165 15672)</a> •
          <a href="https://telegram.me/Mohammad_041" style="color: #0284c7; text-decoration: none; font-weight: bold; margin: 0 6px;">Telegram (@Mohammad_041)</a>
        </div>

        <p style="font-size: 14px; margin-bottom: 0;">
          Warm regards,<br>
          <strong>Momin Mahmmadbhai</strong><br>
          <span style="color: #64748b; font-size: 13px;">Full-Stack Developer (MERN)</span>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 18px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.5;">
        You received this email because you submitted a contact inquiry on <a href="https://mominmahmmadbhai.dev/" style="color: #64748b;">mominmahmmadbhai.dev</a>.<br>
        Momin Mahmmadbhai • Sidhpur, Patan, Gujarat, India.
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Send email notifications for a new contact form submission:
 * 1. Delivers complete inquiry details to the Developer (mhd.developer10@gmail.com).
 * 2. Sends an automated confirmation receipt to the Client (contactData.email) with anti-spam compliance.
 */
const sendContactNotification = async (contactData) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      '[Email Service Warning] EMAIL_PASSWORD is not set in backend/.env. Gmail SMTP authentication requires a 16-character Google App Password (myaccount.google.com/apppasswords).'
    );
    return {
      sent: false,
      reason: 'EMAIL_PASSWORD missing in .env.',
    };
  }

  const senderUser = (process.env.EMAIL_USER || env.EMAIL_USER || 'mhd.developer10@gmail.com').trim();
  const developerRecipient = (process.env.CONTACT_EMAIL || env.CONTACT_EMAIL || 'mhd.developer10@gmail.com').trim();

  // Email 1: Notification to the Developer
  const developerMailOptions = {
    from: `"Portfolio Contact Form" <${senderUser}>`,
    to: developerRecipient,
    replyTo: `"${contactData.name}" <${contactData.email}>`,
    subject: `[Portfolio Inquiry] ${contactData.subject} - from ${contactData.name}`,
    text: createDeveloperEmailText(contactData),
    html: createDeveloperEmailHtml(contactData),
    headers: {
      'X-Mailer': 'Momin-Portfolio-Backend',
    },
  };

  // Email 2: Confirmation Receipt to the Client (Strict Anti-Spam Headers & Multipart Text+HTML)
  const clientMailOptions = {
    from: `"Momin Mahmmadbhai" <${senderUser}>`,
    to: contactData.email,
    replyTo: developerRecipient,
    subject: `Confirmation: Your message to Momin Mahmmadbhai has been received`,
    text: createClientConfirmationEmailText(contactData),
    html: createClientConfirmationEmailHtml(contactData),
    headers: {
      'Auto-Submitted': 'auto-replied',
      'X-Auto-Response-Suppress': 'All',
      'Precedence': 'bulk',
      'X-Mailer': 'Momin-Portfolio-Backend',
    },
  };

  try {
    const [devResult, clientResult] = await Promise.allSettled([
      transporter.sendMail(developerMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);

    const devSuccess = devResult.status === 'fulfilled';
    const clientSuccess = clientResult.status === 'fulfilled';

    if (devSuccess) {
      console.log(`[Email Service] Developer notification sent: ${devResult.value.messageId}`);
    } else {
      console.error(`[Email Service Error] Failed to send developer email: ${devResult.reason?.message}`);
    }

    if (clientSuccess) {
      console.log(`[Email Service] Client confirmation sent: ${clientResult.value.messageId}`);
    } else {
      console.error(`[Email Service Error] Failed to send client confirmation: ${clientResult.reason?.message}`);
    }

    return {
      sent: devSuccess || clientSuccess,
      developerEmail: devSuccess,
      clientEmail: clientSuccess,
    };
  } catch (error) {
    console.error(`[Email Service Critical Error] Unexpected failure: ${error.message}`);
    return { sent: false, error: error.message };
  }
};

module.exports = {
  sendContactNotification,
  getTransporter,
};
