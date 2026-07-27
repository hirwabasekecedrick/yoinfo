import { Router } from 'express';
import { sendBulkMessage, getCampaigns, getCampaign, resendCampaign, updateCampaignContacts } from '../controllers/messaging.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/send', sendBulkMessage);
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaign);
router.put('/campaigns/:id/contacts', updateCampaignContacts);
router.post('/campaigns/:id/resend', resendCampaign);

export default router;
