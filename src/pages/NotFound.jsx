import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container page-head">
      <h1>Page not found</h1>
      <p className="lead">That page doesn't exist. It may have moved, or the link may be wrong.</p>
      <div className="actions">
        <Link to="/" className="btn">Back to the home page</Link>
        <Link to="/issues" className="btn btn-outline">Browse reported problems</Link>
      </div>
    </section>
  );
}