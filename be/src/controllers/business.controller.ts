import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createBusiness = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      name, tagline, category, description, logo, coverImage,
      phone, email, website, address, city, country,
      registrationNumber, taxId, certifications,
      services, operatingHours, primaryCTA, teamMembers,
    } = req.body;

    if (!name || !category) {
      res.status(400).json({ error: 'Name and category are required' });
      return;
    }

    const business = await prisma.business.create({
      data: {
        name,
        tagline: tagline || null,
        category,
        description: description || null,
        logo: logo || null,
        coverImage: coverImage || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        address: address || null,
        city: city || null,
        country: country || null,
        registrationNumber: registrationNumber || null,
        taxId: taxId || null,
        certifications: certifications || null,
        services: services || [],
        operatingHours: operatingHours || null,
        primaryCTA: primaryCTA || null,
        teamMembers: teamMembers || null,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      ...business,
      logo: business.logo ? `${baseUrl}${business.logo}` : null,
      coverImage: business.coverImage ? `${baseUrl}${business.coverImage}` : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = category as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { city: { contains: search as string, mode: 'insensitive' } },
        { country: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const businesses = await prisma.business.findMany({
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
    const result = businesses.map(b => ({
      ...b,
      logo: b.logo ? `${baseUrl}${b.logo}` : null,
      coverImage: b.coverImage ? `${baseUrl}${b.coverImage}` : null,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!business) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      ...business,
      logo: business.logo ? `${baseUrl}${business.logo}` : null,
      coverImage: business.coverImage ? `${baseUrl}${business.coverImage}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBusiness = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const existing = await prisma.business.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const {
      name, tagline, category, description, logo, coverImage,
      phone, email, website, address, city, country,
      registrationNumber, taxId, certifications,
      services, operatingHours, primaryCTA, teamMembers,
    } = req.body;

    const business = await prisma.business.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(tagline !== undefined && { tagline }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(coverImage !== undefined && { coverImage }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(registrationNumber !== undefined && { registrationNumber }),
        ...(taxId !== undefined && { taxId }),
        ...(certifications !== undefined && { certifications }),
        ...(services !== undefined && { services }),
        ...(operatingHours !== undefined && { operatingHours }),
        ...(primaryCTA !== undefined && { primaryCTA }),
        ...(teamMembers !== undefined && { teamMembers }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      ...business,
      logo: business.logo ? `${baseUrl}${business.logo}` : null,
      coverImage: business.coverImage ? `${baseUrl}${business.coverImage}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBusiness = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;
    const existing = await prisma.business.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.business.delete({ where: { id } });
    res.json({ message: 'Business deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
