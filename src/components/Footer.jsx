export default function Footer({ onReset }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>X - Report is an open-source project in early development.</p>
        <button type="button" className="link-btn" onClick={onReset}>
          Reset demo data
        </button>
      </div>
    </footer>
  );
}