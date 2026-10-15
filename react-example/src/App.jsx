import { useEffect, useMemo, useState } from 'react';
import CheckoutEmbed from './CheckoutEmbed.jsx';
import EventLog from './EventLog.jsx';
import StylePanel from './StylePanel.jsx';
import { buildEmbedUrl, readTesterState, validateCheckoutUrl, writeTesterState } from './embedUrl.js';

const STYLE_APPLY_DELAY_MS = 700;

function parseStyle(text) {
  if (!text.trim()) return { style: null, error: null };
  try {
    const style = JSON.parse(text);
    if (typeof style !== 'object' || style === null || Array.isArray(style)) {
      return { style: null, error: 'Style must be a JSON object.' };
    }
    return { style, error: null };
  } catch (e) {
    return { style: null, error: `Invalid JSON: ${e.message}` };
  }
}

function prettify(text) {
  const { style, error } = parseStyle(text);
  return style && !error ? JSON.stringify(style, null, 2) : text;
}

export default function App() {
  const initial = useMemo(readTesterState, []);
  const [urlDraft, setUrlDraft] = useState(initial.url);
  const [urlError, setUrlError] = useState(null);
  const [styleText, setStyleText] = useState(() => prettify(initial.styleText));
  const [fieldsOnly, setFieldsOnly] = useState(initial.fieldsOnly);
  const [loadedUrl, setLoadedUrl] = useState(() =>
    initial.url && !validateCheckoutUrl(initial.url) ? initial.url : null,
  );
  const [appliedStyle, setAppliedStyle] = useState(() => parseStyle(initial.styleText).style);
  const [styleWarnings, setStyleWarnings] = useState([]);
  const [events, setEvents] = useState([]);
  const [copied, setCopied] = useState(false);

  const { style: draftStyle, error: parseError } = useMemo(() => parseStyle(styleText), [styleText]);
  const styleLength = draftStyle ? JSON.stringify(draftStyle).length : 0;
  const embedUrl = loadedUrl ? buildEmbedUrl(loadedUrl, { style: appliedStyle, fieldsOnly }) : null;

  // Re-apply the style shortly after typing stops, but never with invalid JSON.
  useEffect(() => {
    if (parseError) return;
    const timer = setTimeout(() => setAppliedStyle(draftStyle), STYLE_APPLY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draftStyle, parseError]);

  useEffect(() => {
    writeTesterState({ url: loadedUrl, style: appliedStyle, fieldsOnly });
  }, [loadedUrl, appliedStyle, fieldsOnly]);

  // Every new iframe src is a fresh load; the next `ready` event reports its warnings.
  useEffect(() => setStyleWarnings([]), [embedUrl]);

  function addEvent(type, payload) {
    setEvents((prev) => [
      { type, payload, time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
      ...prev,
    ]);
  }

  function handleReady(payload) {
    setStyleWarnings(payload?.style_warnings || []);
    addEvent('ready', payload);
  }

  function handleLoad() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    const error = validateCheckoutUrl(trimmed);
    setUrlError(error);
    if (error) return;
    setLoadedUrl(trimmed);
    if (!parseError) setAppliedStyle(draftStyle);
    addEvent('ready', { message: `Loading ${trimmed}…` });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Advance Checkout Embed</h1>
        <p style={styles.subtitle}>
          Enter a checkout URL and click Load. Change the style or layout on the left. The embed and
          its URL update as you go.
        </p>
      </header>

      <div style={styles.controls}>
        <div style={styles.inputRow}>
          <input
            style={{ ...styles.input, ...(urlError && styles.inputError) }}
            type="text"
            placeholder="https://app.sandbox.advancehq.com/checkout/LIPb06QB48"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            aria-label="Checkout URL"
          />
          <button style={styles.button} onClick={handleLoad}>
            Load
          </button>
        </div>
        {urlError && <p style={styles.urlError}>{urlError}</p>}

        {embedUrl && (
          <div style={styles.embedUrlRow}>
            <span style={styles.embedUrlLabel}>iframe src</span>
            <code style={styles.embedUrl} title={embedUrl}>{embedUrl}</code>
            <button style={styles.secondaryButton} onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      <div style={styles.main}>
        <StylePanel
          style={draftStyle}
          styleText={styleText}
          onStyleTextChange={setStyleText}
          parseError={parseError}
          styleLength={styleLength}
          styleWarnings={styleWarnings}
          fieldsOnly={fieldsOnly}
          onFieldsOnlyChange={setFieldsOnly}
        />

        <div style={styles.checkoutPanel}>
          {loadedUrl ? (
            <CheckoutEmbed
              url={loadedUrl}
              style={appliedStyle}
              fieldsOnly={fieldsOnly}
              onReady={handleReady}
              onSuccess={(payload) => addEvent('success', payload)}
              onError={(payload) => addEvent('error', payload)}
              onSettled={(payload) => addEvent('settled', payload)}
            />
          ) : (
            <p style={styles.placeholder}>
              Checkout iframe will appear here.
              <br />
              Enter a URL above and click <strong>Load</strong>.
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
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
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
    flexDirection: 'column',
    gap: 8,
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
  },
  inputRow: { display: 'flex', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
  },
  inputError: { borderColor: '#ef4444' },
  urlError: { color: '#dc2626', fontSize: 12 },
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
  embedUrlRow: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  embedUrlLabel: { fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' },
  embedUrl: {
    flex: 1,
    minWidth: 0,
    padding: '6px 10px',
    background: '#f1f5f9',
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  secondaryButton: {
    padding: '4px 10px',
    fontSize: 12,
    background: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#64748b',
  },
  main: {
    flex: 1,
    minHeight: 0,
    display: 'grid',
    gridTemplateColumns: '360px 1fr 340px',
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
