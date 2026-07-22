import { Router } from 'express';
import { createBusiness, getBusinesses, getBusiness, updateBusiness, deleteBusiness } from '../controllers/business.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getBusinesses);
router.get('/:id', getBusiness);
router.post('/', authenticate, createBusiness);
router.put('/:id', authenticate, updateBusiness);
router.delete('/:id', authenticate, deleteBusiness);

export default router;
