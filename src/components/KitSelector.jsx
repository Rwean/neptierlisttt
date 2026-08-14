import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { KITS } from '../data.js';

// Kit seçme şeridi — "Genel" + her kit için ikonlu kart
export function KitSelector({ active, onSelect }) {
  return (
    <div className="kit-selector" role="tablist" aria-label="Kit seçimi">
      <button
        role="tab"
        aria-selected={active === 'overall'}
        className={`kit-chip overall ${active === 'overall' ? 'active' : ''}`}
        onClick={() => onSelect('overall')}
      >
        <span className="kit-chip-icon">
          <LayoutGrid size={20} />
        </span>
        <span className="kit-chip-label">Genel</span>
      </button>

      {KITS.map((kit) => (
        <button
          key={kit.id}
          role="tab"
          aria-selected={active === kit.id}
          className={`kit-chip ${active === kit.id ? 'active' : ''}`}
          onClick={() => onSelect(kit.id)}
        >
          <span className="kit-chip-icon">
            <img src={kit.icon || "/placeholder.svg"} alt="" />
          </span>
          <span className="kit-chip-label">{kit.label}</span>
        </button>
      ))}
    </div>
  );
}
