import { useState } from 'react';
import CheckoutEmbed from './CheckoutEmbed.jsx';
import EventLog from './EventLog.jsx';

export default function App() {
  const [path, setPath] = useState('');
  const [url, setUrl] = useState(null);
  const [events, setEvents] = useState([]);

  function addEvent(type, payload) {
    setEvents((prev) => [
      { type, payload, time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
      ...prev,
    ]);
  }

  function handleLoad() {
    const trimmed = path.trim();
    if (!trimmed) return;
    setUrl(trimmed);
    addEvent('ready', { message: `Loading ${trimmed}…` });
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Advance Checkout Embed</h1>
        <p style={styles.subtitle}>Enter a payment path and click Load to embed the checkout.</p>
      </header>

      <div style={styles.controls}>
        <input
          style={styles.input}
          type="text"
          placeholder="/pay/req_abc123"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
        />
        <button style={styles.button} onClick={handleLoad}>
          Load
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.checkoutPanel}>
          {url ? (
            <CheckoutEmbed
              url={url}
              onReady={(payload) => addEvent('ready', payload)}
              onSuccess={(payload) => addEvent('success', payload)}
              onError={(payload) => addEvent('error', payload)}
              onSettled={(payload) => addEvent('settled', payload)}
            />
          ) : (
            <p style={styles.placeholder}>
              Checkout iframe will appear here.
              <br />
              Enter a path above and click <strong>Load</strong>.
            </p>
          )}
        </div>

        <EventLog events={events} onClear={() => setEvents([])} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    minHeight: '100vh',
    background: '#f8fafc',
    color: '#1e293b',
    margin: 0,
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  title: { fontSize: 20, fontWeight: 600, margin: 0 },
  subtitle: { color: '#64748b', fontSize: 14, marginTop: 4 },
  controls: {
    display: 'flex',
    gap: 8,
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
  },
  button: {
    padding: '8px 20px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    height: 'calc(100vh - 130px)',
  },
  checkoutPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  placeholder: { color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 1.6 },
};
