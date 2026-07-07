import { Router } from 'express';
import { apiKeyAuth } from '../middlewares/apiKey.middleware';
import { getPosts } from '../controllers/post.controller';
import { prisma } from '../config/db';

const router = Router();

// All routes below require a valid x-api-key header
router.use(apiKeyAuth);

/**
 * GET /api/n8n/posts
 * Returns all posts with author info — safe for n8n to consume
 */
router.get('/posts', getPosts);

/**
 * GET /api/n8n/stats
 * Returns aggregated platform statistics for n8n dashboards / alerts
 */
router.get('/stats', async (_req, res) => {
  try {
    const [totalPosts, totalUsers] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
    ]);

    const postsByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true },
    });

    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });

    res.json({
      totalPosts,
      totalUsers,
      usersByRole: postsByRole.map(r => ({ role: r.role, count: r._count._all })),
      recentPosts,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/n8n/users
 * Returns all users (passwords excluded) for n8n user-management automations
 */
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
