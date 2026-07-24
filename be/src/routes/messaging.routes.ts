import { Router } from 'express';
import { sendBulkMessage, getCampaigns } from '../controllers/messaging.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Ensure all messaging routes are protected

router.post('/send', sendBulkMessage);
router.get('/campaigns', getCampaigns);

export default router;
