import nodemailer from 'nodemailer';
import axios from 'axios';

// ─── AfroBulkSMS Configuration ─────────────────────────────────
const AFRO_API_KEY = process.env.AFRO_SMS_API_KEY || '16|rN2q7ZEU7k71Tm28mqBLT3J0yOQsRRdnA6OtTWrddcf79111';
const AFRO_FROM_NUMBER = process.env.AFRO_SMS_FROM_NUMBER || '250791902917';
const AFRO_SENDER_ID = process.env.AFRO_SMS_SENDER_ID || 'MOPAS-MFA';
const AFRO_FROM_TYPE = process.env.AFRO_SMS_FROM_TYPE || 'sender_id';
const AFRO_API_URL = 'https://afrobulksms.com/api/sent/compose';

const MAX_SMS_CHARS = 160;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
const INDIVIDUAL_SEND_DELAY_MS = 300;

// ─── Strip protocol from URLs (carriers block https:// in SMS) ──
function sanitizeUrlsForSms(text: string): string {
  return text.replace(/https?:\/\/(www\.)?/gi, '');
}

// ─── Phone Number Normalization ─────────────────────────────────
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith('0')) return `+25${cleaned}`;
  if (cleaned.startsWith('250')) return `+${cleaned}`;
  return `+250${cleaned}`;
}

// ─── SMS Character Count ───────────────────────────────────────
function getSmsParts(text: string): number {
  if (text.length <= MAX_SMS_CHARS) return 1;
  return Math.ceil(text.length / 153); // concatenated SMS uses 153 chars per part
}

// ─── Retry Wrapper ─────────────────────────────────────────────
async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = RETRY_ATTEMPTS): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      const isRetryable = !status || status === 429 || status >= 500;
      if (!isRetryable || i === attempts - 1) throw err;
      const delay = RETRY_DELAY_MS * Math.pow(2, i);
      console.warn(`[SMS] ${label} attempt ${i + 1} failed (status ${status || 'network'}), retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// ─── Single SMS via AfroBulkSMS ────────────────────────────────
async function sendSmsViaAfro(phone: string, message: string): Promise<{ success: boolean; phone: string; response?: string; parts?: number }> {
  if (!AFRO_API_KEY) {
    console.error('[SMS] AFRO_SMS_API_KEY not configured');
    return { success: false, phone, response: 'API key not configured' };
  }

  const normalizedPhone = normalizePhone(phone);
  const sanitizedMessage = sanitizeUrlsForSms(message);
  const parts = getSmsParts(sanitizedMessage);

  try {
    const response = await withRetry(() => {
      return axios.post(AFRO_API_URL, null, {
        params: {
          api_key: AFRO_API_KEY,
          from_type: AFRO_FROM_TYPE,
          from_number: AFRO_FROM_NUMBER.startsWith('+') ? AFRO_FROM_NUMBER : `+${AFRO_FROM_NUMBER}`,
          sender_id: AFRO_SENDER_ID,
          to_numbers: normalizedPhone,
          body: sanitizedMessage,
          isSchedule: '',
          schedule: '',
        },
        timeout: 15000,
      });
    }, `send to ${normalizedPhone}`);

    const data = response.data;
    const respCode = data?.response;

    if (respCode === '1000' || respCode === 1000 || respCode === '1016' || respCode === 1016) {
      console.log(`[SMS] Sent to ${normalizedPhone} (${parts} part${parts > 1 ? 's' : ''})`);
      return { success: true, phone: normalizedPhone, response: String(respCode), parts };
    }

    console.warn(`[SMS] Response code ${respCode} for ${normalizedPhone}:`, JSON.stringify(data));
    return { success: false, phone: normalizedPhone, response: String(respCode), parts };
  } catch (error: any) {
    const errMsg = error?.response?.data?.response || error?.message || 'Unknown error';
    console.error(`[SMS] Failed to send to ${normalizedPhone}:`, errMsg);
    return { success: false, phone: normalizedPhone, response: errMsg, parts };
  }
}

// ─── Batch SMS via AfroBulkSMS ─────────────────────────────────
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

  const sanitizedMessage = sanitizeUrlsForSms(message);
  console.log(`[SMS] Batch sending to ${normalizedPhones.length} recipients`);

  try {
    const response = await withRetry(() => {
      return axios.post(AFRO_API_URL, null, {
        params: {
          api_key: AFRO_API_KEY,
          from_type: AFRO_FROM_TYPE,
          from_number: AFRO_FROM_NUMBER.startsWith('+') ? AFRO_FROM_NUMBER : `+${AFRO_FROM_NUMBER}`,
          sender_id: AFRO_SENDER_ID,
          to_numbers: normalizedPhones.join(','),
          body: sanitizedMessage,
          isSchedule: '',
          schedule: '',
        },
        timeout: 30000,
      });
    }, 'batch send');

    const data = response.data;
    const respCode = data?.response;

    if (respCode === '1000' || respCode === 1000 || respCode === '1016' || respCode === 1016) {
      console.log(`[SMS] Batch sent to ${normalizedPhones.length} recipients`);
      return { success: true, totalSent: normalizedPhones.length, failed: [] };
    }

    console.warn(`[SMS] Batch response code: ${respCode}, falling back to individual`);
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
  const sanitizedMessage = sanitizeUrlsForSms(message);

  for (const phone of phones) {
    if (!phone || !phone.trim()) continue;
    const result = await sendSmsViaAfro(phone, sanitizedMessage);
    if (result.success) {
      totalSent++;
    } else {
      failed.push(`${phone} (${result.response || 'unknown'})`);
    }
    await new Promise(resolve => setTimeout(resolve, INDIVIDUAL_SEND_DELAY_MS));
  }

  return { success: failed.length === 0, totalSent, failed };
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

    const failed: string[] = [];

    for (const r of recipients) {
      if (!r.email) continue;
      const personalizedText = text.replace('{name}', r.name || 'Customer');
      const personalizedSubject = subject.replace('{name}', r.name || 'Customer');
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"yoInfo Bulk" <no-reply@yoinfo.com>',
          to: r.email,
          subject: personalizedSubject,
          text: personalizedText,
          html: buildEmailHtml(personalizedText, personalizedSubject),
        });
      } catch (err: any) {
        console.error(`[EMAIL] Failed to send to ${r.email}:`, err.message || err);
        failed.push(`${r.email} (${err.message || 'unknown'})`);
      }
    }

    return { success: failed.length === 0, totalSent: recipients.length - failed.length, failed };
  },

  sendSmsBatch: async (recipients: { phone: string; name?: string }[], text: string) => {
    const sanitizedText = sanitizeUrlsForSms(text);
    const personalized = recipients
      .filter(r => r.phone && r.phone.trim())
      .map(r => ({
        phone: r.phone,
        name: r.name || 'Customer',
        message: sanitizedText.replace('{name}', r.name || 'Customer'),
      }));

    if (personalized.length === 0) {
      console.log('[SMS] No valid phone numbers to send to');
      return { success: true, totalSent: 0, failed: [], parts: 1 };
    }

    const firstMessage = personalized[0].message;
    const allSame = personalized.every(p => p.message === firstMessage);

    if (allSame) {
      const phones = personalized.map(p => p.phone);
      const result = await sendBatchSms(phones, firstMessage);
      const parts = getSmsParts(firstMessage);
      console.log(`[SMS] Batch result: ${result.totalSent} sent, ${result.failed.length} failed, ${parts} part(s)`);
      if (result.failed.length > 0) {
        console.log(`[SMS] Failed numbers: ${result.failed.join(', ')}`);
      }
      return { ...result, parts };
    } else {
      let totalSent = 0;
      const failed: string[] = [];
      let lastParts = 1;

      for (const p of personalized) {
        const result = await sendSmsViaAfro(p.phone, p.message);
        lastParts = result.parts || 1;
        if (result.success) {
          totalSent++;
        } else {
          failed.push(`${p.phone} (${result.response || 'unknown'})`);
        }
        await new Promise(resolve => setTimeout(resolve, INDIVIDUAL_SEND_DELAY_MS));
      }

      console.log(`[SMS] Individual result: ${totalSent} sent, ${failed.length} failed`);
      if (failed.length > 0) {
        console.log(`[SMS] Failed numbers: ${failed.join(', ')}`);
      }
      return { success: failed.length === 0, totalSent, failed, parts: lastParts };
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
