
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const c1 = await prisma.client.create({
    data: {
      name: 'Pilbara Alumina Pty Ltd',
      abn: '12 345 678 901',
      billingEmail: 'ap@pilbaraalumina.com.au',
      billingAddress: 'Level 3, 120 St Georges Tce, Perth WA 6000',
      phone: '+61 8 6000 0001',
      notes: 'Requires SWMS attachment with all quotes.',
      sites: {
        create: [{
          name: 'Kwinana Refinery',
          address: 'Mason Rd, Kwinana WA 6167',
          region: 'WA'
        }]
      }
    }
  });
  const site = await prisma.site.findFirst({ where: { clientId: c1.id }});
  const supp1 = await prisma.supplier.create({ data: { name: 'WA Bearings', preferred: true, vendorScore: 85, email: 'sales@wabearings.com.au' }});
  const supp2 = await prisma.supplier.create({ data: { name: 'Seals Direct', vendorScore: 72, email: 'orders@sealsdirect.com.au' }});

  const p1 = await prisma.part.create({ data: { partNo: 'SKF-6205-2RS', description: 'Deep groove ball bearing 6205-2RS', uom: 'EA', category: 'Bearings', specs: { bore_mm: 25, od_mm: 52, width_mm: 15 } }});
  const p2 = await prisma.part.create({ data: { partNo: 'SEAL-40x62x7-NBR', description: 'NBR rotary shaft seal 40x62x7', uom: 'EA', category: 'Seals', specs: { material: 'NBR', size_mm: '40x62x7' } }});

  await prisma.partSupplierPrice.createMany({
    data: [
      { partId: p1.id, supplierId: supp1.id, priceEx: 9.80, currency: 'AUD', leadDays: 2, minOrderQty: 1, breakQty: 10, breakPriceEx: 9.20 },
      { partId: p2.id, supplierId: supp2.id, priceEx: 6.50, currency: 'AUD', leadDays: 5, minOrderQty: 2 }
    ]
  });

  if (site) {
    await prisma.asset.create({
      data: {
        clientId: c1.id,
        siteId: site.id,
        assetTag: 'RV-21',
        name: 'Rotary Valve',
        assetType: 'Rotary Valve',
        oem: 'FLSmidth',
        model: 'RVA-200',
        serial: 'RV21-2020-0456',
        criticality: 4,
        duty: 'Dust discharge',
        location: 'Precipitator discharge'
      }
    });
  }

  console.log('Seed complete');
}

main().finally(async () => await prisma.$disconnect());
