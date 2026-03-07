import React, { useEffect, useState } from 'react';

const API_TIPS = 'http://localhost:4000/api/tips';

export default function Tips() {
  const [tips, setTips] = useState([
    'Consistency beats intensity. Keep showing up.',
    'Small progress is still progress — celebrate it!',
    'Hydrate before and after exercise to boost recovery.',
    'Focus on form over speed to avoid injuries.',
    'Rest days are important — they help gains consolidate.'
  ]);
  const [index, setIndex] = useState(0);

  // fetch tips from backend once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(API_TIPS);
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        if (mounted && Array.isArray(json.tips)) setTips(json.tips);
      } catch (err) {
        console.warn('Using default tips; backend fetch failed.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  // setTimeout chain to rotate tips every 3 minutes (DoD exact)
  useEffect(() => {
    const rotateMs = 180000; // 3 minutes
    const id = setTimeout(() => setIndex(i => (i + 1) % tips.length), rotateMs);
    return () => clearTimeout(id);
  }, [index, tips.length]);

  return (
    <div className="tipBox">
      <div style={{ fontSize: 12, opacity: 0.8 }}>Motivational Tip</div>
      <div style={{ fontSize: 16, marginTop: 6 }}>{tips[index]}</div>
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Tip rotates every 3 minutes</div>
    </div>
  );
}
