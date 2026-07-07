import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { label: 'asc' } });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
