// Builds the iframe src for a checkout URL.
//
// embed=true      — required; turns on postMessage events and embed styling
// style=<JSON>    — optional theme: { variables, rules, showPoweredBy }
// fields_only=true — optional; render only the payment fields (no summary)
//
// `style` and `fields_only` only take effect when the page is actually inside an iframe —
// opening the same URL in its own tab always shows the default, full checkout.
export function buildEmbedUrl(url, { style, fieldsOnly } = {}) {
  const src = new URL(url);
  src.searchParams.set('embed', 'true');

  if (style) src.searchParams.set('style', JSON.stringify(style));
  else src.searchParams.delete('style');

  if (fieldsOnly) src.searchParams.set('fields_only', 'true');
  else src.searchParams.delete('fields_only');

  return src.toString();
}

// Returns an error message for anything `new URL` can't parse, or null when valid.
export function validateCheckoutUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:' ? null : 'URL must start with http(s)://';
  } catch {
    return 'Enter a full URL, e.g. https://app.sandbox.advancehq.com/checkout/abc_123';
  }
}

// The tester mirrors its own state into its page URL so a styled setup is a shareable link.
export function readTesterState() {
  const params = new URLSearchParams(window.location.search);
  return {
    url: params.get('url') || '',
    styleText: params.get('style') || '',
    fieldsOnly: params.get('fields_only') === 'true',
  };
}

export function writeTesterState({ url, style, fieldsOnly }) {
  const params = new URLSearchParams();
  if (url) params.set('url', url);
  if (style) params.set('style', JSON.stringify(style));
  if (fieldsOnly) params.set('fields_only', 'true');
  const query = params.toString();
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
}
