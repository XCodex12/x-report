import { CATEGORIES, STATUSES, STATUS_COLORS, SEVERITIES } from '../utils/constants';

const SEVERITY_COLORS = { Low: '#4E9F3D', Medium: '#E58A00', High: '#D8352A' };

function Bars({ rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="bars">
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <span className="bar-label">{r.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: (r.value / max) * 100 + '%', background: r.color }} />
          </div>
          <span className="bar-value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatDays(days) {
  if (days < 1) return 'Under 1 day';
  return days.toFixed(1) + ' days';
}

export default function Insights({ issues }) {
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === 'Resolved').length;
  const urgent = issues.filter((i) => i.severity === 'High' && i.status !== 'Resolved').length;
  const rate = total ? Math.round((resolved / total) * 100) : 0;

  const timed = issues.filter((i) => i.resolvedAt);
  const avgDays = timed.length
    ? timed.reduce(
        (sum, i) => sum + Math.max(0, (new Date(i.resolvedAt) - new Date(i.createdAt)) / 86400000),
        0
      ) / timed.length
    : null;

  const byCategory = CATEGORIES.map((c) => ({
    label: c.name,
    color: c.color,
    value: issues.filter((i) => i.category === c.name).length,
  }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const byStatus = STATUSES.map((s) => ({
    label: s,
    color: STATUS_COLORS[s],
    value: issues.filter((i) => i.status === s).length,
  }));

  const bySeverity = SEVERITIES.map((s) => ({
    label: s,
    color: SEVERITY_COLORS[s],
    value: issues.filter((i) => i.severity === s).length,
  }));

  const areaCounts = {};
  issues.forEach((i) => {
    areaCounts[i.location] = (areaCounts[i.location] || 0) + 1;
  });
  const hotspots = Object.entries(areaCounts)
    .map(([label, value]) => ({ label, value, color: '#0F1C2E' }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      <section className="container page-head">
        <h1>Insights</h1>
        <p className="lead">What's being reported, how serious it is, and how much has been fixed.</p>
      </section>

      <section className="container">
        <div className="figures">
          <div><strong>{total}</strong><span>Reports</span></div>
          <div><strong>{urgent}</strong><span>Urgent and still open</span></div>
          <div><strong>{resolved}</strong><span>Resolved ({rate}% of all reports)</span></div>
          <div>
            <strong>{avgDays === null ? 'n/a' : formatDays(avgDays)}</strong>
            <span>
              {avgDays === null
                ? 'Average time to resolve (needs a resolved report)'
                : `Average time to resolve (${timed.length} ${timed.length === 1 ? 'report' : 'reports'})`}
            </span>
          </div>
        </div>

        <div className="panels">
          <div className="panel"><h2>By type</h2><Bars rows={byCategory} /></div>
          <div className="panel"><h2>By status</h2><Bars rows={byStatus} /></div>
          <div className="panel"><h2>By severity</h2><Bars rows={bySeverity} /></div>
          <div className="panel"><h2>Areas with the most reports</h2><Bars rows={hotspots} /></div>
        </div>
      </section>
    </>
  );
}