import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  InvoiceData,
  getLineItemAmount,
  getLineItemIGST,
  getSubTotal,
  getTotalIGST,
  getGrandTotal,
  formatCurrency,
} from '@/types/invoice';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export function generateInvoicePDF(data: InvoiceData): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Header - Company Name left, RECEIPT right
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.seller.companyName || 'Company Name', margin, y);

  doc.setFontSize(20);
  doc.setTextColor(41, 98, 168);
  doc.text('RECEIPT', pageWidth - margin, y, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  // Receipt number
  y += 6;
  doc.text(data.receiptNumber, pageWidth - margin, y, { align: 'right' });

  // Seller details
  y = 30;
  if (data.seller.contactPerson) {
    doc.text(data.seller.contactPerson, margin, y);
    y += 4.5;
  }
  doc.text(data.seller.address, margin, y);
  y += 4.5;
  doc.text(data.seller.city, margin, y);
  y += 4.5;
  doc.text(data.seller.state, margin, y);
  y += 4.5;
  doc.text(data.seller.country, margin, y);
  y += 4.5;
  if (data.seller.gstin) {
    doc.text(`GSTIN ${data.seller.gstin}`, margin, y);
    y += 4.5;
  }

  // Bill To
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Bill To:', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(data.buyer.companyName, margin, y);
  y += 4.5;
  doc.text(data.buyer.address, margin, y);
  y += 4.5;
  doc.text(data.buyer.city, margin, y);
  y += 4.5;
  doc.text(data.buyer.state, margin, y);
  y += 4.5;
  doc.text(data.buyer.country, margin, y);
  y += 4.5;
  if (data.buyer.gstin) {
    doc.text(`GSTIN ${data.buyer.gstin}`, margin, y);
    y += 4.5;
  }

  // Receipt date & Place of supply
  y += 4;
  doc.text(`Receipt Date: ${data.receiptDate}`, margin, y);
  y += 4.5;
  doc.text(`Place of Supply: ${data.placeOfSupply}`, margin, y);
  y += 8;

  // Items table
  const tableBody = data.items.map((item, i) => [
    i + 1,
    item.description,
    item.hsnSac,
    item.quantity,
    item.rate.toFixed(0),
    getLineItemIGST(item).toFixed(2),
    item.cess.toFixed(2),
    getLineItemAmount(item).toFixed(2),
  ]);

  doc.autoTable({
    startY: y,
    head: [['#', 'Item Description', 'HSN/SAC', 'Qty', 'Rate', 'IGST', 'Cess', 'Amount']],
    body: tableBody,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [40, 55, 71],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    theme: 'grid',
  });

  y = doc.lastAutoTable.finalY + 8;

  // Totals
  const subTotal = getSubTotal(data.items);
  const totalIGST = getTotalIGST(data.items);
  const grandTotal = getGrandTotal(data.items);

  const totalsX = pageWidth - margin - 60;
  const valuesX = pageWidth - margin;

  doc.setFontSize(9);
  doc.text('Sub Total', totalsX, y);
  doc.text(subTotal.toFixed(2), valuesX, y, { align: 'right' });
  y += 5;

  doc.text('IGST (18%)', totalsX, y);
  doc.text(totalIGST.toFixed(2), valuesX, y, { align: 'right' });
  y += 5;

  doc.setLineWidth(0.3);
  doc.line(totalsX, y - 1, valuesX, y - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL', totalsX, y + 2);
  doc.text(formatCurrency(grandTotal), valuesX, y + 2, { align: 'right' });
  y += 12;

  // Notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(data.notes, margin, y, { maxWidth: pageWidth - margin * 2 });
    y += 10;
  }

  if (data.terms) {
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(data.terms, margin, y, { maxWidth: pageWidth - margin * 2 });
  }

  doc.save(`${data.receiptNumber}.pdf`);
}
