import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="logo" aria-hidden="true" />
          X - Report
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/map">Live map</NavLink>
          <NavLink to="/issues">Problems</NavLink>
          <NavLink to="/insights">Insights</NavLink>
        </nav>
        <Link to="/report" className="btn btn-sm">Report a problem</Link>
      </div>
    </header>
  );
}