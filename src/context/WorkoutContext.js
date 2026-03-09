import React, { createContext, useContext, useEffect, useState } from 'react';

const WorkoutContext = createContext();
export function useWorkouts() { return useContext(WorkoutContext); }

const API_BASE = "https://fitness-tracker-server.onrender.com";;

export function WorkoutProvider({ children }) {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('ft_logs_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  // Fetch logs from backend on mount; fall back to localStorage if fetch fails
  useEffect(() => {
    let mounted = true;
    async function fetchLogs() {
      try {
        const res = await fetch(`${API_BASE}/logs`);
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        if (mounted && Array.isArray(json.logs)) {
          setLogs(json.logs);
          localStorage.setItem('ft_logs_v1', JSON.stringify(json.logs));
        }
      } catch (err) {
        console.warn('Could not fetch logs from backend; using local data.', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchLogs();
    return () => { mounted = false; };
  }, []);

  // Persist local copy always
  useEffect(() => {
    localStorage.setItem('ft_logs_v1', JSON.stringify(logs));
  }, [logs]);

  // Add log: optimistic local update then POST to backend
  const addLog = async (log) => {
    const temp = { ...log, id: Date.now() };
    setLogs(prev => [temp, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      if (!res.ok) throw new Error('server error');
      const json = await res.json();
      // replace temp with server log
      setLogs(prev => prev.map(p => (p.id === temp.id ? json.log : p)));
    } catch (err) {
      console.warn('Failed to save to server, kept locally.', err.message);
      // keep optimistic entry
    }
  };

  const removeLog = async (id) => {
    // optimistic local remove
    setLogs(prev => prev.filter(l => l.id !== id));
    try {
      await fetch(`${API_BASE}/logs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server delete failed (may not exist).', err.message);
    }
  };

  return (
    <WorkoutContext.Provider value={{ logs, loading, addLog, removeLog }}>
      {children}
    </WorkoutContext.Provider>
  );
}
