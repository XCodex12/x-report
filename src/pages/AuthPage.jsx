import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { user, signIn, signUp } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/issues';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (isSignup && password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (isSignup && !agreed) {
      setError('Please confirm that you have read the privacy policy.');
      return;
    }
    setBusy(true);
    try {
      if (isSignup) {
        const result = await signUp(cleanEmail, password);
        if (result.needsConfirmation) {
          setInfo('Account created. Check your email for a confirmation link, then log in.');
        }
      } else {
        await signIn(cleanEmail, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setBusy(false);
  }

  return (
    <>
      <section className="container page-head">
        <h1>{isSignup ? 'Create your account' : 'Log in'}</h1>
        <p className="lead">
          {isSignup
            ? 'An account lets you report problems and confirm the ones you can see.'
            : 'Log in to report problems and confirm reports from your neighbours.'}
        </p>
      </section>

      <section className="container">
        <div className="auth">
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="notice notice-error" role="alert">{error}</div>}
            {info && <div className="notice notice-ok" role="status">{info}</div>}

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </label>

            {isSignup && (
              <label className="consent">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>
                  I have read the <Link to="/privacy" target="_blank">privacy policy</Link> and understand that
                  my reports are public.
                </span>
              </label>
            )}

            <button type="submit" className="btn" disabled={busy}>
              {busy ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          {!isSignup && (
            <p className="auth-switch">
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          )}
          <p className="auth-switch">
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <Link to={isSignup ? '/login' : '/signup'} state={location.state}>
              {isSignup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}