// Creates an embedded Advance checkout iframe and listens for postMessage events.
//
// Usage:
//   const checkout = createCheckout({
//     containerEl: document.getElementById('checkout'),
//     onSuccess: (payload) => console.log('Paid!', payload),
//     onError:   (payload) => console.error('Failed', payload),
//   });
//   checkout.load('https://app.sandbox.advancehq.com/checkout/eTqo4dDFVG', {
//     style: { variables: { colorPrimary: '#2563EB' } }, // optional theme
//     fieldsOnly: true,                                  // optional: payment fields only
//   });
//
//   // Later, to clean up:
//   checkout.destroy();
//
export function createCheckout({ containerEl, onReady, onSuccess, onError, onSettled }) {
  const callbacks = {
    ready: onReady || null,
    success: onSuccess || null,
    error: onError || null,
    settled: onSettled || null,
  };

  let iframe = null;
  let origin = null;

  // Listen for postMessage events from the iframe.
  // The checkout sends messages shaped like:
  //   { type: "advance.checkout.success", payload: { ... } }
  function handleMessage(event) {
    if (event.origin !== origin) return;

    const data = event.data;
    if (!data || typeof data.type !== 'string') return;
    if (!data.type.startsWith('advance.checkout.')) return;

    const eventName = data.type.replace('advance.checkout.', '');
    const callback = callbacks[eventName];

    if (callback) {
      callback(data.payload);
    }
  }

  window.addEventListener('message', handleMessage);

  // Load a checkout URL into the iframe. Sets embed=true, plus style=<JSON> and
  // fields_only=true when given. Call load() again with new options to re-render.
  function load(url, { style, fieldsOnly } = {}) {
    if (iframe) {
      iframe.remove();
    }

    const src = new URL(url);
    src.searchParams.set('embed', 'true');
    if (style) src.searchParams.set('style', JSON.stringify(style));
    if (fieldsOnly) src.searchParams.set('fields_only', 'true');
    origin = src.origin;

    iframe = document.createElement('iframe');
    iframe.src = src.toString();
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('title', 'Advance Checkout');

    containerEl.appendChild(iframe);
  }

  // Remove the iframe and stop listening for events.
  function destroy() {
    window.removeEventListener('message', handleMessage);
    if (iframe) {
      iframe.remove();
      iframe = null;
    }
  }

  return { load, destroy };
}
