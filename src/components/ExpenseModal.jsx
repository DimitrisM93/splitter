import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Utensils, Home, Plane, Package, Tv, HeartPulse, MoreHorizontal, PlusCircle, Check } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

const ICON_MAP = {
  ShoppingCart, Utensils, Home, Plane, Package, Tv, HeartPulse, MoreHorizontal
};

export default function ExpenseModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingExpense, 
  settings 
}) {
  const p1Name = settings.partner1.name;
  const p2Name = settings.partner2.name;
  const p1Id = settings.partner1.id;
  const p2Id = settings.partner2.id;
  const curr = settings.currency || '$';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('groceries');
  const [paidBy, setPaidBy] = useState(p1Id);
  const [splitType, setSplitType] = useState('equal');
  const [customP1Share, setCustomP1Share] = useState('');
  const [customP2Share, setCustomP2Share] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount || '');
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setCategory(editingExpense.category || 'groceries');
      setPaidBy(editingExpense.paidBy || p1Id);
      setSplitType(editingExpense.splitType || 'equal');
      setCustomP1Share(editingExpense.customP1Share || '');
      setCustomP2Share(editingExpense.customP2Share || '');
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('groceries');
      setPaidBy(p1Id);
      setSplitType('equal');
      setCustomP1Share('');
      setCustomP2Share('');
      setNotes('');
    }
  }, [editingExpense, isOpen, p1Id]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    const expenseData = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
      title,
      amount: parseFloat(amount),
      date,
      category,
      paidBy,
      splitType,
      customP1Share: splitType === 'custom' ? parseFloat(customP1Share) || 0 : undefined,
      customP2Share: splitType === 'custom' ? parseFloat(customP2Share) || 0 : undefined,
      notes
    };

    onSave(expenseData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <PlusCircle size={20} color="var(--brand-primary)" />
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Expense Description</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Trader Joe's Groceries, Rent, Dinner" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount ({curr})</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category Picker Grid */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="category-picker-grid">
                {CATEGORIES.map(cat => {
                  const IconComp = ICON_MAP[cat.icon] || MoreHorizontal;
                  const isActive = category === cat.id;
                  return (
                    <div 
                      key={cat.id} 
                      className={`category-chip ${isActive ? 'active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <IconComp size={18} color={isActive ? 'var(--brand-primary)' : cat.color} />
                      <span className="category-chip-name">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paid By Selection */}
            <div className="form-group">
              <label className="form-label">Who Paid?</label>
              <div className="form-row">
                <button
                  type="button"
                  className={`btn ${paidBy === p1Id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaidBy(p1Id)}
                >
                  {paidBy === p1Id && <Check size={16} />}
                  Paid by {p1Name}
                </button>
                <button
                  type="button"
                  className={`btn ${paidBy === p2Id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaidBy(p2Id)}
                >
                  {paidBy === p2Id && <Check size={16} />}
                  Paid by {p2Name}
                </button>
              </div>
            </div>

            {/* Split Type Options */}
            <div className="form-group">
              <label className="form-label">How to Split?</label>
              <div className="split-selector-grid">
                <div 
                  className={`split-card ${splitType === 'equal' ? 'active' : ''}`}
                  onClick={() => setSplitType('equal')}
                >
                  <span className="split-card-title">50 / 50 Split</span>
                  <span className="split-card-desc">Split evenly between both of you</span>
                </div>

                <div 
                  className={`split-card ${splitType === 'income' ? 'active' : ''}`}
                  onClick={() => setSplitType('income')}
                >
                  <span className="split-card-title">Income Ratio</span>
                  <span className="split-card-desc">Split {settings.partner1.incomeRatio}% / {100 - settings.partner1.incomeRatio}% by income</span>
                </div>

                <div 
                  className={`split-card ${splitType === 'p1_full' ? 'active' : ''}`}
                  onClick={() => setSplitType('p1_full')}
                >
                  <span className="split-card-title">100% {p1Name}</span>
                  <span className="split-card-desc">{p1Name} absorbs full expense</span>
                </div>

                <div 
                  className={`split-card ${splitType === 'p2_full' ? 'active' : ''}`}
                  onClick={() => setSplitType('p2_full')}
                >
                  <span className="split-card-title">100% {p2Name}</span>
                  <span className="split-card-desc">{p2Name} absorbs full expense</span>
                </div>
              </div>
            </div>

            {/* Notes Input */}
            <div className="form-group">
              <label className="form-label">Notes & Details (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Dinner reservation at 8pm" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
