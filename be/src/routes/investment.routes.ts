import { Router } from 'express';
import { createInvestment, getInvestments, getInvestment, updateInvestment, deleteInvestment } from '../controllers/investment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getInvestments);
router.get('/:id', getInvestment);
router.post('/', authenticate, createInvestment);
router.put('/:id', authenticate, updateInvestment);
router.delete('/:id', authenticate, deleteInvestment);

export default router;
