import { formatCurrency } from '../utils/formatters';

function SummaryCards({ stats }) {
  const cards = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(stats.totalOutstanding),
      description: 'Pending + Overdue',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      icon: '💰'
    },
    {
      title: 'Total Overdue',
      value: formatCurrency(stats.totalOverdue),
      description: 'Past due date',
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      icon: '⚠️'
    },
    {
      title: 'Paid This Month',
      value: formatCurrency(stats.totalPaidThisMonth),
      description: 'Current month',
      color: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: '✓'
    },
    {
      title: 'Avg Payment Delay',
      value: `${stats.avgPaymentDelay} days`,
      description: stats.avgPaymentDelay > 0 ? 'Late payments' : stats.avgPaymentDelay < 0 ? 'Early payments' : 'On time',
      color: 'from-amber-500/20 to-amber-600/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      icon: '⏱️'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 group"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">
                {card.title}
              </div>
              <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                {card.icon}
              </div>
            </div>
            
            <div className={`text-3xl md:text-4xl font-bold mb-2 ${card.textColor}`}>
              {card.value}
            </div>
            
            <div className="text-slate-400 text-sm">
              {card.description}
            </div>
          </div>

          {/* Decorative corner */}
          <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${card.color} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;