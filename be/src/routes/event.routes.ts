import { Router } from 'express';
import { createEvent, getEvents, registerForEvent } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getEvents);
router.post('/', authenticate, createEvent);
router.post('/:eventId/register', registerForEvent);

export default router;
