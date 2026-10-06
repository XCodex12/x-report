import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>X - Report is an open-source project in early development.</p>
        <p>
          <Link to="/privacy">Privacy policy</Link>
          {' '}
          Map data from OpenStreetMap contributors.
        </p>
      </div>
    </footer>
  );
}