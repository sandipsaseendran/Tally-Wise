import React from 'react';
import { Modal } from '../shared/Modal';
import { Invoice } from '../../types';
import { useStore } from '../../../store/useStore';
import { Printer, CheckCircle2, Clock, AlertCircle, Edit3, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onEdit: (invoice: Invoice) => void;
}

export function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  onEdit,
}: InvoiceDetailModalProps) {
  const markInvoiceStatus = useStore((state) => state.markInvoiceStatus);
  const currentUser = useStore((state) => state.currentUser);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTogglePaid = () => {
    const nextStatus = invoice.status === 'paid' ? 'pending' : 'paid';
    markInvoiceStatus(invoice.id, nextStatus);
    toast.success(nextStatus === 'paid' ? 'Invoice marked as Paid' : 'Invoice marked as Pending');
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> PAID
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> OVERDUE
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/20">
            <Clock className="w-3.5 h-3.5" /> DRAFT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> PENDING
          </span>
        );
    }
  };

  const subtotal = invoice.items?.reduce((acc, item) => acc + (Number(item.amount) || 0), 0) || 0;
  const taxAmount = (subtotal * (Number(invoice.taxRate) || 0)) / 100;
  const grandTotal = invoice.total ?? invoice.amount ?? Math.max(0, subtotal + taxAmount - (Number(invoice.discount) || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Details"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        {/* Printable Invoice Container */}
        <div
          id="invoice-printable-area"
          className="p-8 rounded-3xl bg-white dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark text-tally-text-primary dark:text-white shadow-sm flex flex-col gap-8 print:p-0 print:border-none print:shadow-none"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-tally-border-light dark:border-tally-border-dark pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-tally-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                  TW
                </div>
                <span className="font-display font-bold text-lg tracking-tight">
                  Tally Wise <span className="text-xs font-normal text-tally-text-secondary dark:text-tally-text-secondaryDark">Billing</span>
                </span>
              </div>
              <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                Issued by: {currentUser?.name || 'Authorized Account'}
              </p>
              {currentUser?.email && (
                <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  {currentUser.email}
                </p>
              )}
            </div>

            <div className="sm:text-right flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-tight">
                  {invoice.invoiceNumber}
                </span>
                {getStatusBadge()}
              </div>
              <div className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark space-y-0.5">
                <div>Issue Date: <strong className="text-tally-text-primary dark:text-white font-medium">{invoice.issueDate}</strong></div>
                <div>Due Date: <strong className="text-tally-text-primary dark:text-white font-medium">{invoice.dueDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Client Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-tally-border-light/60 dark:border-tally-border-dark/60">
            <div>
              <span className="text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <h3 className="font-display font-semibold text-base text-tally-text-primary dark:text-white">
                {invoice.clientName}
              </h3>
              {invoice.clientEmail && (
                <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
                  {invoice.clientEmail}
                </p>
              )}
            </div>
            <div className="sm:text-right flex flex-col justify-center">
              <span className="text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider block mb-1">
                Payment Status
              </span>
              <p className="text-xs font-semibold text-tally-text-primary dark:text-white">
                {invoice.status === 'paid' ? 'Paid in Full' : 'Awaiting Settlement'}
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider border-b border-tally-border-light dark:border-tally-border-dark pb-3 px-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-tally-border-light dark:divide-tally-border-dark">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <div key={item.id || idx} className="grid grid-cols-12 gap-2 py-3 px-2 text-xs items-center">
                    <div className="col-span-6 font-medium text-tally-text-primary dark:text-white">
                      {item.description}
                    </div>
                    <div className="col-span-2 text-center text-tally-text-secondary dark:text-tally-text-secondaryDark">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-right text-tally-text-secondary dark:text-tally-text-secondaryDark">
                      {invoice.currency}{(Number(item.unitPrice) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="col-span-2 text-right font-semibold text-tally-text-primary dark:text-white">
                      {invoice.currency}{(Number(item.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-tally-text-secondary">
                  No individual items listed.
                </div>
              )}
            </div>
          </div>

          {/* Summary & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-tally-border-light dark:border-tally-border-dark">
            <div className="flex flex-col justify-between">
              {invoice.notes && (
                <div>
                  <span className="text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider block mb-1">
                    Notes & Terms
                  </span>
                  <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark whitespace-pre-line leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark mt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified digital record with Tally Wise</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                <span>Subtotal</span>
                <span className="font-semibold text-tally-text-primary dark:text-white">
                  {invoice.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {Number(invoice.taxRate) > 0 && (
                <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="font-semibold text-tally-text-primary dark:text-white">
                    +{invoice.currency}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-500">
                    -{invoice.currency}{Number(invoice.discount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-tally-border-light dark:border-tally-border-dark flex justify-between items-baseline mt-3">
                <span className="text-sm font-bold text-tally-text-primary dark:text-white uppercase tracking-wider">
                  Total Amount
                </span>
                <span className="text-2xl font-display font-black text-tally-primary">
                  {invoice.currency}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePaid}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                invoice.status === 'paid'
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(invoice);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-tally-text-secondary hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-tally-surface-hover dark:bg-tally-surface-darkHover hover:opacity-90 text-tally-text-primary dark:text-white text-xs font-bold border border-tally-border-light dark:border-tally-border-dark transition-all"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
