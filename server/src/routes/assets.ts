
import { Router } from 'express';
import { prisma } from '../prisma.js';

const r = Router();

r.get('/', async (req, res) => {
  const clientId = req.query.clientId as string | undefined;
  const siteId = req.query.siteId as string | undefined;
  const where:any = {};
  if (clientId) where.clientId = clientId;
  if (siteId) where.siteId = siteId;
  const data = await prisma.asset.findMany({ where, orderBy: { assetTag: 'asc' } });
  res.json(data);
});

r.post('/', async (req, res) => {
  const data = await prisma.asset.create({ data: req.body });
  res.json(data);
});

export default r;
