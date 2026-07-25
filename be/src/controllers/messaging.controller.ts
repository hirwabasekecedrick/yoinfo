import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { messagingService } from '../services/messaging.service';

export const sendBulkMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, message, emailSubject, emailMessage, smsMessage, whatsappMessage, contacts, channels, cost } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      res.status(400).json({ error: 'Contacts list is required and cannot be empty' });
      return;
    }

    // Determine which channel-specific messages to use, with fallback to legacy `message` field
    const finalEmailMessage = emailMessage || message || '';
    const finalEmailSubject = emailSubject || name || 'Bulk Message';
    const finalSmsMessage = smsMessage || message || '';
    const finalWhatsappMessage = whatsappMessage || smsMessage || message || '';

    if (!finalEmailMessage && !finalSmsMessage && !finalWhatsappMessage) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    let sendSms = channels.includes('SMS');
    let sendEmail = channels.includes('EMAIL');
    let sendWhatsapp = channels.includes('WHATSAPP');

    // Filter contacts by channel capability
    const contactsWithEmail = contacts.filter((c: any) => c.email && c.email.trim());
    const contactsWithPhone = contacts.filter((c: any) => c.phone && c.phone.trim());

    if (sendEmail && finalEmailMessage && contactsWithEmail.length > 0) {
      console.log(`[EMAIL] Sending to ${contactsWithEmail.length} contacts with email addresses`);
      await messagingService.sendEmails(contactsWithEmail, finalEmailSubject, finalEmailMessage);
    } else if (sendEmail && contactsWithEmail.length === 0) {
      console.warn('[EMAIL] No contacts with email addresses found — skipping email send');
    }
    
    if (sendSms && finalSmsMessage && contactsWithPhone.length > 0) {
      console.log(`[SMS] Sending to ${contactsWithPhone.length} contacts with phone numbers`);
      await messagingService.sendSmsBatch(contactsWithPhone, finalSmsMessage);
    } else if (sendSms && contactsWithPhone.length === 0) {
      console.warn('[SMS] No contacts with phone numbers found — skipping SMS send');
    }

    if (sendWhatsapp && finalWhatsappMessage) {
      await messagingService.sendWhatsApp(contacts, finalWhatsappMessage);
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: name || 'Untitled Campaign',
        message: finalEmailMessage || finalSmsMessage || finalWhatsappMessage,
        channels: channels || [],
        status: 'SENT',
        recipients: contacts.length,
        cost: cost || 0,
        authorId: req.user.id,
      }
    });

    res.status(200).json({ success: true, campaign });
  } catch (error) {
    console.error('Failed to send bulk message:', error);
    res.status(500).json({ error: 'Internal server error while sending bulk message' });
  }
};

export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const campaigns = await prisma.campaign.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
