
import { Router } from 'express';
import { prisma } from '../prisma.js';

const r = Router();

r.get('/', async (_req, res) => {
  const data = await prisma.part.findMany({ orderBy: { partNo: 'asc' } });
  res.json(data);
});

r.get('/:id/prices', async (req, res) => {
  const { id } = req.params;
  const prices = await prisma.partSupplierPrice.findMany({
    where: { partId: id },
    include: { supplier: true },
    orderBy: [{ priceEx: 'asc' }]
  });
  res.json(prices);
});

r.post('/', async (req, res) => {
  const data = await prisma.part.create({ data: req.body });
  res.json(data);
});

export default r;
