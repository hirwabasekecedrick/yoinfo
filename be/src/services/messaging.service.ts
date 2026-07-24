import nodemailer from 'nodemailer';

// Mock SMS Service since no API was specified
const sendSmsStub = async (phone: string, message: string) => {
  console.log(`[SMS STUB] Sending to ${phone}: ${message}`);
  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 50));
};

export const messagingService = {
  sendEmails: async (recipients: { email: string; name?: string }[], subject: string, text: string) => {
    // Basic Nodemailer setup. In production, read from process.env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
      }
    });

    const sendPromises = recipients.map(r => {
      if (!r.email) return Promise.resolve();
      return transporter.sendMail({
        from: process.env.EMAIL_FROM || '"InfoPulse Bulk" <no-reply@infopulse.com>',
        to: r.email,
        subject: subject,
        text: text.replace('{name}', r.name || 'Customer')
      }).catch(err => {
        console.error(`Failed to send email to ${r.email}:`, err);
      });
    });

    await Promise.all(sendPromises);
    return true;
  },

  sendSmsBatch: async (recipients: { phone: string; name?: string }[], text: string) => {
    const sendPromises = recipients.map(r => {
      if (!r.phone) return Promise.resolve();
      return sendSmsStub(r.phone, text.replace('{name}', r.name || 'Customer'));
    });

    await Promise.all(sendPromises);
    return true;
  }
};
