import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Invoice, InvoiceStatus } from '../types';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { CreateInvoiceModal } from '../components/invoices/CreateInvoiceModal';
import { InvoiceDetailModal } from '../components/invoices/InvoiceDetailModal';
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit3,
  Filter,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Invoices() {
  const invoices = useStore((state) => state.invoices);
  const deleteInvoice = useStore((state) => state.deleteInvoice);
  const markInvoiceStatus = useStore((state) => state.markInvoiceStatus);
  const settings = useStore((state) => state.settings);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | InvoiceStatus>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const currencySymbol = settings.currency || '$';

  // Quick overdue calculation check
  const todayStr = new Date().toISOString().split('T')[0];

  const processedInvoices = useMemo(() => {
    return invoices.map((inv) => {
      // If invoice is marked pending but due date is in the past, consider it overdue for display
      if (inv.status === 'pending' && inv.dueDate && inv.dueDate < todayStr) {
        return { ...inv, isOverdueDate: true };
      }
      return { ...inv, isOverdueDate: false };
    });
  }, [invoices, todayStr]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return processedInvoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.clientEmail && inv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (selectedStatus === 'all') {
        matchesStatus = true;
      } else if (selectedStatus === 'overdue') {
        matchesStatus = inv.status === 'overdue' || inv.isOverdueDate;
      } else {
        matchesStatus = inv.status === selectedStatus;
      }

      return matchesSearch && matchesStatus;
    });
  }, [processedInvoices, searchQuery, selectedStatus]);

  // Statistics
  const totalAmount = useMemo(
    () => invoices.reduce((sum, inv) => sum + (Number(inv.total ?? inv.amount) || 0), 0),
    [invoices]
  );

  const paidInvoices = useMemo(() => invoices.filter((i) => i.status === 'paid'), [invoices]);
  const paidAmount = useMemo(
    () => paidInvoices.reduce((sum, inv) => sum + (Number(inv.total ?? inv.amount) || 0), 0),
    [paidInvoices]
  );

  const pendingInvoices = useMemo(
    () => processedInvoices.filter((i) => i.status === 'pending' && !i.isOverdueDate),
    [processedInvoices]
  );
  const pendingAmount = useMemo(
    () => pendingInvoices.reduce((sum, inv) => sum + (Number(inv.total ?? inv.amount) || 0), 0),
    [pendingInvoices]
  );

  const overdueInvoices = useMemo(
    () => processedInvoices.filter((i) => i.status === 'overdue' || i.isOverdueDate),
    [processedInvoices]
  );
  const overdueAmount = useMemo(
    () => overdueInvoices.reduce((sum, inv) => sum + (Number(inv.total ?? inv.amount) || 0), 0),
    [overdueInvoices]
  );

  const handleDelete = (id: string, invNum: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNum}?`)) {
      deleteInvoice(id);
      toast.success('Invoice deleted');
      if (viewingInvoice?.id === id) {
        setViewingInvoice(null);
      }
    }
  };

  const handleToggleStatus = (inv: Invoice) => {
    const nextStatus: InvoiceStatus = inv.status === 'paid' ? 'pending' : 'paid';
    markInvoiceStatus(inv.id, nextStatus);
    toast.success(nextStatus === 'paid' ? 'Marked as Paid' : 'Marked as Pending');
  };

  const getClientInitialColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-emerald-500',
      'bg-teal-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      {/* Top Header Row */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Client <span className="font-bold">Invoices</span>
          </h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
            Create, track, and manage billings and client receipts.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingInvoice(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Total Invoiced */}
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="p-2 rounded-xl bg-tally-primary/10 text-tally-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-display font-bold text-tally-text-primary dark:text-white">
              {currencySymbol}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
              {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} issued
            </p>
          </div>
        </div>

        {/* Paid & Collected */}
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Paid & Settled
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">
              {currencySymbol}{paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
              {paidInvoices.length} completed
            </p>
          </div>
        </div>

        {/* Awaiting Payment */}
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Awaiting Payment
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-display font-bold text-amber-600 dark:text-amber-400">
              {currencySymbol}{pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
              {pendingInvoices.length} awaiting settlement
            </p>
          </div>
        </div>

        {/* Overdue */}
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Overdue
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-display font-bold text-rose-600 dark:text-rose-400">
              {currencySymbol}{overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
              {overdueInvoices.length} need attention
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: invoices.length },
            { id: 'pending', label: 'Pending', count: pendingInvoices.length },
            { id: 'paid', label: 'Paid', count: paidInvoices.length },
            { id: 'overdue', label: 'Overdue', count: overdueInvoices.length },
            { id: 'draft', label: 'Draft', count: invoices.filter((i) => i.status === 'draft').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary shadow-sm'
                  : 'text-tally-text-secondary hover:text-tally-text-primary dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatus === tab.id
                    ? 'bg-white/20 dark:bg-black/20'
                    : 'bg-black/5 dark:bg-white/10'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-tally-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search invoices, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary focus:outline-none text-xs text-tally-text-primary dark:text-white transition-colors"
          />
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="bg-tally-surface-light dark:bg-tally-surface-dark rounded-3xl border border-tally-border-light dark:border-tally-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[880px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-5 border-b border-tally-border-light dark:border-tally-border-dark text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              <div className="col-span-3">Invoice & Date</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-3 text-right">Status & Actions</div>
            </div>

            <div className="divide-y divide-tally-border-light dark:divide-tally-border-dark">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const isOverdue = inv.status === 'overdue' || inv.isOverdueDate;
                  const displayStatus = isOverdue && inv.status !== 'paid' ? 'overdue' : inv.status;

                  return (
                    <div
                      key={inv.id}
                      onClick={() => setViewingInvoice(inv)}
                      className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-tally-bg-light dark:hover:bg-tally-surface-darkHover transition-colors cursor-pointer group"
                    >
                      {/* Invoice # & Issue Date */}
                      <div className="col-span-3 flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-tally-primary/10 text-tally-primary flex items-center justify-center font-bold text-sm shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-sm text-tally-text-primary dark:text-white group-hover:text-tally-primary transition-colors truncate">
                            {inv.invoiceNumber}
                          </div>
                          <div className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark truncate">
                            Issued: {inv.issueDate}
                          </div>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="col-span-2 flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full ${getClientInitialColor(
                            inv.clientName
                          )} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {inv.clientName[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="font-semibold text-xs text-tally-text-primary dark:text-white truncate">
                            {inv.clientName}
                          </div>
                          {inv.clientEmail && (
                            <div className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark truncate">
                              {inv.clientEmail}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="col-span-2 min-w-0">
                        <div className="text-xs font-medium text-tally-text-primary dark:text-white truncate">
                          {inv.dueDate}
                        </div>
                        {isOverdue && inv.status !== 'paid' && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight block">
                            Past Due
                          </span>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="col-span-2 min-w-0 pr-4">
                        <div className="font-display font-bold text-base text-tally-text-primary dark:text-white whitespace-nowrap">
                          {inv.currency || currencySymbol}
                          {(Number(inv.total ?? inv.amount) || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">
                          {inv.items?.length || 0} {(inv.items?.length || 0) === 1 ? 'item' : 'items'}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div
                        className="col-span-3 flex items-center justify-end gap-3 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Status Pill */}
                        {displayStatus === 'paid' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            PAID
                          </span>
                        )}
                        {displayStatus === 'overdue' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                            OVERDUE
                          </span>
                        )}
                        {displayStatus === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                            PENDING
                          </span>
                        )}
                        {displayStatus === 'draft' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/20 shrink-0">
                            DRAFT
                          </span>
                        )}

                        {/* Quick action icons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title="View / Print"
                            onClick={() => setViewingInvoice(inv)}
                            className="p-1.5 rounded-lg text-tally-text-secondary hover:text-tally-primary hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            title={inv.status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                            onClick={() => handleToggleStatus(inv)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              inv.status === 'paid'
                                ? 'text-emerald-500 hover:text-amber-500'
                                : 'text-tally-text-secondary hover:text-emerald-500'
                            } hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            title="Edit Invoice"
                            onClick={() => {
                              setEditingInvoice(inv);
                              setIsCreateModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-tally-text-secondary hover:text-tally-text-primary dark:hover:text-white hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            title="Delete Invoice"
                            onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                            className="p-1.5 rounded-lg text-tally-text-secondary hover:text-rose-500 hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-tally-surface-hover dark:bg-tally-surface-darkHover flex items-center justify-center text-tally-text-secondary mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-tally-text-primary dark:text-white">
                {invoices.length === 0 ? 'No Invoices Yet' : 'No Matching Invoices'}
              </h3>
              <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark max-w-sm mt-1.5 mb-6">
                {invoices.length === 0
                  ? 'Get started by creating your first client invoice with customizable line items and taxes.'
                  : 'Try adjusting your search query or status filter to find what you are looking for.'}
              </p>
              {invoices.length === 0 ? (
                <button
                  onClick={() => {
                    setEditingInvoice(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary text-xs font-bold hover:opacity-90 shadow-md transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Create First Invoice
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                  }}
                  className="px-4 py-2 rounded-full bg-tally-surface-hover dark:bg-tally-surface-darkHover text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

      {/* Create & Edit Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingInvoice(null);
        }}
        editInvoice={editingInvoice}
      />

      {/* View / Print Detail Modal */}
      <InvoiceDetailModal
        isOpen={!!viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
        onEdit={(inv) => {
          setViewingInvoice(null);
          setEditingInvoice(inv);
          setIsCreateModalOpen(true);
        }}
      />
    </div>
  );
}
export default Invoices;
