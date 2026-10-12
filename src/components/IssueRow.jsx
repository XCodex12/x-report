import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { categoryMeta, STATUSES } from '../utils/constants';

export default function IssueRow({ issue, confirmed, isOwn, onConfirm }) {
  const meta = categoryMeta(issue.category);
  const step = STATUSES.indexOf(issue.status);
  const thumbs = (issue.photos || []).filter((p) => p.kind === 'report');

  let label = 'Confirm';
  if (isOwn) label = 'Yours';
  else if (confirmed) label = 'Confirmed';

  return (
    <article className="issue" style={{ '--c': meta.color }}>
      <button
        type="button"
        className={'confirm' + (confirmed ? ' is-on' : '')}
        onClick={() => onConfirm(issue.id)}
        disabled={isOwn}
        aria-pressed={confirmed}
        title={isOwn ? 'You cannot confirm your own report' : undefined}
        aria-label={isOwn ? 'Your own report' : confirmed ? 'Remove your confirmation' : 'Confirm this problem'}
      >
        <span className="confirm-count">{issue.confirmations}</span>
        <span className="confirm-label">{label}</span>
      </button>

      <div className="issue-body">
        <div className="issue-head">
          <h3><Link to={'/issues/' + issue.id}>{issue.title}</Link></h3>
          <StatusBadge status={issue.status} />
        </div>
        <p>{issue.description}</p>

        {thumbs.length > 0 && (
          <Link to={'/issues/' + issue.id} className="thumbs" aria-label="View photos of this problem">
            {thumbs.map((p) => (
              <img key={p.id} src={p.url} alt="" loading="lazy" />
            ))}
          </Link>
        )}

        <dl className="facts">
          <div><dt>Report</dt><dd>{issue.id}</dd></div>
          <div><dt>Type</dt><dd>{issue.category}</dd></div>
          <div><dt>Severity</dt><dd>{issue.severity}</dd></div>
          <div><dt>Area</dt><dd>{issue.location}</dd></div>
          <div><dt>Reported</dt><dd>{issue.createdAt}</dd></div>
        </dl>
        <div className="progress" role="img" aria-label={'Status: ' + issue.status}>
          {STATUSES.map((s, i) => (
            <span key={s} className={i <= step ? 'on' : ''} />
          ))}
        </div>
      </div>
    </article>
  );
}