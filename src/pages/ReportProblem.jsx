import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, SEVERITIES } from '../utils/constants';

const emptyForm = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  severity: SEVERITIES[1],
  location: '',
};

export default function ReportProblem({ onAddIssue }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setError('Please fill in the title, description and location.');
      return;
    }
    onAddIssue(form);
    navigate('/issues');
  }

  return (
    <section>
      <h1>Report a problem</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}

        <label>Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>

        <label>Description
          <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
        </label>

        <label>Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>

        <label>Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label>Severity
          <select name="severity" value={form.severity} onChange={handleChange}>
            {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>

        <button type="submit" className="btn">Submit report</button>
      </form>
    </section>
  );
}