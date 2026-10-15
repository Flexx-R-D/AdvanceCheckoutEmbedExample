import { ColorField, FontFamilyField, FontWeightField, PxField } from './StyleControls.jsx';
import Toggle from './Toggle.jsx';
import {
  COMPONENTS,
  DEFAULT_VARIABLE_VALUES,
  FONT_FAMILIES,
  MAX_STYLE_LENGTH,
  MODIFIERS,
  PRESETS,
  PROPERTIES,
  PSEUDOS,
  QUICK_RULES,
  RULE_NOTES,
  THEME_COLORS,
  VARIABLES,
} from './styleReference.js';

const FIELD_LABELS = {
  backgroundColor: 'Background',
  color: 'Text',
  borderRadius: 'Corner radius',
  fontWeight: 'Weight',
  fontSize: 'Font size',
};

// Returns a copy of `style` with the value at `path` set, or removed when `value` is undefined.
// Objects left empty by a removal are pruned so the JSON stays minimal.
function setStyleValue(style, path, value) {
  const next = structuredClone(style || {});
  const parents = [next];
  let node = next;
  path.slice(0, -1).forEach((key) => {
    if (typeof node[key] !== 'object' || node[key] === null) node[key] = {};
    node = node[key];
    parents.push(node);
  });

  const leaf = path[path.length - 1];
  if (value === undefined) delete node[leaf];
  else node[leaf] = value;

  for (let i = path.length - 2; i >= 0; i--) {
    if (Object.keys(parents[i + 1]).length === 0) delete parents[i][path[i]];
  }
  return next;
}

// Visual editor for the checkout's `style` param (plus the `fields_only` layout switch), backed by the JSON text so both views stay
// in sync. Server-side warnings (from the `ready` event) show at the top for quick iteration.
export default function StylePanel({
  style,
  styleText,
  onStyleTextChange,
  parseError,
  styleLength,
  styleWarnings,
  fieldsOnly,
  onFieldsOnlyChange,
}) {
  const isTooLong = styleLength > MAX_STYLE_LENGTH;
  const variables = style?.variables || {};
  const rules = style?.rules || {};

  function setValue(path, value) {
    const next = setStyleValue(style, path, value);
    onStyleTextChange(Object.keys(next).length ? JSON.stringify(next, null, 2) : '');
  }

  function applyPreset(name) {
    const preset = PRESETS[name];
    onStyleTextChange(preset ? JSON.stringify(preset, null, 2) : '');
  }

  function renderRuleField(selector, field) {
    const value = rules[selector]?.[field];
    const onChange = (next) => setValue(['rules', selector, field], next);
    const label = FIELD_LABELS[field];
    switch (field) {
      case 'fontWeight':
        return <FontWeightField key={field} label={label} value={value} onChange={onChange} />;
      case 'fontSize':
        return <PxField key={field} label={label} value={value} min={10} max={48} onChange={onChange} />;
      case 'borderRadius':
        return <PxField key={field} label={label} value={value} min={0} max={40} onChange={onChange} />;
      default:
        return <ColorField key={field} label={label} value={value} onChange={onChange} />;
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <select
          style={styles.select}
          value=""
          onChange={(e) => applyPreset(e.target.value)}
          aria-label="Load a style preset"
        >
          <option value="" disabled>Start from preset…</option>
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name}>{name === 'None' ? 'None (reset)' : name}</option>
          ))}
        </select>
        <span style={isTooLong ? styles.error : styles.muted}>
          {styleLength.toLocaleString()} / {MAX_STYLE_LENGTH.toLocaleString()} chars
        </span>
      </div>

      {isTooLong && (
        <p style={{ ...styles.banner, ...styles.bannerError }}>
          Over the limit, so the checkout will ignore this style.
        </p>
      )}
      {parseError && (
        <p style={{ ...styles.banner, ...styles.bannerError }}>
          The JSON below is invalid. Fix it to keep editing visually.
        </p>
      )}
      {styleWarnings.length > 0 && (
        <div style={{ ...styles.banner, ...styles.bannerWarning }}>
          <strong>The checkout rejected part of this style:</strong>
          <ul style={styles.warningList}>
            {styleWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <fieldset disabled={!!parseError} style={styles.fieldset}>
        <section style={styles.section}>
          <h3 style={styles.title}>Theme</h3>
          {THEME_COLORS.map(({ name, label }) => (
            <ColorField
              key={name}
              label={label}
              value={variables[name]}
              placeholder={DEFAULT_VARIABLE_VALUES[name]}
              onChange={(value) => setValue(['variables', name], value)}
            />
          ))}
          <FontFamilyField
            value={variables.fontFamily}
            onChange={(value) => setValue(['variables', 'fontFamily'], value)}
          />
          <PxField
            label="Corner radius"
            value={variables.borderRadius}
            placeholder={DEFAULT_VARIABLE_VALUES.borderRadius}
            min={0}
            max={40}
            onChange={(value) => setValue(['variables', 'borderRadius'], value)}
          />
        </section>

        <section style={styles.section}>
          <h3 style={styles.title}>Components</h3>
          {QUICK_RULES.map(({ selector, label, fields }) => (
            <details key={selector} style={styles.rule}>
              <summary style={styles.ruleSummary}>
                {label} <code style={styles.code}>{selector}</code>
                {rules[selector] && <span style={styles.dot} title="Customized" />}
              </summary>
              <div style={styles.ruleFields}>
                {fields.map((field) => renderRuleField(selector, field))}
              </div>
            </details>
          ))}
          <p style={styles.muted}>Other components can be styled in the JSON below.</p>
        </section>

      </fieldset>

      <section style={styles.section}>
        <h3 style={styles.title}>Layout & branding</h3>
        <Toggle
          checked={fieldsOnly}
          onChange={onFieldsOnlyChange}
          label="Payment fields only"
          hint="Hides invoice details · fields_only=true"
        />
        <Toggle
          checked={style?.showPoweredBy !== false}
          onChange={(checked) => setValue(['showPoweredBy'], checked ? undefined : false)}
          label='Show "Powered by Advance"'
          disabled={!!parseError}
        />
      </section>

      <details style={styles.section}>
        <summary style={styles.summary}>JSON (advanced)</summary>
        <textarea
          style={{ ...styles.textarea, ...(parseError && styles.textareaError) }}
          value={styleText}
          onChange={(e) => onStyleTextChange(e.target.value)}
          placeholder={'{\n  "variables": { "colorPrimary": "#2563EB" },\n  "rules": { ".PayButton": { "fontWeight": "600" } }\n}'}
          spellCheck={false}
          aria-label="Style JSON"
        />
        {parseError && <p style={styles.error}>{parseError}</p>}
      </details>

      <details style={styles.section}>
        <summary style={styles.summary}>Style reference</summary>
        <StyleReference />
      </details>
    </div>
  );
}

function StyleReference() {
  return (
    <div style={styles.reference}>
      <p>
        Shape: <code style={styles.code}>{'{ variables, rules, showPoweredBy }'}</code>. Rule keys look
        like <code style={styles.code}>.Component</code>, <code style={styles.code}>.Component--modifier</code>{' '}
        and <code style={styles.code}>.Component:pseudo</code>.
      </p>

      <h4 style={styles.refHeading}>Variables</h4>
      <ul style={styles.refList}>
        {VARIABLES.map(({ name, hint }) => (
          <li key={name}><code style={styles.code}>{name}</code> — {hint}</li>
        ))}
      </ul>

      <h4 style={styles.refHeading}>Rule properties</h4>
      <ul style={styles.refList}>
        {PROPERTIES.map(({ name, hint }) => (
          <li key={name}><code style={styles.code}>{name}</code> — {hint}</li>
        ))}
      </ul>

      <h4 style={styles.refHeading}>Components</h4>
      <p style={styles.wrapList}>
        {COMPONENTS.map((name) => (
          <code key={name} style={styles.code}>.{name}</code>
        ))}
      </p>

      <h4 style={styles.refHeading}>Modifiers</h4>
      <ul style={styles.refList}>
        {Object.entries(MODIFIERS).map(([component, modifiers]) => (
          <li key={component}>
            {modifiers.map((modifier) => (
              <code key={modifier} style={styles.code}>.{component}--{modifier}</code>
            ))}
          </li>
        ))}
      </ul>

      <h4 style={styles.refHeading}>Pseudo-classes</h4>
      <p style={styles.wrapList}>
        {PSEUDOS.map((pseudo) => (
          <code key={pseudo} style={styles.code}>:{pseudo}</code>
        ))}
      </p>

      <h4 style={styles.refHeading}>Fonts</h4>
      <p>{FONT_FAMILIES.join(', ')}</p>

      <h4 style={styles.refHeading}>Notes</h4>
      <ul style={styles.refList}>
        {RULE_NOTES.map((note) => <li key={note}>{note}</li>)}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRight: '1px solid #e2e8f0',
    overflowY: 'auto',
    minHeight: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
  },
  fieldset: { border: 'none', margin: 0, padding: 0, minWidth: 0 },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: { fontSize: 13, fontWeight: 600, margin: '0 0 2px' },
  summary: { fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  select: {
    padding: '5px 8px',
    fontSize: 12,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    background: '#fff',
    color: '#1e293b',
  },
  rule: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' },
  ruleSummary: { fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  dot: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#2563eb',
    verticalAlign: 'middle',
  },
  ruleFields: { display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0 4px' },
  textarea: {
    width: '100%',
    minHeight: 220,
    marginTop: 8,
    padding: 10,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    color: '#1e293b',
  },
  textareaError: { borderColor: '#ef4444' },
  muted: { color: '#64748b', fontSize: 12 },
  error: { color: '#dc2626', fontSize: 12 },
  banner: { margin: '12px 16px 0', padding: '8px 10px', borderRadius: 8, fontSize: 12 },
  bannerError: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' },
  bannerWarning: { background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' },
  warningList: { margin: '6px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 2 },
  reference: { fontSize: 12, color: '#334155', lineHeight: 1.6 },
  refHeading: { fontSize: 12, fontWeight: 600, margin: '10px 0 4px' },
  refList: { marginLeft: 16 },
  wrapList: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  code: {
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: 11,
    background: '#f1f5f9',
    borderRadius: 4,
    padding: '1px 4px',
    marginRight: 4,
  },
};
