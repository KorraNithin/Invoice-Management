import { useState, useMemo, useCallback, useEffect } from 'react';
import InvoiceList from './components/InvoiceList';
import SummaryCards from './components/SummaryCards';
import AddInvoiceModal from './components/AddInvoiceModal';
import { generateSampleInvoices } from './utils/sampleData';
import { calculateInvoiceStatus, calculateDaysInfo } from './utils/invoiceUtils';

function App() {
  const [invoices, setInvoices] = useState(() => {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : generateSampleInvoices();
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Calculate status for all invoices
  const invoicesWithStatus = useMemo(() => {
    return invoices.map(invoice => ({
      ...invoice,
      status: calculateInvoiceStatus(invoice),
      daysInfo: calculateDaysInfo(invoice)
    }));
  }, [invoices]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoicesWithStatus;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.id.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [invoicesWithStatus, filterStatus, searchQuery]);

  // Sort invoices
  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.invoiceDate) - new Date(b.invoiceDate);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredInvoices, sortBy, sortOrder]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalPaidThisMonth = 0;
    let paymentDelays = [];

    filteredInvoices.forEach(invoice => {
      if (invoice.status === 'pending' || invoice.status === 'overdue') {
        totalOutstanding += invoice.amount;
      }
      
      if (invoice.status === 'overdue') {
        totalOverdue += invoice.amount;
      }
      
      if (invoice.paymentDate) {
        const paymentDate = new Date(invoice.paymentDate);
        if (paymentDate.getMonth() === currentMonth && 
            paymentDate.getFullYear() === currentYear) {
          totalPaidThisMonth += invoice.amount;
        }
        
        // Calculate payment delay
        const dueDate = new Date(invoice.dueDate);
        const delayDays = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
        paymentDelays.push(delayDays);
      }
    });

    const avgPaymentDelay = paymentDelays.length > 0
      ? paymentDelays.reduce((sum, delay) => sum + delay, 0) / paymentDelays.length
      : 0;

    return {
      totalOutstanding,
      totalOverdue,
      totalPaidThisMonth,
      avgPaymentDelay: Math.round(avgPaymentDelay * 10) / 10
    };
  }, [filteredInvoices]);

  const handleAddInvoice = useCallback((newInvoice) => {
    setInvoices(prev => [...prev, newInvoice]);
    setIsModalOpen(false);
  }, []);

  const handleMarkAsPaid = useCallback((invoiceId, paymentDate) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, paymentDate }
        : inv
    ));
  }, []);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                Invoice <span className="text-emerald-400">Manager</span>
              </h1>
              <p className="text-slate-400 text-lg">Track payments, manage cash flow</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105"
            >
              + New Invoice
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <SummaryCards stats={summaryStats} />

        {/* Filters and Search */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by invoice number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'overdue', 'paid'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${
                    filterStatus === status
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <InvoiceList
          invoices={sortedInvoices}
          onMarkAsPaid={handleMarkAsPaid}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {/* Add Invoice Modal */}
        {isModalOpen && (
          <AddInvoiceModal
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddInvoice}
          />
        )}
      </div>
    </div>
  );
}

export default App;