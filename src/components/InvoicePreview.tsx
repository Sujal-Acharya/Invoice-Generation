import {
  InvoiceData,
  getLineItemAmount,
  getLineItemIGST,
  getSubTotal,
  getTotalIGST,
  getGrandTotal,
  formatCurrency,
} from '@/types/invoice';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const subTotal = getSubTotal(data.items);
  const totalIGST = getTotalIGST(data.items);
  const grandTotal = getGrandTotal(data.items);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 max-w-2xl mx-auto text-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">{data.seller.companyName || 'Seller Company'}</h2>
          {data.seller.contactPerson && (
            <p className="text-muted-foreground">{data.seller.contactPerson}</p>
          )}
          <p className="text-muted-foreground">{data.seller.address}</p>
          <p className="text-muted-foreground">
            {[data.seller.city, data.seller.state, data.seller.country].filter(Boolean).join(', ')}
          </p>
          {data.seller.gstin && (
            <p className="text-muted-foreground mt-1">GSTIN {data.seller.gstin}</p>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-display font-bold text-invoice-header tracking-wide">RECEIPT</h1>
          <p className="text-muted-foreground mt-1">{data.receiptNumber}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-4">
        <p className="font-semibold text-foreground mb-1">Bill To:</p>
        <p className="font-medium">{data.buyer.companyName || 'Buyer Company'}</p>
        <p className="text-muted-foreground">{data.buyer.address}</p>
        <p className="text-muted-foreground">
          {[data.buyer.city, data.buyer.state, data.buyer.country].filter(Boolean).join(', ')}
        </p>
        {data.buyer.gstin && (
          <p className="text-muted-foreground">GSTIN {data.buyer.gstin}</p>
        )}
      </div>

      <div className="flex gap-8 mb-4 text-muted-foreground">
        <p>Receipt Date: <span className="text-foreground">{data.receiptDate || '—'}</span></p>
        <p>Place of Supply: <span className="text-foreground">{data.placeOfSupply || '—'}</span></p>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-lg border border-invoice-border mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-invoice-table-header text-invoice-total-fg">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Item Description</th>
              <th className="px-3 py-2 text-left font-medium">HSN/SAC</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="px-3 py-2 text-right font-medium">Rate</th>
              <th className="px-3 py-2 text-right font-medium">IGST</th>
              <th className="px-3 py-2 text-right font-medium">Cess</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? 'bg-invoice-table-stripe' : 'bg-card'}>
                <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                <td className="px-3 py-2">{item.description || '—'}</td>
                <td className="px-3 py-2">{item.hsnSac || '—'}</td>
                <td className="px-3 py-2 text-right tabular-nums">{item.quantity}</td>
                <td className="px-3 py-2 text-right tabular-nums">{item.rate.toFixed(0)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{getLineItemIGST(item).toFixed(2)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{item.cess.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">{getLineItemAmount(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Sub Total</span>
            <span className="tabular-nums">{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">IGST (18%)</span>
            <span className="tabular-nums">{totalIGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-border font-bold text-base">
            <span>TOTAL</span>
            <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {data.notes && (
        <div className="mb-3">
          <p className="font-semibold mb-1">Notes</p>
          <p className="text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
        </div>
      )}
      {data.terms && (
        <div>
          <p className="font-semibold mb-1">Terms & Conditions</p>
          <p className="text-muted-foreground whitespace-pre-wrap">{data.terms}</p>
        </div>
      )}
    </div>
  );
}
