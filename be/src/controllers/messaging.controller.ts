import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { messagingService } from '../services/messaging.service';

type SendResult = { success: boolean; totalSent: number; failed: string[] };

function everyResultFailed(results: (SendResult | null)[]): boolean {
  const valid = results.filter(Boolean) as SendResult[];
  if (valid.length === 0) return false;
  return valid.every(r => r.totalSent === 0 && r.failed.length > 0);
}

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

    const contactsWithEmail = contacts.filter((c: any) => c.email && c.email.trim());
    const contactsWithPhone = contacts.filter((c: any) => c.phone && c.phone.trim());

    let emailResult: { success: boolean; totalSent: number; failed: string[] } | null = null;
    let smsResult: { success: boolean; totalSent: number; failed: string[]; parts?: number } | null = null;

    if (sendEmail && finalEmailMessage && contactsWithEmail.length > 0) {
      console.log(`[EMAIL] Sending to ${contactsWithEmail.length} contacts`);
      emailResult = await messagingService.sendEmails(contactsWithEmail, finalEmailSubject, finalEmailMessage);
      console.log(`[EMAIL] Result: ${emailResult.totalSent} sent, ${emailResult.failed.length} failed`);
    } else if (sendEmail && contactsWithEmail.length === 0) {
      console.warn('[EMAIL] No contacts with email addresses — skipping');
    }

    if (sendSms && finalSmsMessage && contactsWithPhone.length > 0) {
      console.log(`[SMS] Sending to ${contactsWithPhone.length} contacts`);
      smsResult = await messagingService.sendSmsBatch(contactsWithPhone, finalSmsMessage);
      console.log(`[SMS] Result: ${smsResult.totalSent} sent, ${smsResult.failed.length} failed`);
    } else if (sendSms && contactsWithPhone.length === 0) {
      console.warn('[SMS] No contacts with phone numbers — skipping');
    }

    if (sendWhatsapp && finalWhatsappMessage) {
      await messagingService.sendWhatsApp(contacts, finalWhatsappMessage);
    }

    // Determine campaign status based on actual results
    const allResults = [emailResult, smsResult].filter(Boolean);
    let campaignStatus = 'SENT';
    if (allResults.length > 0) {
      const anyFailed = allResults.some(r => r!.failed.length > 0);
      const allFailed = everyResultFailed(allResults);
      if (allFailed) campaignStatus = 'FAILED';
      else if (anyFailed) campaignStatus = 'PARTIAL';
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: name || 'Untitled Campaign',
        message: finalEmailMessage || finalSmsMessage || finalWhatsappMessage,
        emailSubject: finalEmailSubject,
        emailMessage: finalEmailMessage || null,
        smsMessage: finalSmsMessage || null,
        whatsappMessage: finalWhatsappMessage || null,
        channels: channels || [],
        status: campaignStatus,
        recipients: contacts.length,
        cost: cost || 0,
        contacts: contacts as any,
        authorId: req.user.id,
      }
    });

    res.status(200).json({
      success: true,
      campaign,
      results: {
        email: emailResult,
        sms: smsResult ? { totalSent: smsResult.totalSent, failed: smsResult.failed, parts: smsResult.parts } : null,
      },
    });
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

export const getCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = String(req.params.id);
    const campaign = await prisma.campaign.findFirst({
      where: { id, authorId: req.user.id }
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resendCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = String(req.params.id);
    const original = await prisma.campaign.findFirst({
      where: { id, authorId: req.user.id }
    });

    if (!original) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const contacts = (original.contacts as any[]) || [];
    if (contacts.length === 0) {
      res.status(400).json({ error: 'No contacts saved for this campaign. Cannot resend.' });
      return;
    }

    const { emailSubject, emailMessage, smsMessage, whatsappMessage, channels, cost } = req.body;

    const finalEmailMessage = emailMessage || original.emailMessage || '';
    const finalEmailSubject = emailSubject || original.emailSubject || original.name;
    const finalSmsMessage = smsMessage || original.smsMessage || '';
    const finalWhatsappMessage = whatsappMessage || original.whatsappMessage || '';
    const finalChannels = channels || original.channels;

    if (!finalEmailMessage && !finalSmsMessage && !finalWhatsappMessage) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const contactsWithEmail = contacts.filter((c: any) => c.email && c.email.trim());
    const contactsWithPhone = contacts.filter((c: any) => c.phone && c.phone.trim());

    let emailResult: SendResult | null = null;
    let smsResult: (SendResult & { parts?: number }) | null = null;

    if (finalChannels.includes('EMAIL') && finalEmailMessage && contactsWithEmail.length > 0) {
      console.log(`[EMAIL] Resending to ${contactsWithEmail.length} contacts`);
      emailResult = await messagingService.sendEmails(contactsWithEmail, finalEmailSubject, finalEmailMessage);
    }

    if (finalChannels.includes('SMS') && finalSmsMessage && contactsWithPhone.length > 0) {
      console.log(`[SMS] Resending to ${contactsWithPhone.length} contacts`);
      smsResult = await messagingService.sendSmsBatch(contactsWithPhone, finalSmsMessage);
    }

    if (finalChannels.includes('WHATSAPP') && finalWhatsappMessage) {
      await messagingService.sendWhatsApp(contacts, finalWhatsappMessage);
    }

    // Determine campaign status based on actual results
    const allResults = [emailResult, smsResult].filter(Boolean);
    let campaignStatus = 'SENT';
    if (allResults.length > 0) {
      const anyFailed = allResults.some(r => r!.failed.length > 0);
      const allFailed = everyResultFailed(allResults);
      if (allFailed) campaignStatus = 'FAILED';
      else if (anyFailed) campaignStatus = 'PARTIAL';
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: `${original.name} (resend)`,
        message: finalEmailMessage || finalSmsMessage || finalWhatsappMessage,
        emailSubject: finalEmailSubject,
        emailMessage: finalEmailMessage || null,
        smsMessage: finalSmsMessage || null,
        whatsappMessage: finalWhatsappMessage || null,
        channels: finalChannels,
        status: campaignStatus,
        recipients: contacts.length,
        cost: cost || original.cost || 0,
        contacts: contacts as any,
        authorId: req.user.id,
      }
    });

    res.status(200).json({
      success: true,
      campaign,
      results: {
        email: emailResult,
        sms: smsResult ? { totalSent: smsResult.totalSent, failed: smsResult.failed, parts: smsResult.parts } : null,
      },
    });
  } catch (error) {
    console.error('Failed to resend campaign:', error);
    res.status(500).json({ error: 'Internal server error while resending campaign' });
  }
};

export const updateCampaignContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = String(req.params.id);
    const { contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      res.status(400).json({ error: 'Contacts must be an array' });
      return;
    }

    const campaign = await prisma.campaign.findFirst({
      where: { id, authorId: req.user.id }
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        contacts: contacts as any,
        recipients: contacts.length,
      }
    });

    res.status(200).json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Failed to update campaign contacts:', error);
    res.status(500).json({ error: 'Internal server error while updating contacts' });
  }
};
