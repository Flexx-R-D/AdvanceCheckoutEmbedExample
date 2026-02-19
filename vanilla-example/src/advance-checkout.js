// Creates an embedded Advance checkout iframe and listens for postMessage events.
//
// Usage:
//   const checkout = createCheckout({
//     containerEl: document.getElementById('checkout'),
//     onSuccess: (payload) => console.log('Paid!', payload),
//     onError:   (payload) => console.error('Failed', payload),
//   });
//   checkout.load('https://app-sandbox.advancehq.com/checkout/eTqo4dDFVG');
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

  // Load a checkout URL into the iframe (appends ?embed=true automatically).
  function load(url) {
    if (iframe) {
      iframe.remove();
    }

    origin = new URL(url).origin;
    const separator = url.includes('?') ? '&' : '?';

    iframe = document.createElement('iframe');
    iframe.src = url + separator + 'embed=true';
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
