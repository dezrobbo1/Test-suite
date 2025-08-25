
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

type QuotePDFItem = {
  lineNo: number;
  description: string;
  qty: number;
  unitRateEx: number;
  lineTotal: number;
};

export async function generateQuotePdf(
  number: string,
  clientName: string,
  siteName: string | null,
  items: QuotePDFItem[],
  subtotalEx: number,
  gst: number,
  totalInc: number
): Promise<string> {
  const outDir = path.join(process.cwd(), 'pdf');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, `${number}.pdf`);

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  doc.fontSize(20).text('Mechanical Services Quote', { align: 'right' });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Quote #: ${number}`);
  doc.text(`Client: ${clientName}`);
  if (siteName) doc.text(`Site: ${siteName}`);
  doc.moveDown();

  // Table header
  doc.fontSize(12).text('No', 40, doc.y, { continued: true });
  doc.text('Description', 70, undefined, { continued: true });
  doc.text('Qty', 350, undefined, { width: 50, align: 'right', continued: true });
  doc.text('Rate (ex)', 410, undefined, { width: 80, align: 'right', continued: true });
  doc.text('Total (ex)', 500, undefined, { width: 80, align: 'right' });
  doc.moveTo(40, doc.y + 5).lineTo(560, doc.y + 5).stroke();
  doc.moveDown(0.5);

  items.forEach(it => {
    doc.text(String(it.lineNo), 40, doc.y, { continued: true });
    doc.text(it.description, 70, undefined, { continued: true });
    doc.text(it.qty.toFixed(2), 350, undefined, { width: 50, align: 'right', continued: true });
    doc.text(it.unitRateEx.toFixed(2), 410, undefined, { width: 80, align: 'right', continued: true });
    doc.text(it.lineTotal.toFixed(2), 500, undefined, { width: 80, align: 'right' });
  });

  doc.moveDown();
  doc.moveTo(380, doc.y + 5).lineTo(560, doc.y + 5).stroke();
  doc.moveDown(0.5);
  doc.text('Subtotal (ex):', 380, doc.y, { width: 120, align: 'right', continued: true });
  doc.text(subtotalEx.toFixed(2), 500, undefined, { width: 80, align: 'right' });
  doc.text('GST 10%:', 380, doc.y + 18, { width: 120, align: 'right', continued: true });
  doc.text(gst.toFixed(2), 500, doc.y + 18, { width: 80, align: 'right' });
  doc.text('Total (inc):', 380, doc.y + 36, { width: 120, align: 'right', continued: true });
  doc.text(totalInc.toFixed(2), 500, doc.y + 36, { width: 80, align: 'right' });

  doc.moveDown(2);
  doc.fontSize(9).text('All amounts in AUD, inclusive of 10% GST on total. ABN and terms to be added.');

  doc.end();

  await new Promise<void>((resolve) => {
    stream.on('finish', () => resolve());
  });

  return outPath;
}
