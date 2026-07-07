import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
