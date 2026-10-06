import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { user, authLoading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not update your password. Please try again.');
    }
    setBusy(false);
  }

  let body;
  if (authLoading) {
    body = <p className="lead">Loading...</p>;
  } else if (done) {
    body = (
      <div className="notice notice-ok" role="status">
        Your password has been updated. <Link to="/issues">Go to the problems list</Link>.
      </div>
    );
  } else if (!user) {
    body = (
      <div className="notice">
        This link has expired or has already been used.{' '}
        <Link to="/forgot-password">Request a new reset link</Link>.
      </div>
    );
  } else {
    body = (
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        <label>
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label>
          Repeat new password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Please wait...' : 'Save new password'}
        </button>
      </form>
    );
  }

  return (
    <>
      <section className="container page-head">
        <h1>Choose a new password</h1>
      </section>
      <section className="container">
        <div className="auth">{body}</div>
      </section>
    </>
  );
}