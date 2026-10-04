import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportProblem from './pages/ReportProblem';
import Issues from './pages/Issues';
import { mockIssues } from './utils/mockIssues';

export default function App() {
  const [issues, setIssues] = useState(mockIssues);

  function addIssue(form) {
    const newIssue = {
      ...form,
      id: 'XR-' + (1001 + issues.length),
      status: 'Reported',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setIssues([newIssue, ...issues]);
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home issues={issues} />} />
          <Route path="/report" element={<ReportProblem onAddIssue={addIssue} />} />
          <Route path="/issues" element={<Issues issues={issues} />} />
        </Routes>
      </main>
    </>
  );
}