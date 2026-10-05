import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Issues from './pages/Issues';
import Insights from './pages/Insights';
import ReportProblem from './pages/ReportProblem';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { fetchIssues, fetchMyConfirmations, createIssue, toggleConfirmation } from './lib/api';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [issues, setIssues] = useState([]);
  const [confirmedIds, setConfirmedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadError('The database connection is not set up. Add the Supabase environment variables and redeploy.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([fetchIssues(), fetchMyConfirmations().catch(() => [])])
      .then(([loadedIssues, mine]) => {
        if (cancelled) return;
        setIssues(loadedIssues);
        setConfirmedIds(mine);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (cancelled) return;
        setLoadError('Could not load reports. Check your connection and refresh the page.');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function addIssue(data) {
    const created = await createIssue(data);
    setIssues((current) => [created, ...current]);
  }

  function applyConfirmation(id, confirmed, count) {
    setConfirmedIds((current) =>
      confirmed ? (current.includes(id) ? current : [...current, id]) : current.filter((x) => x !== id)
    );
    setIssues((current) => current.map((i) => (i.id === id ? { ...i, confirmations: count } : i)));
  }

  async function confirmIssue(id) {
    const issue = issues.find((i) => i.id === id);
    if (!issue) return;
    const wasConfirmed = confirmedIds.includes(id);
    applyConfirmation(id, !wasConfirmed, Math.max(0, issue.confirmations + (wasConfirmed ? -1 : 1)));
    try {
      const result = await toggleConfirmation(issue.dbId);
      applyConfirmation(id, result.confirmed, result.count);
    } catch (err) {
      console.error(err);
      applyConfirmation(id, wasConfirmed, issue.confirmations);
    }
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        {loading ? (
          <section className="container page-head">
            <p className="lead">Loading reports...</p>
          </section>
        ) : loadError ? (
          <section className="container page-head">
            <div className="notice notice-error" role="alert">{loadError}</div>
          </section>
        ) : (
          <Routes>
            <Route path="/" element={<Home issues={issues} />} />
            <Route path="/map" element={<MapPage issues={issues} />} />
            <Route path="/issues" element={<Issues issues={issues} confirmedIds={confirmedIds} onConfirm={confirmIssue} />} />
            <Route path="/insights" element={<Insights issues={issues} />} />
            <Route
              path="/report"
              element={<ReportProblem issues={issues} confirmedIds={confirmedIds} onAddIssue={addIssue} onConfirm={confirmIssue} />}
            />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}