import { useState, useCallback } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

function InvoiceCard({ invoice, onMarkAsPaid }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleMarkAsPaid = useCallback(() => {
    onMarkAsPaid(invoice.id, paymentDate);
    setShowPaymentModal(false);
  }, [invoice.id, paymentDate, onMarkAsPaid]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getDaysColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'text-red-400';
      case 'paid':
        return 'text-slate-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 lg:p-6 hover:bg-slate-800/70 transition-all duration-200 hover:border-slate-600/50">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-emerald-400 font-semibold text-sm mb-1">
                {invoice.id}
              </div>
              <div className="text-white font-medium text-lg">
                {invoice.customerName}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-1">Amount</div>
              <div className="text-white font-semibold text-lg">
                {formatCurrency(invoice.amount)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Invoice Date</div>
              <div className="text-slate-300">
                {formatDate(invoice.invoiceDate)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Due Date</div>
              <div className="text-slate-300">
                {formatDate(invoice.dueDate)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Status</div>
              <div className={`font-medium ${getDaysColor(invoice.status)}`}>
                {invoice.daysInfo}
              </div>
            </div>
          </div>

          {invoice.status !== 'paid' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 font-medium"
            >
              Mark as Paid
            </button>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
          <div className="col-span-2 text-emerald-400 font-semibold">
            {invoice.id}
          </div>
          <div className="col-span-3 text-white font-medium">
            {invoice.customerName}
          </div>
          <div className="col-span-2 text-slate-300">
            {formatDate(invoice.invoiceDate)}
          </div>
          <div className="col-span-2 text-slate-300">
            {formatDate(invoice.dueDate)}
          </div>
          <div className="col-span-2">
            <div className="text-white font-semibold text-lg">
              {formatCurrency(invoice.amount)}
            </div>
            <div className={`text-sm font-medium ${getDaysColor(invoice.status)}`}>
              {invoice.daysInfo}
            </div>
          </div>
          <div className="col-span-1">
            {invoice.status === 'paid' ? (
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 text-xs font-semibold"
              >
                Pay
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Mark Invoice as Paid
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-slate-400 text-sm mb-1">Invoice</div>
                <div className="text-white font-semibold">{invoice.id}</div>
              </div>
              
              <div>
                <div className="text-slate-400 text-sm mb-1">Amount</div>
                <div className="text-white font-semibold text-xl">
                  {formatCurrency(invoice.amount)}
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-emerald-500/20"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InvoiceCard;