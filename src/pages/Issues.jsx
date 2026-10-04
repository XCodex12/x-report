import IssueCard from '../components/IssueCard';

export default function Issues({ issues }) {
  return (
    <section>
      <h1>Reported problems</h1>
      {issues.length === 0 ? (
        <p>No problems reported yet.</p>
      ) : (
        <div className="grid">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </section>
  );
}