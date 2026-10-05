import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import Insights from './pages/Insights';
import ReportProblem from './pages/ReportProblem';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [issues, setIssues] = useState([]);
  const [confirmedIds, setConfirmedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Load the public reports once
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadError('The database connection is not set up. Add the Supabase environment variables and redeploy.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchIssues()
      .then((loadedIssues) => {
        if (cancelled) return;
        setIssues(loadedIssues);
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

  // Load this person's confirmations whenever they log in or out
  useEffect(() => {
    if (!user) {
      setConfirmedIds([]);
      return;
    }
    let cancelled = false;
    fetchMyConfirmations()
      .then((mine) => {
        if (!cancelled) setConfirmedIds(mine);
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    const issue = issues.find((i) => i.id === id);
    if (!issue || issue.userId === user.id) return;

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

  function changeStatus(id, status) {
    setIssues((current) =>
      current.map((i) =>
        i.id === id
          ? { ...i, status, resolvedAt: status === 'Resolved' ? i.resolvedAt || new Date().toISOString() : null }
          : i
      )
    );
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
            <Route
              path="/issues/:id"
              element={
                <IssueDetail
                  issues={issues}
                  confirmedIds={confirmedIds}
                  onConfirm={confirmIssue}
                  onStatusChange={changeStatus}
                />
              }
            />
            <Route path="/insights" element={<Insights issues={issues} />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route
              path="/report"
              element={
                <RequireAuth>
                  <ReportProblem issues={issues} confirmedIds={confirmedIds} onAddIssue={addIssue} onConfirm={confirmIssue} />
                </RequireAuth>
              }
            />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}