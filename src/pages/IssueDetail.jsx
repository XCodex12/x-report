import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { fetchHistory, setIssueStatus } from '../lib/api';
import { STATUSES, STATUS_COLORS } from '../utils/constants';

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function IssueDetail({ issues, confirmedIds, onConfirm, onStatusChange }) {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const issue = issues.find((i) => i.id === id);
  const dbId = issue?.dbId;
  const currentStatus = issue?.status;

  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!dbId) return;
    let cancelled = false;
    fetchHistory(dbId)
      .then((rows) => {
        if (cancelled) return;
        setHistory(rows);
        setHistoryError('');
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setHistoryError('Could not load the history.');
      });
    return () => {
      cancelled = true;
    };
  }, [dbId, currentStatus]);

  if (!issue) {
    return (
      <section className="container page-head">
        <Link to="/issues" className="back">Back to all problems</Link>
        <h1>Report not found</h1>
        <p className="lead">This report does not exist, or it may have been removed.</p>
      </section>
    );
  }

  const isOwn = Boolean(user && issue.userId === user.id);
  const confirmed = confirmedIds.includes(issue.id);
  let confirmLabel = 'Confirm';
  if (isOwn) confirmLabel = 'Yours';
  else if (confirmed) confirmLabel = 'Confirmed';

  let resolvedDays = null;
  if (issue.resolvedAt) {
    resolvedDays = Math.max(
      0,
      Math.round((new Date(issue.resolvedAt) - new Date(issue.createdAt)) / 86400000)
    );
  }

  async function handleStatusSubmit(e) {
    e.preventDefault();
    const target = newStatus || issue.status;
    if (target === issue.status && !note.trim()) {
      setError('Choose a different status or add a note.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await setIssueStatus(issue.dbId, target, note);
      onStatusChange(issue.id, target);
      setNote('');
      setNewStatus('');
    } catch (err) {
      console.error(err);
      setError('Could not update the status. ' + (err.message || ''));
    }
    setSaving(false);
  }

  return (
    <>
      <section className="container page-head">
        <Link to="/issues" className="back">Back to all problems</Link>
        <h1>{issue.title}</h1>
        <div className="detail-badges">
          <StatusBadge status={issue.status} />
          {resolvedDays !== null && (
            <span className="tag tag-live">
              Resolved in {resolvedDays} {resolvedDays === 1 ? 'day' : 'days'}
            </span>
          )}
          {issue.demo && <span className="tag">Sample data</span>}
        </div>
      </section>

      <section className="container detail">
        <div>
          <p className="detail-desc">{issue.description}</p>

          <dl className="facts">
            <div><dt>Report</dt><dd>{issue.id}</dd></div>
            <div><dt>Type</dt><dd>{issue.category}</dd></div>
            <div><dt>Severity</dt><dd>{issue.severity}</dd></div>
            <div><dt>Area</dt><dd>{issue.location}</dd></div>
            <div><dt>Reported</dt><dd>{issue.createdAt}</dd></div>
          </dl>

          <h2>Progress</h2>
          {historyError && <div className="notice notice-error">{historyError}</div>}
          <ol className="timeline">
            {history.map((h) => (
              <li key={h.id} style={{ '--c': STATUS_COLORS[h.status] }}>
                <strong>{h.status}</strong>
                <time dateTime={h.created_at}>{formatDateTime(h.created_at)}</time>
                {h.note && <p>{h.note}</p>}
              </li>
            ))}
          </ol>

          {isAdmin && (
            <form onSubmit={handleStatusSubmit} className="form admin-box">
              <h2>Update status</h2>
              {error && <div className="notice notice-error" role="alert">{error}</div>}
              <label>
                New status
                <select value={newStatus || issue.status} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>
                Note <span className="hint">(optional, shown on the timeline)</span>
                <textarea rows="3" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Saving...' : 'Update status'}
              </button>
            </form>
          )}
        </div>

        <aside>
          <div className="side-confirm">
            <button
              type="button"
              className={'confirm' + (confirmed ? ' is-on' : '')}
              onClick={() => onConfirm(issue.id)}
              disabled={isOwn}
              aria-pressed={confirmed}
            >
              <span className="confirm-count">{issue.confirmations}</span>
              <span className="confirm-label">{confirmLabel}</span>
            </button>
            <p className="fine">
              {isOwn
                ? 'This is your report. Neighbours can confirm it.'
                : 'Confirm this if you can see the problem yourself.'}
            </p>
          </div>
          <MapView issues={[issue]} center={[issue.lat, issue.lng]} zoom={15} height={320} />
        </aside>
      </section>
    </>
  );
}