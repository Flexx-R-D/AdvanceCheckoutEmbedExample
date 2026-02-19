const COLORS = {
  ready: '#3b82f6',   // blue
  success: '#22c55e', // green
  error: '#ef4444',   // red
  settled: '#6b7280', // gray
};

// Displays a scrollable list of timestamped, color-coded checkout events.
//
// <EventLog
//   events={[{ type: 'success', payload: { ... }, time: '14:30:00' }]}
//   onClear={() => setEvents([])}
// />
//
export default function EventLog({ events, onClear }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Event Log</h3>
        <button style={styles.clearBtn} onClick={onClear}>
          Clear
        </button>
      </div>

      <div style={styles.list}>
        {events.map((event, i) => (
          <div key={i} style={styles.entry}>
            <div style={styles.meta}>
              <span style={{ ...styles.badge, backgroundColor: COLORS[event.type] || '#6b7280' }}>
                {event.type}
              </span>
              <span style={styles.time}>{event.time}</span>
            </div>
            {event.payload !== undefined && (
              <pre style={styles.payload}>{JSON.stringify(event.payload, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: { fontSize: 14, fontWeight: 600, margin: 0 },
  clearBtn: {
    padding: '4px 10px',
    fontSize: 12,
    background: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#64748b',
  },
  list: { flex: 1, overflowY: 'auto', padding: 8 },
  entry: {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#f8fafc',
    marginBottom: 6,
  },
  meta: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: { fontSize: 12, color: '#64748b', fontVariantNumeric: 'tabular-nums' },
  payload: {
    marginTop: 8,
    padding: 8,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    fontSize: 12,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#1e293b',
    margin: '8px 0 0',
  },
};
