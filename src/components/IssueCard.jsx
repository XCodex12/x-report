import StatusBadge from './StatusBadge';

export default function IssueCard({ issue }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="issue-id">{issue.id}</span>
        <StatusBadge status={issue.status} />
      </div>
      <h3>{issue.title}</h3>
      <p>{issue.description}</p>
      <div className="meta">
        <span>📍 {issue.location}</span>
        <span>🏷️ {issue.category}</span>
        <span>⚠️ {issue.severity}</span>
        <span>🗓️ {issue.createdAt}</span>
      </div>
    </article>
  );
}