import { useState, useCallback } from 'react';
import { calculateDueDate } from '../utils/invoiceUtils';

function AddInvoiceModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: 30
  });

  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      customerName: formData.customerName.trim(),
      amount: parseFloat(formData.amount),
      invoiceDate: formData.invoiceDate,
      paymentTerms: parseInt(formData.paymentTerms),
      dueDate: calculateDueDate(formData.invoiceDate, parseInt(formData.paymentTerms)),
      paymentDate: null
    };

    onAdd(newInvoice);
  }, [formData, validateForm, onAdd]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Invoice</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Customer Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-900 border ${
                errors.customerName ? 'border-red-500' : 'border-slate-600'
              } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="mt-1 text-red-400 text-sm">{errors.customerName}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Invoice Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`w-full pl-8 pr-4 py-3 bg-slate-900 border ${
                  errors.amount ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-red-400 text-sm">{errors.amount}</p>
            )}
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Invoice Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => handleChange('invoiceDate', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-900 border ${
                errors.invoiceDate ? 'border-red-500' : 'border-slate-600'
              } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            />
            {errors.invoiceDate && (
              <p className="mt-1 text-red-400 text-sm">{errors.invoiceDate}</p>
            )}
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Payment Terms
            </label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={7}>Net 7 days</option>
              <option value={15}>Net 15 days</option>
              <option value={30}>Net 30 days</option>
              <option value={45}>Net 45 days</option>
              <option value={60}>Net 60 days</option>
            </select>
          </div>

          {/* Due Date Preview */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="text-slate-400 text-sm mb-1">Due Date</div>
            <div className="text-white font-semibold">
              {calculateDueDate(formData.invoiceDate, parseInt(formData.paymentTerms))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-emerald-500/20"
            >
              Add Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInvoiceModal;