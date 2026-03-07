import React from 'react';

export default function SummaryCard({ title, value, sub }) {
  return (
    <div className="card" style={{ minWidth: 180 }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}
