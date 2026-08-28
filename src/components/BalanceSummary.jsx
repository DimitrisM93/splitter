import React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, Heart, Sparkles } from 'lucide-react';
import { calculateCoupleSummary, formatCurrency } from '../utils/calculations';

export default function BalanceSummary({ expenses, settlements, settings, onOpenSettleModal }) {
  const summary = calculateCoupleSummary(expenses, settlements, settings);
  const { netP1Balance, totalExpenses, partner1Paid, partner2Paid } = summary;
  const curr = settings.currency || '$';

  const p1Name = settings.partner1.name;
  const p2Name = settings.partner2.name;

  let statusClass = 'neutral';
  let balanceText = 'All Settled Up!';
  let balanceSubtext = 'No outstanding debts between you two.';
  let mainAmountDisplay = formatCurrency(0, curr);

  if (netP1Balance > 0.01) {
    statusClass = 'positive';
    balanceText = `${p2Name} owes ${p1Name}`;
    balanceSubtext = `${p2Name} will transfer ${formatCurrency(netP1Balance, curr)} to ${p1Name}`;
    mainAmountDisplay = formatCurrency(netP1Balance, curr);
  } else if (netP1Balance < -0.01) {
    statusClass = 'negative';
    const absBal = Math.abs(netP1Balance);
    balanceText = `${p1Name} owes ${p2Name}`;
    balanceSubtext = `${p1Name} will transfer ${formatCurrency(absBal, curr)} to ${p2Name}`;
    mainAmountDisplay = formatCurrency(absBal, curr);
  }

  return (
    <div className="hero-card">
      <div className="couple-badges">
        <div className="partner-profile">
          <div className="partner-avatar p1">{settings.partner1.avatar || p1Name[0]}</div>
          <div className="partner-info">
            <span className="partner-name">{p1Name}</span>
            <span className="partner-role">Paid: {formatCurrency(partner1Paid, curr)}</span>
          </div>
        </div>

        <div className="vs-pill">
          <Heart size={12} style={{ display: 'inline', fill: 'var(--brand-primary)', stroke: 'none', marginRight: '4px' }} />
          COUPLE
        </div>

        <div className="partner-profile">
          <div className="partner-info" style={{ textAlign: 'right' }}>
            <span className="partner-name">{p2Name}</span>
            <span className="partner-role">Paid: {formatCurrency(partner2Paid, curr)}</span>
          </div>
          <div className="partner-avatar p2">{settings.partner2.avatar || p2Name[0]}</div>
        </div>
      </div>

      <div className={`balance-status-box ${statusClass}`}>
        <span className="balance-label">{balanceText}</span>
        <div className="balance-amount">{mainAmountDisplay}</div>
        <span className="balance-subtext">{balanceSubtext}</span>
      </div>

      <div className="quick-stats-row">
        <div className="stat-item">
          <span className="stat-title">Total Shared Expenses</span>
          <span className="stat-value">{formatCurrency(totalExpenses, curr)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Active Count</span>
          <span className="stat-value">{expenses.length} Expenses</span>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onOpenSettleModal}>
        <DollarSign size={18} />
        <span>Settle Up Net Balance</span>
      </button>
    </div>
  );
}
