import React, { useState } from 'react';
import { 
  Search, Filter, Edit2, Trash2, ShoppingCart, Utensils, Home, 
  Plane, Package, Tv, HeartPulse, MoreHorizontal, FileText, CheckCircle2 
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { formatCurrency } from '../utils/calculations';

// Icon mapping helper
const ICON_MAP = {
  ShoppingCart, Utensils, Home, Plane, Package, Tv, HeartPulse, MoreHorizontal
};

export default function ExpenseList({ 
  expenses, 
  settings, 
  onEditExpense, 
  onDeleteExpense 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaidBy, setSelectedPaidBy] = useState('all');

  const curr = settings.currency || '$';
  const p1Name = settings.partner1.name;
  const p2Name = settings.partner2.name;
  const p1Id = settings.partner1.id;
  const p2Id = settings.partner2.id;

  // Filtering
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesPaidBy = selectedPaidBy === 'all' || exp.paidBy === selectedPaidBy;
    return matchesSearch && matchesCategory && matchesPaidBy;
  });

  const getCategoryInfo = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const calculateExpenseImpact = (exp) => {
    const amt = parseFloat(exp.amount) || 0;
    const payerName = exp.paidBy === p1Id ? p1Name : p2Name;
    const nonPayerName = exp.paidBy === p1Id ? p2Name : p1Name;

    let nonPayerShare = amt * 0.5;
    if (exp.splitType === 'income') {
      const ratio1 = (settings.partner1.incomeRatio || 50) / 100;
      nonPayerShare = exp.paidBy === p1Id ? amt * (1 - ratio1) : amt * ratio1;
    } else if (exp.splitType === 'p1_full') {
      nonPayerShare = exp.paidBy === p1Id ? 0 : amt;
    } else if (exp.splitType === 'p2_full') {
      nonPayerShare = exp.paidBy === p2Id ? 0 : amt;
    } else if (exp.splitType === 'custom') {
      nonPayerShare = exp.paidBy === p1Id ? (parseFloat(exp.customP2Share) || 0) : (parseFloat(exp.customP1Share) || 0);
    }

    if (nonPayerShare <= 0.001) {
      return { text: `${payerName} paid in full`, class: 'settled' };
    }

    return {
      text: `${nonPayerName} owes ${payerName} ${formatCurrency(nonPayerShare, curr)}`,
      class: exp.paidBy === p1Id ? 'owed-to-you' : 'you-owe'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search expenses or notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-selects">
          <select 
            className="select-input" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          <select 
            className="select-input" 
            value={selectedPaidBy} 
            onChange={(e) => setSelectedPaidBy(e.target.value)}
          >
            <option value="all">All Paid By</option>
            <option value={p1Id}>Paid by {p1Name}</option>
            <option value={p2Id}>Paid by {p2Name}</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No expenses found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
            Try adjusting your search filters or click "Add Expense" to add a new bill!
          </p>
        </div>
      ) : (
        <div className="expense-card-list">
          {filteredExpenses.map(exp => {
            const cat = getCategoryInfo(exp.category);
            const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal;
            const payerName = exp.paidBy === p1Id ? p1Name : p2Name;
            const impact = calculateExpenseImpact(exp);

            return (
              <div key={exp.id} className="expense-item">
                <div className="expense-item-left">
                  <div 
                    className="category-icon-badge" 
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <IconComponent size={22} />
                  </div>

                  <div className="expense-details">
                    <span className="expense-title">{exp.title}</span>
                    <div className="expense-meta">
                      <span>{exp.date}</span>
                      <span className="expense-meta-dot"></span>
                      <span>Paid by <strong>{payerName}</strong></span>
                      <span className="expense-meta-dot"></span>
                      <span className="split-type-badge">
                        {exp.splitType === 'equal' && '50 / 50'}
                        {exp.splitType === 'income' && 'Income Ratio'}
                        {exp.splitType === 'p1_full' && `${p1Name} 100%`}
                        {exp.splitType === 'p2_full' && `${p2Name} 100%`}
                        {exp.splitType === 'custom' && 'Custom Split'}
                      </span>
                    </div>
                    {exp.notes && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        "{exp.notes}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="expense-item-right">
                  <div className="expense-amount-box">
                    <span className="total-amount">{formatCurrency(exp.amount, curr)}</span>
                    <span className={`share-impact ${impact.class}`}>
                      {impact.text}
                    </span>
                  </div>

                  <div className="expense-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => onEditExpense(exp)}
                      title="Edit Expense"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => onDeleteExpense(exp.id)}
                      title="Delete Expense"
                      style={{ width: '32px', height: '32px', color: 'var(--color-negative)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
