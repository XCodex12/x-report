import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Issues from './pages/Issues';
import Insights from './pages/Insights';
import ReportProblem from './pages/ReportProblem';
import useLocalStorage from './hooks/useLocalStorage';
import { mockIssues } from './utils/mockIssues';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [issues, setIssues] = useLocalStorage('xr-issues-v1', mockIssues);
  const [confirmedIds, setConfirmedIds] = useLocalStorage('xr-confirmed-v1', []);

  function addIssue(data) {
    const last = issues.reduce((max, i) => Math.max(max, Number(i.id.replace('XR-', ''))), 1000);
    const newIssue = {
      ...data,
      id: 'XR-' + (last + 1),
      status: 'Reported',
      createdAt: new Date().toISOString().slice(0, 10),
      confirmations: 0,
    };
    setIssues([newIssue, ...issues]);
  }

  function confirmIssue(id) {
    const wasConfirmed = confirmedIds.includes(id);
    setConfirmedIds(wasConfirmed ? confirmedIds.filter((x) => x !== id) : [...confirmedIds, id]);
    setIssues(
      issues.map((i) =>
        i.id === id ? { ...i, confirmations: Math.max(0, i.confirmations + (wasConfirmed ? -1 : 1)) } : i
      )
    );
  }

  function resetDemo() {
    if (window.confirm('Reset all reports and confirmations to the demo data?')) {
      setIssues(mockIssues);
      setConfirmedIds([]);
    }
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
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
      </main>
      <Footer onReset={resetDemo} />
    </>
  );
}