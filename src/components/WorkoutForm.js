import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';

export default function WorkoutForm() {
  const { addLog } = useWorkouts();
  const [form, setForm] = useState({ date: '', type: '', durationMin: '', calories: '' });
  const [error, setError] = useState('');

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.type || !form.durationMin) {
      setError('Please fill date, type and duration');
      return;
    }
    const duration = parseInt(form.durationMin, 10);
    const calories = form.calories ? parseInt(form.calories, 10) : Math.round(duration * 8);

    await addLog({ date: form.date, type: form.type, durationMin: duration, calories });
    setForm({ date: '', type: '', durationMin: '', calories: '' });
    setError('');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
      <div className="form-row">
        <input name="date" type="date" value={form.date} onChange={onChange} />
        <input name="type" placeholder="Workout (e.g. Run)" value={form.type} onChange={onChange} />
        <input name="durationMin" placeholder="Duration (min)" value={form.durationMin} onChange={onChange} />
        <input name="calories" placeholder="Calories (optional)" value={form.calories} onChange={onChange} />
        <button type="submit">Add</button>
      </div>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
