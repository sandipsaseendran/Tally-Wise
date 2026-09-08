import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { useStore } from '../../../store/useStore';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import { generateId } from '../../utils/helpers';
import { format, addDays } from 'date-fns';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../forms/AddContractModal';
import toast from 'react-hot-toast';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editInvoice?: Invoice | null;
}

export function CreateInvoiceModal({ isOpen, onClose, editInvoice }: CreateInvoiceModalProps) {
  const addInvoice = useStore((state) => state.addInvoice);
  const updateInvoice = useStore((state) => state.updateInvoice);
  const settings = useStore((state) => state.settings);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [currency, setCurrency] = useState(settings.currency || '$');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('pending');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Initialize or reset form
  useEffect(() => {
    if (!isOpen) return;

    if (editInvoice) {
      setInvoiceNumber(editInvoice.invoiceNumber);
      setClientName(editInvoice.clientName);
      setClientEmail(editInvoice.clientEmail || '');
      setCurrency(editInvoice.currency || settings.currency || '$');
      setIssueDate(editInvoice.issueDate);
      setDueDate(editInvoice.dueDate);
      setStatus(editInvoice.status);
      setItems(editInvoice.items?.length ? editInvoice.items : [
        { id: generateId(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
      ]);
      setTaxRate(editInvoice.taxRate ?? 0);
      setDiscount(editInvoice.discount ?? 0);
      setNotes(editInvoice.notes || '');
    } else {
      const today = new Date();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setInvoiceNumber(`INV-${format(today, 'yyyy')}-${randNum}`);
      setClientName('');
      setClientEmail('');
      setCurrency(settings.currency || '$');
      setIssueDate(format(today, 'yyyy-MM-dd'));
      setDueDate(format(addDays(today, 14), 'yyyy-MM-dd'));
      setStatus('pending');
      setItems([
        { id: generateId(), description: 'Consulting & Design Services', quantity: 1, unitPrice: 500, amount: 500 }
      ]);
      setTaxRate(0);
      setDiscount(0);
      setNotes('Payment due within 14 days. Thank you for your business!');
    }
  }, [isOpen, editInvoice, settings.currency]);

  // Line item handlers
  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: val };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(val) : current.quantity;
      const p = field === 'unitPrice' ? Number(val) : current.unitPrice;
      current.amount = Math.max(0, (q || 0) * (p || 0));
    }
    
    updated[index] = current;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: generateId(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.error('Invoice must contain at least one item');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error('Please enter the client name');
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      toast.error('Please provide a description for all line items');
      return;
    }

    const payload: Invoice = {
      id: editInvoice ? editInvoice.id : generateId(),
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-6)}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      amount: grandTotal,
      total: grandTotal,
      currency,
      status,
      issueDate,
      dueDate,
      items,
      taxRate: Number(taxRate) || 0,
      discount: Number(discount) || 0,
      notes: notes.trim(),
      createdAt: editInvoice?.createdAt || new Date().toISOString(),
    };

    if (editInvoice) {
      updateInvoice(editInvoice.id, payload);
      toast.success('Invoice updated successfully');
    } else {
      addInvoice(payload);
      toast.success('Invoice created successfully');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editInvoice ? 'Edit Invoice' : 'Create New Invoice'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-mono text-sm font-semibold transition-colors"
              placeholder="e.g. INV-2026-001"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className="w-full px-4 py-2.5 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors appearance-none cursor-pointer"
            >
              <option value="pending" className="dark:bg-tally-surface-dark">Pending / Unpaid</option>
              <option value="paid" className="dark:bg-tally-surface-dark">Paid</option>
              <option value="draft" className="dark:bg-tally-surface-dark">Draft</option>
              <option value="overdue" className="dark:bg-tally-surface-dark">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Currency
            </label>
            <div className="relative flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors appearance-none cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.symbol} className="dark:bg-tally-surface-dark">
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-tally-text-secondary absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-tally-border-light dark:border-tally-border-dark flex flex-col gap-4">
          <span className="text-xs font-bold text-tally-text-primary dark:text-white uppercase tracking-wider">
            Client Details
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">
                Client / Company Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-medium text-sm transition-colors"
                placeholder="e.g. Acme Studio Inc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">
                Client Email Address
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-medium text-sm transition-colors"
                placeholder="billing@client.com"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Issue Date
            </label>
            <input
              type="date"
              required
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold text-sm transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Line Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Line Items
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1.5 text-xs font-bold text-tally-primary hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-12 gap-2.5 items-center p-3 rounded-2xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-tally-border-light/60 dark:border-tally-border-dark/60"
              >
                {/* Description */}
                <div className="col-span-12 sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Description / Service"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-xs font-medium text-tally-text-primary dark:text-white"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-xs font-medium text-tally-text-primary dark:text-white text-center"
                    title="Quantity"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-xs font-medium text-tally-text-primary dark:text-white text-right"
                    title="Unit Price"
                  />
                </div>

                {/* Item Total */}
                <div className="col-span-3 sm:col-span-2 text-right font-semibold text-xs text-tally-text-primary dark:text-white truncate">
                  {currency}{(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-tally-text-secondary hover:text-red-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taxes, Discounts & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1">
                  Discount ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1">
                Notes & Payment Instructions
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-xs text-tally-text-primary dark:text-white resize-none"
                placeholder="Bank transfer details, wiring instructions, or payment terms..."
              />
            </div>
          </div>

          {/* Totals card */}
          <div className="p-4 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark flex flex-col justify-between">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                <span>Subtotal</span>
                <span className="font-semibold text-tally-text-primary dark:text-white">
                  {currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  <span>Tax ({taxRate}%)</span>
                  <span className="font-semibold text-tally-text-primary dark:text-white">
                    +{currency}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-500">
                    -{currency}{Number(discount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-tally-border-light dark:border-tally-border-dark flex justify-between items-baseline mt-4">
              <span className="text-sm font-bold text-tally-text-primary dark:text-white uppercase tracking-wider">
                Total Due
              </span>
              <span className="text-2xl font-display font-extrabold text-tally-primary">
                {currency}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-tally-border-light dark:border-tally-border-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-tally-text-secondary hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary text-xs font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            {editInvoice ? 'Save Changes' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
