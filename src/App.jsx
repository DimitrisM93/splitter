import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BalanceSummary from './components/BalanceSummary';
import ExpenseList from './components/ExpenseList';
import ExpenseModal from './components/ExpenseModal';
import SettleUpModal from './components/SettleUpModal';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import { INITIAL_EXPENSES, INITIAL_SETTLEMENTS, INITIAL_SETTINGS } from './data/initialData';
import { Plus } from 'lucide-react';

export default function App() {
  // LocalStorage initialization with fallbacks
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('duosplit_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('duosplit_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [settlements, setSettlements] = useState(() => {
    const saved = localStorage.getItem('duosplit_settlements');
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'analytics'
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('duosplit_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('duosplit_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('duosplit_settlements', JSON.stringify(settlements));
  }, [settlements]);

  // Handlers
  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingExpense(exp);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (expenseData) => {
    setExpenses(prev => {
      const exists = prev.some(e => e.id === expenseData.id);
      if (exists) {
        return prev.map(e => e.id === expenseData.id ? expenseData : e);
      }
      return [expenseData, ...prev];
    });
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveSettlement = (settlementData) => {
    setSettlements(prev => [settlementData, ...prev]);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all expenses & settings to original couple sample data?')) {
      setExpenses(INITIAL_EXPENSES);
      setSettlements(INITIAL_SETTLEMENTS);
      setSettings(INITIAL_SETTINGS);
      localStorage.clear();
    }
  };

  const handleExportCSV = () => {
    const p1Name = settings.partner1.name;
    const p2Name = settings.partner2.name;
    const p1Id = settings.partner1.id;

    let csvContent = "data:text/csv;charset=utf-8,ID,Title,Amount,Currency,Date,Category,PaidBy,SplitType,Notes\n";
    expenses.forEach(e => {
      const payer = e.paidBy === p1Id ? p1Name : p2Name;
      const row = `"${e.id}","${e.title.replace(/"/g, '""')}",${e.amount},"${settings.currency}","${e.date}","${e.category}","${payer}","${e.splitType}","${(e.notes || '').replace(/"/g, '""')}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DuoSplit_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Header 
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
      />

      {/* Main Dashboard Grid Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Hero Balance (Sticky on desktop, flow on mobile) */}
        <aside>
          <BalanceSummary 
            expenses={expenses}
            settlements={settlements}
            settings={settings}
            onOpenSettleModal={() => setIsSettleModalOpen(true)}
          />
        </aside>

        {/* Right Column: Main Content */}
        <main className="content-area">
          {/* Desktop Nav Tabs (Hidden on mobile) */}
          <div className="desktop-nav-tabs">
            <button 
              className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              Expense Activity
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics & Budget
            </button>
          </div>

          {activeTab === 'expenses' ? (
            <ExpenseList 
              expenses={expenses}
              settings={settings}
              onEditExpense={handleOpenEditModal}
              onDeleteExpense={handleDeleteExpense}
            />
          ) : (
            <AnalyticsView 
              expenses={expenses}
              settlements={settlements}
              settings={settings}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) for Add Expense */}
      <button className="fab-button" onClick={handleOpenAddModal} title="Add New Expense">
        <Plus size={28} />
      </button>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)} 
      />

      {/* Modals */}
      <ExpenseModal 
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        settings={settings}
      />

      <SettleUpModal 
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        expenses={expenses}
        settlements={settlements}
        settings={settings}
        onSaveSettlement={handleSaveSettlement}
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
