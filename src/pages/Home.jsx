import { Link } from 'react-router-dom';

export default function Home({ issues }) {
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === 'Resolved').length;
  const inProgress = total - resolved;

  return (
    <section>
      <h1>See a problem? Report it. Track it.</h1>
      <p className="lead">
        X - Report turns community problems into one clear, trackable record.
      </p>
      <Link to="/report" className="btn">Report a problem</Link>

      <div className="stats">
        <div className="stat"><strong>{total}</strong><span>Total reports</span></div>
        <div className="stat"><strong>{inProgress}</strong><span>Open</span></div>
        <div className="stat"><strong>{resolved}</strong><span>Resolved</span></div>
      </div>
    </section>
  );
}