import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { dispatchWebhookEvent } from '../services/webhook.service';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, imageUrl } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl: imageUrl || null,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    dispatchWebhookEvent('post.created', post).catch(console.error);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = {
      ...post,
      imageUrl: post.imageUrl ? `${baseUrl}${post.imageUrl}` : null,
    };

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = posts.map(p => ({
      ...p,
      imageUrl: p.imageUrl ? `${baseUrl}${p.imageUrl}` : null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
