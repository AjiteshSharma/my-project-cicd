// src/App.js
import React, { useMemo, useEffect, useState } from 'react';
import { WorkoutProvider, useWorkouts } from './context/WorkoutContext';
import SummaryCard from './components/SummaryCard';
import WorkoutForm from './components/WorkoutForm';
import WorkoutTable from './components/WorkoutTable';
import Tips from './components/Tips';
import ExportArea from './components/ExportArea';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

function Dashboard() {
  const { logs } = useWorkouts();

  const totals = useMemo(() => {
    const totalWorkouts = logs.length;
    const totalCalories = logs.reduce((s, l) => s + (Number(l.calories) || 0), 0);
    const totalMinutes = logs.reduce((s, l) => s + (Number(l.durationMin) || 0), 0);
    return { totalWorkouts, totalCalories, totalMinutes };
  }, [logs]);

  useEffect(() => {
    document.title = `Workouts: ${totals.totalWorkouts} • ${totals.totalCalories} cal`;
  }, [totals.totalWorkouts, totals.totalCalories]);

  return (
    <div>
      <div className="cards">
        <SummaryCard title="Total Workouts" value={totals.totalWorkouts} sub="Sessions logged" />
        <SummaryCard title="Calories Burned" value={`${totals.totalCalories} kcal`} sub="Approx total" />
        <SummaryCard title="Total Time" value={`${totals.totalMinutes} min`} sub="Minutes" />
      </div>

      <div className="grid">
        <div>
          <WorkoutForm />
          <WorkoutTable />
        </div>

        <div>
          <Tips />
          <ExportArea />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // persist theme
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_dark_v1');
      return saved ? JSON.parse(saved) : false;
    } catch (e) { return false; }
  });

  // apply theme on body (reliable across the entire app)
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('ft_dark_v1', JSON.stringify(dark));
  }, [dark]);

  return (
    <WorkoutProvider>
      <div className="container">
        <div className="header">
          <div>
            <h1>Fitness Tracker Dashboard</h1>
            <div className="sub">Track workouts • calories • time</div>
          </div>

          <ThemeToggle dark={dark} onChange={setDark} />
        </div>

        <Dashboard />
      </div>
    </WorkoutProvider>
  );
}
