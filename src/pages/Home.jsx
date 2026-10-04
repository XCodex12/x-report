import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import { STATUSES, STATUS_COLORS, STATUS_NOTES } from '../utils/constants';

const FEATURES = [
  { name: 'Live map', text: 'See every open problem near you, colour-coded by type.', state: 'live' },
  { name: 'Duplicate check', text: 'Pin a problem and we warn you if the same one is already reported within 200 m.', state: 'live' },
  { name: 'Neighbour confirmation', text: 'Confirm a report you can see for yourself. More confirmations, more credibility.', state: 'live' },
  { name: 'Insights', text: 'Totals, problem types and the areas with the most reports.', state: 'live' },
  { name: 'Photo evidence', text: 'Attach photos, and show before and after when a repair is done.', state: 'planned' },
  { name: 'Accounts', text: 'Sign in so reports and confirmations belong to real people.', state: 'planned' },
  { name: 'AI suggestions', text: 'Suggest a type and severity from a photo of the problem.', state: 'planned' },
  { name: 'Hotspot prediction', text: 'Flag areas where reports are rising before they become a crisis.', state: 'planned' },
];

const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export default function Home({ issues }) {
  const open = issues.filter((i) => i.status !== 'Resolved').length;
  const fixed = issues.length - open;
  const confirmations = issues.reduce((sum, i) => sum + i.confirmations, 0);
  const isDemo = issues.some((i) => i.demo);

  return (
    <>
      <section className="container hero">
        <div>
          <h1>Fix what's broken on your street.</h1>
          <p className="lead">
            Report potholes, leaks and outages in under a minute. Neighbours confirm them,
            everyone can watch the repair, and nothing gets lost.
          </p>
          <div className="actions">
            <Link to="/report" className="btn">Report a problem</Link>
            <Link to="/issues" className="btn btn-outline">Browse reported problems</Link>
          </div>
        </div>
        <div className="hero-map">
          <MapView issues={issues} height={470} />
        </div>
      </section>

      <section className="container now">
        <p className="now-line">
          Right now: <strong>{count(open, 'problem')}</strong> open, <strong>{fixed}</strong> fixed,
          and <strong>{count(confirmations, 'confirmation')}</strong> from neighbours.
        </p>
        {isDemo && (
          <p className="fine">
            This is demo data for Durban. Reports you add are saved only in this browser until the
            shared database is connected.
          </p>
        )}
      </section>

      <section className="container section">
        <h2>From first report to fixed</h2>
        <ol className="flow">
          {STATUSES.map((s, i) => (
            <li key={s} style={{ '--c': STATUS_COLORS[s] }}>
              <span className="flow-step">Step {i + 1}</span>
              <h3>{s}</h3>
              <p>{STATUS_NOTES[s]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <h2>What works today, and what's next</h2>
        <ul className="features">
          {FEATURES.map((f) => (
            <li key={f.name}>
              <div>
                <h3>{f.name}</h3>
                <p>{f.text}</p>
              </div>
              <span className={'tag tag-' + f.state}>{f.state === 'live' ? 'Live' : 'Planned'}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}