import React from 'react';
import { HeartHandshake, Moon, Sun, Download, RotateCcw } from 'lucide-react';

export default function Header({ 
  settings, 
  onToggleTheme,
  onExportCSV,
  onResetData
}) {
  return (
    <header className="header-bar">
      <div className="brand-logo">
        <div className="brand-icon-wrapper">
          <HeartHandshake size={20} />
        </div>
        <div>
          <span>DuoSplit</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 500, marginTop: '-2px' }}>
            {settings.partner1.name} & {settings.partner2.name}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn-icon" onClick={onExportCSV} title="Export Expenses to CSV">
          <Download size={16} />
        </button>

        <button className="btn-icon" onClick={onToggleTheme} title="Toggle Dark/Light Mode">
          {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="btn-icon" onClick={onResetData} title="Reset to Sample Data">
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
