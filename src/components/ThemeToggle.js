// src/components/ThemeToggle.js
import React from 'react';

export default function ThemeToggle({ dark, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ textAlign:'right', minWidth:42 }}>
        <small style={{ color:'var(--muted)' }}>Dark</small>
      </div>

      <div
        onClick={() => onChange(!dark)}
        role="switch"
        aria-checked={dark}
        style={{
          width:48,
          height:28,
          borderRadius:20,
          padding:4,
          display:'flex',
          alignItems:'center',
          cursor:'pointer',
          background: dark ? 'linear-gradient(135deg,#5b21b6,#0891b2)' : 'linear-gradient(135deg,#e6e9ee,#ffffff)',
          boxShadow: dark ? '0 6px 18px rgba(8,25,37,0.25)' : '0 6px 18px rgba(11,20,60,0.06)',
          transition:'all .18s ease'
        }}
      >
        <div style={{
          width:20,
          height:20,
          borderRadius:14,
          background: dark ? 'white' : '#0b1220',
          transform: dark ? 'translateX(20px)' : 'translateX(0)',
          transition:'transform .18s ease, background .18s ease'
        }} />
      </div>
    </label>
  );
}
