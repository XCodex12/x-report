import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Enter the email address you signed up with.');
      return;
    }
    setBusy(true);
    try {
      await requestPasswordReset(cleanEmail);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send the email. Please try again.');
    }
    setBusy(false);
  }

  return (
    <>
      <section className="container page-head">
        <h1>Reset your password</h1>
        <p className="lead">Enter your email and we'll send you a link to choose a new password.</p>
      </section>

      <section className="container">
        <div className="auth">
          {sent ? (
            <div className="notice notice-ok" role="status">
              If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              {error && <div className="notice notice-error" role="alert">{error}</div>}
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <button type="submit" className="btn" disabled={busy}>
                {busy ? 'Please wait...' : 'Send reset link'}
              </button>
            </form>
          )}
          <p className="auth-switch">
            <Link to="/login">Back to log in</Link>
          </p>
        </div>
      </section>
    </>
  );
}