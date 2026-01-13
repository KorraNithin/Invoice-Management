// Calculate invoice status based on payment date and due date
export function calculateInvoiceStatus(invoice) {
  if (invoice.paymentDate) {
    return 'paid';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'overdue';
  }

  return 'pending';
}

// Calculate days information for display
export function calculateDaysInfo(invoice) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (invoice.paymentDate) {
    const paymentDate = new Date(invoice.paymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `Paid ${diffDays} day${diffDays !== 1 ? 's' : ''} late`;
    } else if (diffDays < 0) {
      return `Paid ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} early`;
    } else {
      return 'Paid on time';
    }
  }

  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else {
    return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }
}

// Calculate due date based on invoice date and payment terms
export function calculateDueDate(invoiceDate, paymentTerms) {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split('T')[0];
}