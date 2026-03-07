import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';

export default function WorkoutTable() {
  const { logs, loading, removeLog } = useWorkouts();

  if (loading) return <div>Loading logs...</div>;

  return (
    <div style={{ marginTop: 12 }}>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Type</th><th>Duration (min)</th><th>Calories</th><th>Action</th></tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.date}</td>
              <td>{l.type}</td>
              <td>{l.durationMin}</td>
              <td>{l.calories}</td>
              <td><button onClick={() => removeLog(l.id)}>Delete</button></td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', opacity: 0.7 }}>No workouts yet — add one!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
