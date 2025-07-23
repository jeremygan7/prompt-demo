import { useState } from 'react'
import './App.css'

interface EvaluationResponse {
  message: string;
  score: number;
  intent: 'High' | 'Medium' | 'Low';
}

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const capturedKeywords = keywords
      .split(',')
      .map(function (k) { return k.trim(); })
      .filter(function (k) { return k.length > 0; });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, capturedKeywords })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Server error: ' + res.status);
        }
        return res.json();
      })
      .then(function (data: EvaluationResponse) {
        setResult(data);
      })
      .catch(function (err) {
        setError(err.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Prompting LLM Demo</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label><br />
          <input
            type="text"
            value={name}
            onChange={function (e) { setName(e.target.value); }}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={function (e) { setEmail(e.target.value); }}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Keywords (comma-separated)</label><br />
          <input
            type="text"
            value={keywords}
            onChange={function (e) { setKeywords(e.target.value); }}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
            style={{
              padding: '0.75rem 2.5rem',
              minWidth: '140px',
              width: 'auto',
              cursor: 'pointer',
              display: 'block',
              margin: '1.5rem auto 0 auto',
              background: '#222',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem'
            }}
          >
          {loading ? 'Processing...' : 'Submit Lead'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}

      {result && (
          <div
          style={{
            marginTop: '2rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '80%',
            background: '#23272f',
            color: '#fff',
            borderRadius: '18px',
            boxShadow: '0 4px 32px #0007',
            padding: '2.5rem 1rem',
            textAlign: 'center',
          }}
          >
          <p><strong>{result.message}</strong></p>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Intent:</strong> {result.intent}</p>
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '2rem',
        zIndex: 1000
      }}>
        <button
          style={{
            padding: '0.4em 1.2em',
            background: '#1a8cff',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: '1em',
            boxShadow: '0 2px 12px #0005',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/leads`, '_blank')}
        >
          View Leads
        </button>
      </div>
    </div>
    
  );
}

export default App
