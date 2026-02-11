export interface Address {
  companyName: string;
  contactPerson?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  gstin: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  igstPercent: number;
  cess: number;
}

export interface InvoiceData {
  receiptNumber: string;
  receiptDate: string;
  seller: Address;
  buyer: Address;
  placeOfSupply: string;
  items: LineItem[];
  notes: string;
  terms: string;
}

export const createEmptyLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  hsnSac: '',
  quantity: 1,
  rate: 0,
  igstPercent: 18,
  cess: 0,
});

export const getLineItemAmount = (item: LineItem): number =>
  item.quantity * item.rate;

export const getLineItemIGST = (item: LineItem): number =>
  (getLineItemAmount(item) * item.igstPercent) / 100;

export const getSubTotal = (items: LineItem[]): number =>
  items.reduce((sum, item) => sum + getLineItemAmount(item), 0);

export const getTotalIGST = (items: LineItem[]): number =>
  items.reduce((sum, item) => sum + getLineItemIGST(item), 0);

export const getGrandTotal = (items: LineItem[]): number =>
  getSubTotal(items) + getTotalIGST(items);

export const formatCurrency = (value: number): string =>
  `Rs.${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const defaultInvoiceData: InvoiceData = {
  receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
  receiptDate: new Date().toISOString().split('T')[0],
  seller: {
    companyName: '',
    contactPerson: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    gstin: '',
  },
  buyer: {
    companyName: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    gstin: '',
  },
  placeOfSupply: '',
  items: [createEmptyLineItem()],
  notes: '',
  terms: '',
};
