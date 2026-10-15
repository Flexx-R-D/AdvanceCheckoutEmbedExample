// A labelled on/off switch.
export default function Toggle({ checked, onChange, label, hint, disabled = false }) {
  return (
    <label style={{ ...styles.row, ...(disabled && styles.disabled) }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{ ...styles.track, ...(checked && styles.trackOn) }}
      >
        <span style={{ ...styles.thumb, ...(checked && styles.thumbOn) }} />
      </button>
      <span style={styles.label}>
        {label}
        {hint && <span style={styles.hint}>{hint}</span>}
      </span>
    </label>
  );
}

const styles = {
  row: { display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' },
  disabled: { opacity: 0.5, pointerEvents: 'none' },
  track: {
    position: 'relative',
    width: 36,
    height: 20,
    flexShrink: 0,
    borderRadius: 999,
    border: 'none',
    padding: 0,
    background: '#cbd5e1',
    cursor: 'pointer',
    transition: 'background 150ms',
  },
  trackOn: { background: '#2563eb' },
  thumb: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    transition: 'left 150ms',
  },
  thumbOn: { left: 18 },
  label: { display: 'flex', flexDirection: 'column', fontSize: 13, fontWeight: 500, lineHeight: 1.3 },
  hint: { fontSize: 11, fontWeight: 400, color: '#64748b', fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" },
};
