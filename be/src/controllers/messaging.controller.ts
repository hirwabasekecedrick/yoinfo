import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { messagingService } from '../services/messaging.service';

export const sendBulkMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, message, contacts, channels, cost } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      res.status(400).json({ error: 'Contacts list is required and cannot be empty' });
      return;
    }

    if (!message) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    // Process messaging through the service
    let sendSms = channels.includes('SMS');
    let sendEmail = channels.includes('EMAIL');
    let sendWhatsapp = channels.includes('WHATSAPP');

    if (sendEmail) {
      await messagingService.sendEmails(contacts, name || 'Bulk Message', message);
    }
    
    if (sendSms || sendWhatsapp) {
      await messagingService.sendSmsBatch(contacts, message);
    }

    // Log the campaign to the database
    const campaign = await prisma.campaign.create({
      data: {
        name: name || 'Untitled Campaign',
        message,
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
