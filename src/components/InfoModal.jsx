import React from 'react';
import { Info } from 'lucide-react';
import Modal from './Modal.jsx';
import { TIER_ORDER, TIER_POINTS, TIER_COLORS } from '../data.js';

export default function InfoModal({ onClose }) {
  return (
    <Modal
      title="Puanlama Sistemi"
      subtitle="Her tier belirli bir puana denk gelir. Toplam puan tüm kitlerin toplamıdır."
      icon={Info}
      onClose={onClose}
    >
      <ul className="tier-legend">
        {TIER_ORDER.map((tier) => (
          <li key={tier} style={{ '--tier-color': TIER_COLORS[tier] }}>
            <span className="legend-tier">{tier}</span>
            <span className="legend-bar">
              <span className="legend-fill" style={{ width: `${(TIER_POINTS[tier] / 60) * 100}%` }} />
            </span>
            <span className="legend-points">{TIER_POINTS[tier]} puan</span>
          </li>
        ))}
      </ul>
      <p className="info-note">
        Sıralama en yüksek puandan en düşüğe doğru yapılır. Bir kit sekmesindeyken yalnızca o kitteki
        tier puanı; Overall sekmesinde ise oyuncunun tüm kitlerdeki puan toplamı dikkate alınır.
      </p>
    </Modal>
  );
}
