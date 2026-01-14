# MSME Invoice Management Dashboard

A modern, feature-rich invoice management dashboard built for MSMEs to track invoices, payments, and cash flow efficiently.

## 🚀 Live Demo

**Deployment URL:** [(https://invoice-management-beta-beryl.vercel.app/)]

## 📋 Features Implemented

### Core Features ✅
- **Invoice List View** with all required columns
- **Status Filtering** (All, Paid, Pending, Overdue)
- **Sorting** by Amount, Date, and Due Date
- **Search Functionality** by invoice number or customer name
- **Summary Cards** displaying key metrics:
  - Total Outstanding (Pending + Overdue)
  - Total Overdue
  - Total Paid This Month
  - Average Payment Delay
- **Add New Invoice** with modal form and validation
- **Payment Action** to mark invoices as paid with custom payment date

### Advanced Logic Implementation ✅

#### 1. Status Calculation Logic
- **Paid**: Payment date exists
- **Overdue**: No payment date AND due date < today
- **Pending**: No payment date AND due date >= today
- Status updates dynamically based on current date

#### 2. Days Calculation
- **Pending**: "Due in X days"
- **Overdue**: "Overdue by X days" (displayed in red)
- **Paid**: Shows "Paid X days early/late" or "Paid on time"

#### 3. Real-time Summary Calculations
- All 4 summary cards update instantly when:
  - New invoice is added
  - Invoice is marked as paid
  - Filters are applied (shows filtered totals)
- Average payment delay only considers paid invoices

### Performance Optimizations 🚀

#### 1. Efficient Re-renders
- **useMemo** for expensive calculations:
  - Invoice status calculation
  - Filtered invoice list
  - Sorted invoice list
  - Summary statistics
- **useCallback** for event handlers:
  - Add invoice handler
  - Mark as paid handler
  - Sort handler
  - Form change handlers

#### 2. Component Structure
- Clean separation of concerns with reusable components:
  - `InvoiceCard` - Individual invoice display
  - `SummaryCards` - Metrics dashboard
  - `AddInvoiceModal` - Invoice creation form
  - `InvoiceList` - List management with pagination
- Proper props passing and component composition
- No prop drilling (direct props passing, < 3 levels)

#### 3. Large Dataset Handling
- **Pagination**: 15 items per page (configurable)
- Tested with 500+ invoices - smooth performance
- Fast search and filter operations
- Efficient data structure for quick lookups

#### 4. Data Management
- **localStorage** persistence across page refreshes
- Loads 10 sample invoices on first run
- Handles edge cases:
  - Empty states with helpful messages
  - "No results found" feedback
  - Form validation errors
  - Invalid data handling

## 🛠️ Tech Stack

- **React.js 18.2** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **LocalStorage** - Client-side data persistence

## 📦 Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🏗️ Project Structure

```
invoice-dashboard/
├── src/
│   ├── components/
│   │   ├── InvoiceCard.jsx      # Individual invoice display
│   │   ├── InvoiceList.jsx      # List with pagination
│   │   ├── SummaryCards.jsx     # Metrics dashboard
│   │   └── AddInvoiceModal.jsx  # Invoice creation form
│   ├── utils/
│   │   ├── invoiceUtils.js      # Business logic functions
│   │   ├── formatters.js        # Format helpers
│   │   └── sampleData.js        # Sample data generator
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 💡 Approach & Design Decisions

### Component Architecture
- **Single Responsibility**: Each component handles one specific concern
- **Reusability**: Components are designed to be reusable
- **Composition**: Complex UIs built from simple components
- **State Management**: Local state with React hooks, no external libraries

### Performance Strategy
1. **Memoization**: Used `useMemo` for all expensive calculations
2. **Callback Optimization**: `useCallback` prevents unnecessary re-renders
3. **Pagination**: Limits DOM elements rendered at once
4. **Efficient Filtering**: Filter operations happen in memory, not DOM

### UI/UX Decisions
- **Dark Theme**: Modern aesthetic, reduces eye strain
- **Color Coding**: 
  - Green for paid invoices
  - Red for overdue invoices
  - Amber for pending invoices
  - Blue for outstanding amounts
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Feedback**: Loading states, error messages, success confirmations

### Trade-offs Made

1. **Pagination over Virtualization**
   - **Why**: Simpler implementation, adequate for dataset size
   - **Trade-off**: Virtualization would be better for 10,000+ items

2. **LocalStorage over Backend**
   - **Why**: Assignment requirement, no backend needed
   - **Trade-off**: Data is browser-specific, no multi-device sync

3. **Component Co-location**
   - **Why**: Keeps related code together
   - **Trade-off**: Could extract more reusable components for larger apps

4. **CSS-in-JS via Tailwind**
   - **Why**: Fast development, consistent styling
   - **Trade-off**: Larger HTML, but negligible impact with purging

## 🎨 Performance Optimizations Implemented

### 1. React Optimizations
```javascript
// Memoized calculations prevent recalculation on every render
const invoicesWithStatus = useMemo(() => {
  return invoices.map(invoice => ({
    ...invoice,
    status: calculateInvoiceStatus(invoice),
    daysInfo: calculateDaysInfo(invoice)
  }));
}, [invoices]);

// Callbacks prevent child component re-renders
const handleMarkAsPaid = useCallback((invoiceId, paymentDate) => {
  setInvoices(prev => prev.map(inv => 
    inv.id === invoiceId ? { ...inv, paymentDate } : inv
  ));
}, []);
```

### 2. Efficient Filtering & Sorting
- Filter and sort operations run only when dependencies change
- Chain operations efficiently (filter → sort → paginate)
- Use indexes for quick lookups

### 3. DOM Optimization
- Pagination limits rendered elements to 15 at a time
- Conditional rendering for modals (unmounted when closed)
- No inline function definitions in render

### 4. Data Structure
```javascript
// Efficient invoice structure
const invoice = {
  id: "INV-001",              // Unique identifier
  customerName: "Acme Ltd",   // String
  amount: 45000,              // Number for calculations
  invoiceDate: "2024-01-15",  // ISO date string
  paymentTerms: 30,           // Number (days)
  dueDate: "2024-02-14",      // Calculated, stored
  paymentDate: null           // null or ISO date string
}
```


### Edge Cases Handled
- Empty invoice list
- No search results
- Form validation errors
- Invalid amounts (negative, zero)
- Missing required fields
- Payment dates in the future
- Past due invoices



**Built with ❤️ by [Korra Nithin]**