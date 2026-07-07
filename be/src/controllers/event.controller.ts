import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !date) {
      res.status(400).json({ error: 'Title and date are required' });
      return;
    }
    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), location },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: { _count: { select: { registrations: true } } },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    const registration = await prisma.eventRegistration.create({
      data: { name, email, eventId },
    });
    res.status(201).json(registration);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Already registered for this event' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
