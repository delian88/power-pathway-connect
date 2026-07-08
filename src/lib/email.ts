import nodemailer from 'nodemailer';
import { db } from './db';

export async function sendEmail(to: string | string[], subject: string, html: string) {
  // Fetch latest SMTP settings
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  
  if (!settings || !settings.emailEnabled) {
    console.log("Email sending is disabled or settings not found.");
    return false;
  }

  if (!settings.smtpHost || !settings.smtpUser) {
    console.error("Incomplete SMTP settings.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: settings.smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${settings.heroText || 'National Electricity Workshop'}" <${settings.smtpUser}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
