import React, { useState, useEffect } from 'react';
import { X, Settings, User, DollarSign, PieChart, Save } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [currency, setCurrency] = useState('$');
  const [incomeRatio, setIncomeRatio] = useState(50);
  const [monthlyBudget, setMonthlyBudget] = useState(2500);

  useEffect(() => {
    if (settings) {
      setP1Name(settings.partner1.name || 'Walter');
      setP2Name(settings.partner2.name || 'Sarah');
      setCurrency(settings.currency || '$');
      setIncomeRatio(settings.partner1.incomeRatio || 50);
      setMonthlyBudget(settings.monthlyBudget || 2500);
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSettings = {
      ...settings,
      partner1: {
        ...settings.partner1,
        name: p1Name,
        avatar: p1Name[0] ? p1Name[0].toUpperCase() : 'P1',
        incomeRatio: Number(incomeRatio)
      },
      partner2: {
        ...settings.partner2,
        name: p2Name,
        avatar: p2Name[0] ? p2Name[0].toUpperCase() : 'P2',
        incomeRatio: 100 - Number(incomeRatio)
      },
      currency,
      monthlyBudget: Number(monthlyBudget)
    };

    onSaveSettings(updatedSettings);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Settings size={20} color="var(--brand-primary)" />
            Couple Account Settings
          </h3>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Partner Names */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Partner 1 Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={p1Name} 
                  onChange={(e) => setP1Name(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Partner 2 Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={p2Name} 
                  onChange={(e) => setP2Name(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Income Proportional Ratio */}
            <div className="form-group">
              <label className="form-label">
                Income Split Ratio ({p1Name}: {incomeRatio}% | {p2Name}: {100 - incomeRatio}%)
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={incomeRatio} 
                onChange={(e) => setIncomeRatio(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Used when choosing "Income Ratio" split mode on expenses.
              </span>
            </div>

            {/* Currency & Monthly Budget */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Base Currency</label>
                <select 
                  className="select-input" 
                  style={{ width: '100%', padding: '0.7rem' }}
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="¥">¥ (JPY/CNY)</option>
                  <option value="₹">₹ (INR)</option>
                  <option value="C$">C$ (CAD)</option>
                  <option value="A$">A$ (AUD)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Target Budget ({currency})</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={monthlyBudget} 
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
