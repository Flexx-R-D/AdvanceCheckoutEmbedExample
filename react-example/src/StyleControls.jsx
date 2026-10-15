import { FONT_FAMILIES, FONT_WEIGHTS } from './styleReference.js';

// Small form controls for the visual style editor. Each one edits a single style value;
// passing `undefined` to onChange removes the value so the checkout default applies.

const HEX6 = /^#[0-9a-f]{6}$/i;
const HEX3 = /^#[0-9a-f]{3}$/i;

function toPickerHex(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (HEX6.test(trimmed)) return trimmed;
  if (HEX3.test(trimmed)) return '#' + trimmed.slice(1).split('').map((c) => c + c).join('');
  return null;
}

export function ColorField({ label, value, placeholder, onChange }) {
  const pickerHex = toPickerHex(value) || toPickerHex(placeholder) || '#000000';
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={styles.control}>
        <input
          type="color"
          style={styles.swatch}
          value={pickerHex}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={`${label} color`}
        />
        <input
          type="text"
          style={styles.text}
          value={value || ''}
          placeholder={placeholder || 'default'}
          onChange={(e) => onChange(e.target.value || undefined)}
          spellCheck={false}
          aria-label={label}
        />
        <ClearButton visible={!!value} onClick={() => onChange(undefined)} />
      </div>
    </div>
  );
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={styles.control}>
        <select
          style={styles.select}
          value={value || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          aria-label={label}
        >
          <option value="">Default</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function FontFamilyField({ label = 'Font', value, onChange }) {
  return <SelectField label={label} value={value} options={FONT_FAMILIES} onChange={onChange} />;
}

export function FontWeightField({ label = 'Weight', value, onChange }) {
  return <SelectField label={label} value={value} options={FONT_WEIGHTS} onChange={onChange} />;
}

// Slider for px lengths. Values set elsewhere in rem stay untouched until the slider moves.
export function PxField({ label, value, placeholder, min, max, onChange }) {
  const px = value?.endsWith('px') ? Number.parseFloat(value) : null;
  const sliderValue = px ?? (placeholder?.endsWith('px') ? Number.parseFloat(placeholder) : min);
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={styles.control}>
        <input
          type="range"
          style={styles.range}
          min={min}
          max={max}
          value={Math.min(Math.max(sliderValue, min), max)}
          onChange={(e) => onChange(`${e.target.value}px`)}
          aria-label={label}
        />
        <span style={{ ...styles.value, ...(!value && styles.valueDefault) }}>
          {value || 'default'}
        </span>
        <ClearButton visible={!!value} onClick={() => onChange(undefined)} />
      </div>
    </div>
  );
}

function ClearButton({ visible, onClick }) {
  return (
    <button
      type="button"
      style={{ ...styles.clear, visibility: visible ? 'visible' : 'hidden' }}
      onClick={onClick}
      title="Reset to default"
      aria-label="Reset to default"
    >
      ×
    </button>
  );
}

const styles = {
  row: { display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'center', gap: 8 },
  label: { fontSize: 12, color: '#475569' },
  control: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
  swatch: {
    width: 28,
    height: 28,
    flexShrink: 0,
    padding: 0,
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background: 'none',
    cursor: 'pointer',
  },
  text: {
    flex: 1,
    minWidth: 0,
    padding: '5px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    outline: 'none',
    color: '#1e293b',
  },
  select: {
    flex: 1,
    padding: '5px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 12,
    background: '#fff',
    color: '#1e293b',
  },
  range: { flex: 1, minWidth: 0, accentColor: '#2563eb' },
  value: {
    width: 52,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    color: '#1e293b',
  },
  valueDefault: { color: '#94a3b8' },
  clear: {
    width: 20,
    height: 20,
    flexShrink: 0,
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 1,
    cursor: 'pointer',
  },
};
