import React from 'react';

// Puana göre gelen NeptunePvP rolü rozeti
export function RoleBadge({ role, size = 'md', showLabel = true }) {
  if (!role) return null;
  return (
    <span className={`role-badge role-${role.tone} rb-${size}`} title={role.full}>
      {role.img ? (
        <img src={role.img || "/placeholder.svg"} alt="" className="role-badge-img" />
      ) : (
        <span className="role-badge-dot" />
      )}
      {showLabel && <span className="role-badge-text">{role.label}</span>}
    </span>
  );
}
