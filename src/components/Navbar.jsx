import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">X - Report</NavLink>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/report">Report a problem</NavLink>
        <NavLink to="/issues">Issues</NavLink>
      </nav>
    </header>
  );
}