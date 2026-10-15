import { useEffect, useRef } from 'react';
import { buildEmbedUrl } from './embedUrl.js';


// Renders an Advance checkout iframe and forwards postMessage events as callbacks.
//
// <CheckoutEmbed
//   url="https://app.sandbox.advancehq.com/checkout/abc_123"
//   style={{ variables: { colorPrimary: '#2563EB' } }}   // optional theme
//   fieldsOnly                                             // optional: payment fields only
//   onSuccess={(payload) => console.log('Paid!', payload)}
//   onError={(payload) => console.error('Failed', payload)}
// />
//
// The `ready` payload includes `style_warnings` when parts of `style` were rejected.
//
export default function CheckoutEmbed({ url, style, fieldsOnly, onReady, onSuccess, onError, onSettled }) {
  const containerRef = useRef(null);
  const callbacksRef = useRef({});
  callbacksRef.current = { ready: onReady, success: onSuccess, error: onError, settled: onSettled };

  const src = buildEmbedUrl(url, { style, fieldsOnly });

  useEffect(() => {
    const container = containerRef.current;

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('title', 'Advance Checkout');
    container.appendChild(iframe);

    // Listen for postMessage events from the iframe.
    // The checkout sends messages shaped like:
    //   { type: "advance.checkout.success", payload: { ... } }
    const iframeOrigin = new URL(src).origin;

    function handleMessage(event) {
      if (event.origin !== iframeOrigin) return;

      const data = event.data;
      if (!data || typeof data.type !== 'string') return;
      if (!data.type.startsWith('advance.checkout.')) return;

      const eventName = data.type.replace('advance.checkout.', '');
      const callback = callbacksRef.current[eventName];
      if (callback) callback(data.payload);
    }

    window.addEventListener('message', handleMessage);

    // Cleanup on unmount or when the URL, style or layout changes
    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    };
  }, [src]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
