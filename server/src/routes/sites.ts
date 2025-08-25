
import { Router } from 'express';
import { prisma } from '../prisma.js';

const r = Router();

r.get('/', async (req, res) => {
  const clientId = req.query.clientId as string | undefined;
  const where = clientId ? { clientId } : {};
  const data = await prisma.site.findMany({ where, orderBy: { name: 'asc' } });
  res.json(data);
});

r.post('/', async (req, res) => {
  const data = await prisma.site.create({ data: req.body });
  res.json(data);
});

export default r;
