import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createInvestment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, category, summary, description, minInvestment, maxInvestment, location, status, roi, imageUrl, featured } = req.body;

    if (!title || !category || !summary || minInvestment == null || maxInvestment == null || !location || !roi) {
      res.status(400).json({ error: 'Missing required fields: title, category, summary, minInvestment, maxInvestment, location, roi' });
      return;
    }

    const investment = await prisma.investment.create({
      data: {
        title,
        category,
        summary,
        description: description || null,
        minInvestment: Number(minInvestment),
        maxInvestment: Number(maxInvestment),
        location,
        status: status || 'Open',
        roi,
        imageUrl: imageUrl || null,
        featured: featured || false,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      ...investment,
      imageUrl: investment.imageUrl ? `${baseUrl}${investment.imageUrl}` : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvestments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, search, minBudget, maxBudget } = req.query;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = category as string;
    }
    if (status && status !== 'All') {
      where.status = status as string;
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (minBudget) {
      where.maxInvestment = { gte: Number(minBudget) };
    }
    if (maxBudget) {
      where.minInvestment = { lte: Number(maxBudget) };
    }

    const investments = await prisma.investment.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = investments.map(inv => ({
      ...inv,
      imageUrl: inv.imageUrl ? `${baseUrl}${inv.imageUrl}` : null,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      ...investment,
      imageUrl: investment.imageUrl ? `${baseUrl}${investment.imageUrl}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInvestment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const existing = await prisma.investment.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { title, category, summary, description, minInvestment, maxInvestment, location, status, roi, imageUrl, featured } = req.body;

    const investment = await prisma.investment.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(summary !== undefined && { summary }),
        ...(description !== undefined && { description }),
        ...(minInvestment !== undefined && { minInvestment: Number(minInvestment) }),
        ...(maxInvestment !== undefined && { maxInvestment: Number(maxInvestment) }),
        ...(location !== undefined && { location }),
        ...(status !== undefined && { status }),
        ...(roi !== undefined && { roi }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(featured !== undefined && { featured }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      ...investment,
      imageUrl: investment.imageUrl ? `${baseUrl}${investment.imageUrl}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInvestment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const existing = await prisma.investment.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.investment.delete({ where: { id } });
    res.json({ message: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
