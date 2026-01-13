import { calculateDueDate } from './invoiceUtils';

const customerNames = [
  'Acme Manufacturing Ltd',
  'TechVista Solutions',
  'Green Valley Enterprises',
  'Metro Retail Corp',
  'Sunrise Textiles',
  'Digital Dynamics',
  'Classic Furniture Co',
  'Fresh Foods Distributors',
  'AutoParts Express',
  'Pacific Trading Company'
];

// Generate sample invoices with various statuses
export function generateSampleInvoices() {
  const invoices = [];
  const today = new Date();

  // Generate 10 sample invoices
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - daysAgo);

    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const amount = Math.floor(Math.random() * 90000) + 10000;

    const dueDate = calculateDueDate(
      invoiceDate.toISOString().split('T')[0],
      paymentTerms
    );

    // Randomly decide if invoice is paid (40% chance)
    let paymentDate = null;
    if (Math.random() < 0.4) {
      const dueDateObj = new Date(dueDate);
      // Payment can be -5 to +10 days from due date
      const paymentDayOffset = Math.floor(Math.random() * 16) - 5;
      const payment = new Date(dueDateObj);
      payment.setDate(payment.getDate() + paymentDayOffset);
      
      // Only set payment date if it's not in the future
      if (payment <= today) {
        paymentDate = payment.toISOString().split('T')[0];
      }
    }

    invoices.push({
      id: `INV-${String(i + 1).padStart(3, '0')}`,
      customerName: customerNames[i],
      amount,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      paymentTerms,
      dueDate,
      paymentDate
    });
  }

  return invoices;
}