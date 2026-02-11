import { LineItem, getLineItemAmount, getLineItemIGST, formatCurrency } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface LineItemsTableProps {
  items: LineItem[];
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function LineItemsTable({ items, onUpdate, onAdd, onRemove }: LineItemsTableProps) {
  return (
    <div className="space-y-3">
      <h3 className="invoice-section-title">Line Items</h3>
      <div className="overflow-x-auto rounded-lg border border-invoice-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-invoice-table-header text-invoice-total-fg">
              <th className="px-3 py-2.5 text-left font-medium">#</th>
              <th className="px-3 py-2.5 text-left font-medium min-w-[180px]">Item Description</th>
              <th className="px-3 py-2.5 text-left font-medium">HSN/SAC</th>
              <th className="px-3 py-2.5 text-right font-medium w-20">Qty</th>
              <th className="px-3 py-2.5 text-right font-medium w-24">Rate</th>
              <th className="px-3 py-2.5 text-right font-medium w-20">IGST %</th>
              <th className="px-3 py-2.5 text-right font-medium">IGST</th>
              <th className="px-3 py-2.5 text-right font-medium w-20">Cess</th>
              <th className="px-3 py-2.5 text-right font-medium">Amount</th>
              <th className="px-3 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? 'bg-invoice-table-stripe' : 'bg-card'}>
                <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                <td className="px-1 py-1">
                  <Input
                    value={item.description}
                    onChange={e => onUpdate(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="border-0 bg-transparent shadow-none h-8 text-sm"
                  />
                </td>
                <td className="px-1 py-1">
                  <Input
                    value={item.hsnSac}
                    onChange={e => onUpdate(item.id, 'hsnSac', e.target.value)}
                    placeholder="HSN/SAC"
                    className="border-0 bg-transparent shadow-none h-8 text-sm w-24"
                  />
                </td>
                <td className="px-1 py-1">
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={e => onUpdate(item.id, 'quantity', Number(e.target.value))}
                    className="border-0 bg-transparent shadow-none h-8 text-sm text-right w-16"
                    min={0}
                  />
                </td>
                <td className="px-1 py-1">
                  <Input
                    type="number"
                    value={item.rate || ''}
                    onChange={e => onUpdate(item.id, 'rate', Number(e.target.value))}
                    className="border-0 bg-transparent shadow-none h-8 text-sm text-right w-24"
                    min={0}
                  />
                </td>
                <td className="px-1 py-1">
                  <Input
                    type="number"
                    value={item.igstPercent || ''}
                    onChange={e => onUpdate(item.id, 'igstPercent', Number(e.target.value))}
                    className="border-0 bg-transparent shadow-none h-8 text-sm text-right w-16"
                    min={0}
                    max={100}
                  />
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                  {getLineItemIGST(item).toFixed(2)}
                </td>
                <td className="px-1 py-1">
                  <Input
                    type="number"
                    value={item.cess || ''}
                    onChange={e => onUpdate(item.id, 'cess', Number(e.target.value))}
                    className="border-0 bg-transparent shadow-none h-8 text-sm text-right w-16"
                    min={0}
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {getLineItemAmount(item).toFixed(2)}
                </td>
                <td className="px-1 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5">
        <Plus className="h-3.5 w-3.5" /> Add Line Item
      </Button>
    </div>
  );
}
