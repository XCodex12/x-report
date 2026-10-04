import { useMemo, useState } from 'react';
import MapView from '../components/MapView';
import { CATEGORIES } from '../utils/constants';

export default function MapPage({ issues }) {
  const [active, setActive] = useState([]);

  const shown = useMemo(
    () => (active.length === 0 ? issues : issues.filter((i) => active.includes(i.category))),
    [issues, active]
  );

  function toggle(name) {
    setActive(active.includes(name) ? active.filter((n) => n !== name) : [...active, name]);
  }

  return (
    <>
      <section className="container page-head">
        <h1>Live map</h1>
        <p className="lead">Every reported problem, coloured by type. Select a pin for details.</p>
      </section>

      <section className="container map-page">
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              className={'chip' + (active.includes(c.name) ? ' is-on' : '')}
              style={{ '--c': c.color }}
              aria-pressed={active.includes(c.name)}
              onClick={() => toggle(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="fine">Showing {shown.length} of {issues.length} problems.</p>
        <MapView issues={shown} height={580} scrollZoom />
      </section>
    </>
  );
}