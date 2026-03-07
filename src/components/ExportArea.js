import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';

export default function ExportArea() {
  const { logs } = useWorkouts();

  const exportCsv = () => {
    const header = 'date,type,durationMin,calories';
    const rows = logs.map(l => `${l.date},${l.type},${l.durationMin},${l.calories}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workouts_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>Export / Utils</div>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
  );
}
