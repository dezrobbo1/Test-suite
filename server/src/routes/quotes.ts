
import { Router } from 'express';
import { prisma } from '../prisma.js';
import { generateQuotePdf } from '../pdf/generateQuotePdf.js';

const r = Router();

function totals(qty:number, rate:number){
  return qty * rate;
}

r.get('/', async (req, res) => {
  const status = req.query.status as string | undefined;
  const where = status ? { status } : {};
  const data = await prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(data);
});

r.get('/:id', async (req, res) => {
  const q = await prisma.quote.findUnique({ where: { id: req.params.id }, include: { items: true, client: true, site: true } });
  res.json(q);
});

r.post('/', async (req, res) => {
  const { clientId, siteId, items } = req.body;
  const count = await prisma.quote.count();
  const number = `Q-${(count + 1).toString().padStart(5, '0')}`;

  // compute totals
  let subtotal = 0;
  const itemsData = (items || []).map((it:any, idx:number) => {
    const lineTotal = totals(it.qty, it.unitRateEx);
    subtotal += lineTotal;
    return ({
      lineNo: idx + 1,
      itemType: it.itemType || 'Task',
      description: it.description,
      qty: it.qty,
      unitRateEx: it.unitRateEx,
      partId: it.partId || null,
      supplierId: it.supplierId || null,
      assetId: it.assetId || null,
      isOptional: !!it.isOptional
    });
  });
  const gst = subtotal * 0.10;
  const total = subtotal + gst;

  const q = await prisma.quote.create({
    data: {
      number, clientId, siteId,
      subtotalEx: subtotal, gst, totalInc: total,
      items: { create: itemsData }
    }
  });
  res.json(q);
});

r.post('/:id/pdf', async (req, res) => {
  const quote = await prisma.quote.findUnique({ where: { id: req.params.id }, include: { items: true, client: true, site: true } });
  if (!quote) return res.status(404).json({ error: 'Not found' });

  const items = quote.items.map(it => ({
    lineNo: it.lineNo,
    description: it.description,
    qty: it.qty,
    unitRateEx: Number(it.unitRateEx),
    lineTotal: Number(it.unitRateEx) * it.qty
  }));

  const fp = await generateQuotePdf(
    quote.number,
    quote.client.name,
    quote.site ? quote.site.name : null,
    items,
    Number(quote.subtotalEx),
    Number(quote.gst),
    Number(quote.totalInc)
  );

  res.download(fp, `${quote.number}.pdf`);
});

export default r;
