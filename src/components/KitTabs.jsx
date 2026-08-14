import React from 'react';
import { KITS } from '../data.js';

export default function KitTabs({ active, onChange }) {
  return (
    <div className="kit-tabs" role="tablist" aria-label="Kit seçimi">
      {KITS.map((kit) => {
        const Icon = kit.icon;
        const isActive = active === kit.id;
        return (
          <button
            key={kit.id}
            role="tab"
            aria-selected={isActive}
            className={`kit-tab ${isActive ? 'active' : ''}`}
            style={{ '--kit-color': kit.color }}
            onClick={() => onChange(kit.id)}
          >
            <span className="kit-icon">
              <Icon size={20} />
            </span>
            <span className="kit-label">{kit.label}</span>
            <span className="kit-underline" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
