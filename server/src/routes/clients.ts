
import { Router } from 'express';
import { prisma } from '../prisma.js';

const r = Router();

r.get('/', async (_req, res) => {
  const data = await prisma.client.findMany({ orderBy: { name: 'asc' } });
  res.json(data);
});

r.post('/', async (req, res) => {
  const data = await prisma.client.create({ data: req.body });
  res.json(data);
});

export default r;
