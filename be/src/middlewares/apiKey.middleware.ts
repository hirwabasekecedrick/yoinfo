import { Request, Response, NextFunction } from 'express';

const N8N_API_KEY = process.env.N8N_API_KEY || 'default-secret-n8n-key-change-me';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== N8N_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }

  next();
};
