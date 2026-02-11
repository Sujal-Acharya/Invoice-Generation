import { useState } from 'react';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { AddressSection } from '@/components/AddressSection';
import { LineItemsTable } from '@/components/LineItemsTable';
import { InvoicePreview } from '@/components/InvoicePreview';
import { generateInvoicePDF } from '@/lib/generatePdf';
import {
  getSubTotal,
  getTotalIGST,
  getGrandTotal,
  formatCurrency,
} from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Eye,
  RotateCcw,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

export function InvoiceForm() {
  const {
    data,
    updateField,
    updateSeller,
    updateBuyer,
    updateLineItem,
    addLineItem,
    removeLineItem,
    clearForm,
  } = useInvoiceForm();

  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const validate = (): boolean => {
    if (!data.seller.companyName || !data.buyer.companyName) {
      toast({ title: 'Validation Error', description: 'Company names are required.', variant: 'destructive' });
      return false;
    }
    if (!data.seller.gstin || !data.buyer.gstin) {
      toast({ title: 'Validation Error', description: 'GSTIN is required for both seller and buyer.', variant: 'destructive' });
      return false;
    }
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinPattern.test(data.seller.gstin) || !gstinPattern.test(data.buyer.gstin)) {
      toast({ title: 'Validation Error', description: 'Invalid GSTIN format.', variant: 'destructive' });
      return false;
    }
    if (data.items.some(item => !item.description || item.rate <= 0)) {
      toast({ title: 'Validation Error', description: 'All items need a description and rate > 0.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 500)); // brief delay for UX
      generateInvoicePDF(data);
      toast({ title: 'Invoice Generated', description: 'Your PDF has been downloaded.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = () => {
    clearForm();
    toast({ title: 'Form Cleared', description: 'All fields have been reset.' });
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back to Form
            </Button>
            <div className="flex-1" />
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>
          <InvoicePreview data={data} />
        </div>
      </div>
    );
  }

  const subTotal = getSubTotal(data.items);
  const totalIGST = getTotalIGST(data.items);
  const grandTotal = getGrandTotal(data.items);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground leading-tight">Invoice Generator</h1>
              <p className="text-xs text-muted-foreground">Create professional invoices</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClear} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
            <Button size="sm" onClick={handleGenerate} disabled={generating} className="gap-1.5">
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Generate PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Receipt Details */}
        <section className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="invoice-section-title">Receipt Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Receipt Number</Label>
              <Input
                value={data.receiptNumber}
                onChange={e => updateField('receiptNumber', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Receipt Date *</Label>
              <Input
                type="date"
                value={data.receiptDate}
                onChange={e => updateField('receiptDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Place of Supply *</Label>
              <Input
                value={data.placeOfSupply}
                onChange={e => updateField('placeOfSupply', e.target.value)}
                placeholder="e.g. Maharashtra"
                className="mt-1"
              />
            </div>
          </div>
        </section>

        {/* Seller & Buyer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-card rounded-xl border border-border p-5">
            <AddressSection title="Seller Details" data={data.seller} onChange={updateSeller} showContactPerson />
          </section>
          <section className="bg-card rounded-xl border border-border p-5">
            <AddressSection title="Bill To (Buyer)" data={data.buyer} onChange={updateBuyer} />
          </section>
        </div>

        {/* Line Items */}
        <section className="bg-card rounded-xl border border-border p-5">
          <LineItemsTable
            items={data.items}
            onUpdate={updateLineItem}
            onAdd={addLineItem}
            onRemove={removeLineItem}
          />
        </section>

        {/* Summary */}
        <section className="bg-card rounded-xl border border-border p-5">
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Total</span>
                <span className="tabular-nums font-medium">{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IGST (18%)</span>
                <span className="tabular-nums">{totalIGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-lg font-bold">
                <span>TOTAL</span>
                <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-card rounded-xl border border-border p-5">
            <h3 className="invoice-section-title">Notes</h3>
            <Textarea
              value={data.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </section>
          <section className="bg-card rounded-xl border border-border p-5">
            <h3 className="invoice-section-title">Terms & Conditions</h3>
            <Textarea
              value={data.terms}
              onChange={e => updateField('terms', e.target.value)}
              placeholder="Terms and conditions..."
              rows={3}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
