import React from 'react';
import { List, PieChart, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, onOpenSettingsModal }) {
  return (
    <div className="bottom-nav-bar">
      <button 
        className={`bottom-nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
        onClick={() => onTabChange('expenses')}
      >
        <List size={20} />
        <span>Activity</span>
      </button>

      <button 
        className={`bottom-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => onTabChange('analytics')}
      >
        <PieChart size={20} />
        <span>Analytics</span>
      </button>

      <button 
        className="bottom-nav-btn"
        onClick={onOpenSettingsModal}
      >
        <Settings size={20} />
        <span>Settings</span>
      </button>
    </div>
  );
}
