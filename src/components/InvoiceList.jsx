import { useState, useMemo } from 'react';
import InvoiceCard from './InvoiceCard';

const ITEMS_PER_PAGE = 15;

function InvoiceList({ invoices, onMarkAsPaid, onSort, sortBy, sortOrder }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate invoices
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return invoices.slice(startIndex, endIndex);
  }, [invoices, currentPage]);

  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);

  // Reset to first page when invoices change
  useMemo(() => {
    setCurrentPage(1);
  }, [invoices.length]);

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
    >
      {label}
      {sortBy === field && (
        <span className="text-emerald-400">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  if (invoices.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
        <div className="text-slate-400 text-lg mb-2">No invoices found</div>
        <p className="text-slate-500">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 text-slate-300 text-sm font-semibold">
        <div className="col-span-2">Invoice #</div>
        <div className="col-span-3">Customer</div>
        <div className="col-span-2">
          <SortButton field="date" label="Invoice Date" />
        </div>
        <div className="col-span-2">
          <SortButton field="dueDate" label="Due Date" />
        </div>
        <div className="col-span-2">
          <SortButton field="amount" label="Amount" />
        </div>
        <div className="col-span-1">Status</div>
      </div>

      {/* Invoice Cards */}
      <div className="space-y-3">
        {paginatedInvoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onMarkAsPaid={onMarkAsPaid}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Results info */}
      <div className="text-center text-slate-400 text-sm">
        Showing {Math.min(invoices.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(currentPage * ITEMS_PER_PAGE, invoices.length)} of {invoices.length} invoices
      </div>
    </div>
  );
}

export default InvoiceList;