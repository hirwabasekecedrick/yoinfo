import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { dispatchWebhookEvent } from '../services/webhook.service';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, imageUrl, tags, links, eventId } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title: title || null,
        content,
        imageUrl: imageUrl || null,
        authorId: req.user.id,
        eventId: eventId || null,
        tags: tags?.length
          ? { create: tags.map((tagId: string) => ({ tagId })) }
          : undefined,
        links: links?.length
          ? { create: links.map((link: { url: string; title?: string }) => ({ url: link.url, title: link.title || null })) }
          : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        tags: { include: { tag: true } },
        links: true,
        event: true,
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
        tags: { include: { tag: true } },
        links: true,
        event: { include: { _count: { select: { registrations: true } } } },
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
