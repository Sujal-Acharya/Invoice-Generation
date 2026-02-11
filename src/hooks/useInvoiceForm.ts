import { useState, useEffect, useCallback } from 'react';
import { InvoiceData, defaultInvoiceData, createEmptyLineItem, LineItem } from '@/types/invoice';

const STORAGE_KEY = 'invoice-form-data';

export function useInvoiceForm() {
  const [data, setData] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultInvoiceData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = useCallback(<K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSeller = useCallback((field: string, value: string) => {
    setData(prev => ({ ...prev, seller: { ...prev.seller, [field]: value } }));
  }, []);

  const updateBuyer = useCallback((field: string, value: string) => {
    setData(prev => ({ ...prev, buyer: { ...prev.buyer, [field]: value } }));
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const addLineItem = useCallback(() => {
    setData(prev => ({ ...prev, items: [...prev.items, createEmptyLineItem()] }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter(item => item.id !== id) : prev.items,
    }));
  }, []);

  const clearForm = useCallback(() => {
    setData(defaultInvoiceData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    updateField,
    updateSeller,
    updateBuyer,
    updateLineItem,
    addLineItem,
    removeLineItem,
    clearForm,
  };
}
