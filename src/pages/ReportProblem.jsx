import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import { CATEGORIES, SEVERITIES } from '../utils/constants';
import { distanceMeters } from '../utils/geo';

export default function ReportProblem({ issues, confirmedIds, onAddIssue, onConfirm }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0].name,
    severity: 'Medium',
    location: '',
  });
  const [picked, setPicked] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const nearby = useMemo(() => {
    if (!picked) return [];
    return issues
      .filter((i) => i.category === form.category && i.status !== 'Resolved')
      .map((issue) => ({ issue, dist: distanceMeters(picked, issue) }))
      .filter((x) => x.dist <= 200)
      .sort((a, b) => a.dist - b.dist);
  }, [issues, picked, form.category]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setError('Your browser does not support location. Click the map to place your pin.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError('');
        setPicked({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError('Could not get your location. Click the map to place your pin instead.')
    );
  }

  function confirmExisting(id) {
    if (!confirmedIds.includes(id)) onConfirm(id);
    navigate('/issues');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    if (title.length < 3 || title.length > 120) {
      setError('The title needs 3 to 120 characters.');
      return;
    }
    if (description.length < 5 || description.length > 1000) {
      setError('The description needs 5 to 1000 characters.');
      return;
    }
    if (!picked) {
      setError('Click the map to place a pin where the problem is.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onAddIssue({
        ...form,
        title,
        description,
        location: form.location.trim().slice(0, 120) || 'Pinned location',
        lat: picked.lat,
        lng: picked.lng,
      });
      navigate('/issues');
    } catch (err) {
      console.error(err);
      setError('Could not submit your report. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="container page-head">
        <h1>Report a problem</h1>
        <p className="lead">Pin it on the map, describe it, and we'll check whether it's already been reported.</p>
      </section>

      <section className="container split">
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="notice notice-error" role="alert">{error}</div>}

          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} placeholder="Deep pothole in the left lane" />
          </label>

          <label>
            What's wrong?
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          </label>

          <div className="row">
            <label>
              Type
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <label>
              Severity
              <select name="severity" value={form.severity} onChange={handleChange}>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label>
            Area or landmark <span className="hint">(optional)</span>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Next to the Spar, Durban North" />
          </label>

          {nearby.length > 0 && (
            <div className="notice notice-warn">
              <strong>This may already be reported</strong>
              <p>Open {form.category.toLowerCase()} problems within 200 m of your pin:</p>
              {nearby.map(({ issue, dist }) => (
                <div className="dup" key={issue.id}>
                  <span>{issue.title}, {Math.round(dist)} m away</span>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => confirmExisting(issue.id)}>
                    Confirm this one
                  </button>
                </div>
              ))}
              <p className="fine">If yours is a different problem, submit as normal.</p>
            </div>
          )}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit report'}
          </button>
        </form>

        <div>
          <div className="map-tools">
            <button type="button" className="btn btn-outline btn-sm" onClick={locateMe}>Use my location</button>
            <span className="pick-readout">
              {picked ? `Pin placed at ${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)}` : 'Or click the map to place your pin.'}
            </span>
          </div>
          <MapView issues={issues} height={460} onPick={setPicked} picked={picked} scrollZoom />
        </div>
      </section>
    </>
  );
}
