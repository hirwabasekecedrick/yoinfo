import nodemailer from 'nodemailer';
import axios from 'axios';

// ─── AfroBulkSMS Configuration ─────────────────────────────────
const AFRO_API_KEY = process.env.AFRO_SMS_API_KEY || '16|rN2q7ZEU7k71Tm28mqBLT3J0yOQsRRdnA6OtTWrddcf79111';
const AFRO_FROM_NUMBER = process.env.AFRO_SMS_FROM_NUMBER || '250791902917';
const AFRO_SENDER_ID = process.env.AFRO_SMS_SENDER_ID || 'MOPAS-MFA';
const AFRO_FROM_TYPE = process.env.AFRO_SMS_FROM_TYPE || 'sender_id';
const AFRO_API_URL = 'https://afrobulksms.com/api/sent/compose';

// ─── Phone Number Normalization ─────────────────────────────────
// Ensures numbers are in +250XXXXXXXXX format for AfroBulkSMS
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '');

  // Already has + prefix
  if (cleaned.startsWith('+')) return cleaned;

  // Starts with 00 (international prefix) — replace with +
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`;

  // Starts with 0 (local Rwanda number like 078...) — add +250
  if (cleaned.startsWith('0')) return `+25${cleaned}`;

  // Starts with 250 (country code without +) — add +
  if (cleaned.startsWith('250')) return `+${cleaned}`;

  // Bare number (like 78...) — assume Rwanda
  return `+250${cleaned}`;
}

// ─── SMS via AfroBulkSMS ───────────────────────────────────────
async function sendSmsViaAfro(phone: string, message: string): Promise<{ success: boolean; phone: string; response?: string }> {
  if (!AFRO_API_KEY) {
    console.error('[SMS] AFRO_SMS_API_KEY not configured');
    return { success: false, phone, response: 'API key not configured' };
  }

  const normalizedPhone = normalizePhone(phone);

  try {
    const response = await axios.get(AFRO_API_URL, {
      params: {
        api_key: AFRO_API_KEY,
        from_type: AFRO_FROM_TYPE,
        from_number: AFRO_FROM_NUMBER,
        sender_id: AFRO_SENDER_ID,
        to_numbers: normalizedPhone,
        body: message,
        isSchedule: '',
        schedule: '',
      },
      timeout: 15000,
    });

    const data = response.data;
    console.log(`[SMS] Raw API response for ${normalizedPhone}:`, JSON.stringify(data));
    const respCode = data?.response;

    // Response codes: "1000" typically means success for AfroBulkSMS
    // "1016" and others are error codes
    if (respCode === '1000' || respCode === 1000) {
      console.log(`[SMS] Sent successfully to ${normalizedPhone}`);
      return { success: true, phone: normalizedPhone, response: String(respCode) };
    }

    console.warn(`[SMS] Response code ${respCode} for ${normalizedPhone}`);
    return { success: false, phone: normalizedPhone, response: String(respCode) };
  } catch (error: any) {
    const errMsg = error?.response?.data?.response || error?.message || 'Unknown error';
    console.error(`[SMS] Failed to send to ${normalizedPhone}:`, errMsg);
    return { success: false, phone: normalizedPhone, response: errMsg };
  }
}

// ─── Batch SMS via AfroBulkSMS ─────────────────────────────────
// The API accepts comma-separated to_numbers for bulk sending
async function sendBatchSms(phones: string[], message: string): Promise<{ success: boolean; totalSent: number; failed: string[] }> {
  if (!AFRO_API_KEY) {
    console.error('[SMS] AFRO_SMS_API_KEY not configured');
    return { success: false, totalSent: 0, failed: phones };
  }

  const normalizedPhones = phones
    .filter(p => p && p.trim())
    .map(normalizePhone);

  if (normalizedPhones.length === 0) {
    return { success: true, totalSent: 0, failed: [] };
  }

  console.log(`[SMS] Batch sending to: ${normalizedPhones.join(', ')}`);

  try {
    const response = await axios.get(AFRO_API_URL, {
      params: {
        api_key: AFRO_API_KEY,
        from_type: AFRO_FROM_TYPE,
        from_number: AFRO_FROM_NUMBER,
        sender_id: AFRO_SENDER_ID,
        to_numbers: normalizedPhones.join(','),
        body: message,
        isSchedule: '',
        schedule: '',
      },
      timeout: 30000,
    });

    const data = response.data;
    const respCode = data?.response;

    if (respCode === '1000' || respCode === 1000) {
      console.log(`[SMS] Batch sent successfully to ${normalizedPhones.length} recipients`);
      return { success: true, totalSent: normalizedPhones.length, failed: [] };
    }

    console.warn(`[SMS] Batch response code: ${respCode}`);
    // On batch failure, fall back to individual sending
    return await sendIndividualSms(normalizedPhones, message);
  } catch (error: any) {
    console.error('[SMS] Batch send failed, falling back to individual:', error?.message);
    return await sendIndividualSms(normalizedPhones, message);
  }
}

// ─── Individual SMS Fallback ───────────────────────────────────
async function sendIndividualSms(phones: string[], message: string): Promise<{ success: boolean; totalSent: number; failed: string[] }> {
  const failed: string[] = [];
  let totalSent = 0;

  // Send sequentially to avoid rate limiting
  for (const phone of phones) {
    if (!phone || !phone.trim()) continue;
    const result = await sendSmsViaAfro(phone, message);
    if (result.success) {
      totalSent++;
    } else {
      failed.push(phone);
    }
    // Small delay between individual sends to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return {
    success: failed.length === 0,
    totalSent,
    failed,
  };
}

// ─── Email via Nodemailer ──────────────────────────────────────
const buildEmailHtml = (text: string, campaignName: string): string => {
  const paragraphs = text.split('\n').filter(p => p.trim()).map(p => `<p style="margin:0 0 12px;color:#333;font-size:15px;line-height:1.6;">${p}</p>`).join('');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FBF6F9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;">
    <div style="background:linear-gradient(135deg,#C1027D,#8A0260);padding:20px 24px;">
      <h1 style="margin:0;color:#fff;font-size:18px;">${campaignName}</h1>
    </div>
    <div style="padding:24px;">
      ${paragraphs || `<p style="color:#333;font-size:15px;line-height:1.6;">${text}</p>`}
    </div>
    <div style="padding:16px 24px;background:#fdf4fa;border-top:1px solid #f0e4ec;">
      <p style="margin:0;font-size:12px;color:#999;">Sent via yoInfo — Update. Publish. Blast.</p>
    </div>
  </div>
</body>
</html>`;
};

// ─── WhatsApp Stub ─────────────────────────────────────────────
const sendWhatsAppStub = async (phone: string, message: string) => {
  console.log(`[WHATSAPP STUB] Sending to ${phone}: ${message}`);
  return new Promise((resolve) => setTimeout(resolve, 50));
};

// ─── Exported Service ──────────────────────────────────────────
export const messagingService = {
  sendEmails: async (recipients: { email: string; name?: string }[], subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    const sendPromises = recipients.map(r => {
      if (!r.email) return Promise.resolve();
      const personalizedText = text.replace('{name}', r.name || 'Customer');
      const personalizedSubject = subject.replace('{name}', r.name || 'Customer');
      return transporter.sendMail({
        from: process.env.EMAIL_FROM || '"yoInfo Bulk" <no-reply@yoinfo.com>',
        to: r.email,
        subject: personalizedSubject,
        text: personalizedText,
        html: buildEmailHtml(personalizedText, personalizedSubject),
      }).catch(err => {
        console.error(`Failed to send email to ${r.email}:`, err);
      });
    });

    await Promise.all(sendPromises);
    return true;
  },

  sendSmsBatch: async (recipients: { phone: string; name?: string }[], text: string) => {
    // Personalize each recipient's message and collect phones
    const personalized = recipients
      .filter(r => r.phone && r.phone.trim())
      .map(r => ({
        phone: r.phone,
        message: text.replace('{name}', r.name || 'Customer'),
      }));

    if (personalized.length === 0) {
      console.log('[SMS] No valid phone numbers to send to');
      return true;
    }

    // Collect all phone numbers
    const phones = personalized.map(p => p.phone);

    // Use the first personalized message (bulk mode — same message to all)
    // If personalized messages differ per contact, fall back to individual sending
    const firstMessage = personalized[0].message;
    const allSame = personalized.every(p => p.message === firstMessage);

    if (allSame) {
      // Batch send — all recipients get the same message
      const result = await sendBatchSms(phones, firstMessage);
      console.log(`[SMS] Batch result: ${result.totalSent} sent, ${result.failed.length} failed`);
      return result.success;
    } else {
      // Individual send — each recipient gets a personalized message
      let allSuccess = true;
      for (const p of personalized) {
        const result = await sendSmsViaAfro(p.phone, p.message);
        if (!result.success) allSuccess = false;
      }
      return allSuccess;
    }
  },

  sendWhatsApp: async (recipients: { phone: string; name?: string; email?: string }[], text: string) => {
    const sendPromises = recipients.map(r => {
      const target = r.phone || r.email;
      if (!target) return Promise.resolve();
      return sendWhatsAppStub(target, text.replace('{name}', r.name || 'Customer'));
    });

    await Promise.all(sendPromises);
    return true;
  }
};
