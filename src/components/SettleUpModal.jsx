import React, { useState } from 'react';
import { X, ArrowUpDown, CheckCircle, Smartphone, Banknote, CreditCard } from 'lucide-react';
import { calculateCoupleSummary, formatCurrency } from '../utils/calculations';

export default function SettleUpModal({ 
  isOpen, 
  onClose, 
  expenses, 
  settlements, 
  settings, 
  onSaveSettlement 
}) {
  const summary = calculateCoupleSummary(expenses, settlements, settings);
  const { netP1Balance } = summary;

  const curr = settings.currency || '$';
  const p1Name = settings.partner1.name;
  const p2Name = settings.partner2.name;
  const p1Id = settings.partner1.id;
  const p2Id = settings.partner2.id;

  const isP2Payer = netP1Balance > 0;
  const payerName = isP2Payer ? p2Name : p1Name;
  const receiverName = isP2Payer ? p1Name : p2Name;
  const payerId = isP2Payer ? p2Id : p1Id;
  const receiverId = isP2Payer ? p1Id : p2Id;
  const suggestedAmount = Math.abs(netP1Balance).toFixed(2);

  const [amount, setAmount] = useState(suggestedAmount);
  const [method, setMethod] = useState('Zelle');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSettle = (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0) return;

    const newSettlement = {
      id: `settle-${Date.now()}`,
      date,
      payerId,
      receiverId,
      amount: parseFloat(amount),
      method,
      note: note || `${method} settlement payment`
    };

    onSaveSettlement(newSettlement);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <ArrowUpDown size={20} color="var(--color-positive)" />
            Settle Up Net Balance
          </h3>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSettle}>
          <div className="modal-body">
            {Math.abs(netP1Balance) < 0.01 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={48} color="var(--color-positive)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>You are completely settled up!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  There is currently no outstanding net debt between {p1Name} and {p2Name}.
                </p>
              </div>
            ) : (
              <>
                <div 
                  className="balance-status-box positive"
                  style={{ borderRadius: 'var(--radius-md)', padding: '1rem' }}
                >
                  <span className="balance-label">Recommended Settlement</span>
                  <div className="balance-amount">{formatCurrency(Math.abs(netP1Balance), curr)}</div>
                  <span className="balance-subtext">
                    <strong>{payerName}</strong> pays <strong>{receiverName}</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount ({curr})</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {['Zelle', 'Venmo', 'Cash', 'Bank Transfer', 'Apple Pay'].map(m => (
                      <button
                        key={m}
                        type="button"
                        className={`btn ${method === m ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                        onClick={() => setMethod(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
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

                <div className="form-group">
                  <label className="form-label">Settlement Note</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. August balance settlement via Zelle" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            {Math.abs(netP1Balance) >= 0.01 && (
              <button type="submit" className="btn btn-primary">
                Record Settlement
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
