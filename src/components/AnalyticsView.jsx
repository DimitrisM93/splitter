import React from 'react';
import { PieChart, Wallet, Calendar, ShieldCheck, History, ArrowRight, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { formatCurrency, calculateCoupleSummary } from '../utils/calculations';

export default function AnalyticsView({ expenses, settlements, settings, onDeleteSettlement }) {
  const curr = settings.currency || '$';
  const budget = settings.monthlyBudget || 2500;
  const p1Name = settings.partner1.name;
  const p2Name = settings.partner2.name;
  const p1Id = settings.partner1.id;
  const p2Id = settings.partner2.id;

  const summary = calculateCoupleSummary(expenses, settlements, settings);
  const totalSpent = summary.totalExpenses;
  const budgetPercent = Math.min(100, Math.round((totalSpent / budget) * 100));

  // Category breakdowns
  const categoryTotals = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const percentage = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
    return { ...cat, total, percentage };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="analytics-grid">
      {/* Monthly Budget & Spending Card */}
      <div className="analytics-card">
        <div className="card-heading">
          <span>Monthly Shared Budget</span>
          <Wallet size={20} color="var(--brand-primary)" />
        </div>

        <div className="budget-bar-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Spent: <strong>{formatCurrency(totalSpent, curr)}</strong></span>
            <span style={{ color: 'var(--text-secondary)' }}>Limit: <strong>{formatCurrency(budget, curr)}</strong></span>
          </div>

          <div className="budget-progress-track">
            <div 
              className="budget-progress-fill" 
              style={{ 
                width: `${budgetPercent}%`,
                background: budgetPercent > 90 ? 'linear-gradient(135deg, #F43F5E, #EF4444)' : 'var(--brand-gradient)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{budgetPercent}% of monthly limit</span>
            <span>{formatCurrency(Math.max(0, budget - totalSpent), curr)} remaining</span>
          </div>
        </div>

        {/* Paid By Split Summary */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
            Paid Out of Pocket Breakdown
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p1Name} Paid</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                {formatCurrency(summary.partner1Paid, curr)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p2Name} Paid</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-secondary)' }}>
                {formatCurrency(summary.partner2Paid, curr)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="analytics-card">
        <div className="card-heading">
          <span>Expenses by Category</span>
          <PieChart size={20} color="var(--brand-secondary)" />
        </div>

        {categoryTotals.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No expense data available for analytics yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoryTotals.map(cat => (
              <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }}></span>
                    {cat.label}
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    {formatCurrency(cat.total, curr)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="budget-progress-track" style={{ height: '8px' }}>
                  <div 
                    className="budget-progress-fill" 
                    style={{ width: `${cat.percentage}%`, background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlement History Card */}
      <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-heading">
          <span>Recent Settlement History</span>
          <History size={20} color="var(--color-positive)" />
        </div>

        {settlements.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
            No settlements recorded yet. Use the "Settle Up" button when you pay each other back!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {settlements.map(s => {
              const payerName = s.payerId === p1Id ? p1Name : p2Name;
              const receiverName = s.receiverId === p1Id ? p1Name : p2Name;

              return (
                <div 
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', 
                        background: 'var(--color-positive-bg)', color: 'var(--color-positive)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                        {payerName} paid {receiverName} ({s.method})
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {s.date} • {s.note}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-positive)' }}>
                      +{formatCurrency(s.amount, curr)}
                    </div>
                    {onDeleteSettlement && (
                      <button 
                        onClick={() => onDeleteSettlement(s.id)}
                        className="btn-icon" 
                        style={{ color: 'var(--color-negative)' }}
                        title="Delete Settlement"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
