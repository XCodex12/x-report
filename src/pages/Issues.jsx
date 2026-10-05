import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import IssueRow from '../components/IssueRow';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, STATUSES, SEVERITIES } from '../utils/constants';

export default function Issues({ issues, confirmedIds, onConfirm }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');
  const [mineOnly, setMineOnly] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = issues.filter(
      (i) =>
        (category === 'All' || i.category === category) &&
        (status === 'All' || i.status === status) &&
        (!mineOnly || (user && i.userId === user.id)) &&
        (!q || (i.title + ' ' + i.description + ' ' + i.location + ' ' + i.id).toLowerCase().includes(q))
    );
    list.sort((a, b) => {
      if (sort === 'confirmed') return b.confirmations - a.confirmations;
      if (sort === 'severity') return SEVERITIES.indexOf(b.severity) - SEVERITIES.indexOf(a.severity);
      return b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id);
    });
    return list;
  }, [issues, query, category, status, sort, mineOnly, user]);

  return (
    <>
      <section className="container page-head">
        <h1>Reported problems</h1>
        <p className="lead">Confirm the ones you can see for yourself. Confirmed reports rise to the top.</p>
      </section>

      <section className="container">
        <div className="filters">
          <input
            type="search"
            placeholder="Search by title, area or report number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search problems"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by type">
            <option value="All">All types</option>
            {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="All">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="confirmed">Most confirmed</option>
            <option value="severity">Highest severity</option>
          </select>
          {user && (
            <label className="check">
              <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
              Only my reports
            </label>
          )}
        </div>

        <p className="fine">Showing {shown.length} of {issues.length} problems.</p>

        {shown.length === 0 ? (
          <div className="notice">
            <p>No problems match these filters. Clear the search, or <Link to="/report">report a new problem</Link>.</p>
          </div>
        ) : (
          <div className="list">
            {shown.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                confirmed={confirmedIds.includes(issue.id)}
                isOwn={Boolean(user && issue.userId === user.id)}
                onConfirm={onConfirm}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}