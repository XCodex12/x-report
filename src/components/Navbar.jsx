import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

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
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user" title={user.email}>{user.email}</span>
              <button type="button" className="link-btn" onClick={signOut}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="nav-login">Log in</Link>
          )}
          <Link to="/report" className="btn btn-sm">Report a problem</Link>
        </div>
      </div>
    </header>
  );
}