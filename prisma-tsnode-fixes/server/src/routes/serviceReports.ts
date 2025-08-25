import { Router } from 'express';
import { prisma } from '../prisma.js';

const r = Router();

r.post('/', async (req, res) => {
  const data = await prisma.serviceReport.create({ data: req.body });
  res.json(data);
});

r.post('/:id/signature', async (req, res) => {
  const { id } = req.params;
  const { signedByName, role, method, lat, lon, imageData } = req.body;
  const sig = await prisma.signature.create({
    data: {
      serviceReportId: id,
      signedByName, role, method, lat, lon, imageData
    }
  });
  res.json(sig);
});

export default r;
