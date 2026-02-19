import { useEffect, useRef } from 'react';


// Renders an Advance checkout iframe and forwards postMessage events as callbacks.
//
// <CheckoutEmbed
//   url="https://app-sandbox.advancehq.com/checkout/abc_123"
//   onSuccess={(payload) => console.log('Paid!', payload)}
//   onError={(payload) => console.error('Failed', payload)}
// />
//
export default function CheckoutEmbed({ url, onReady, onSuccess, onError, onSettled }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Build the iframe URL
    const separator = url.includes('?') ? '&' : '?';
    const src = url + separator + 'embed=true';

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
    const callbacks = { ready: onReady, success: onSuccess, error: onError, settled: onSettled };

    function handleMessage(event) {
      if (event.origin !== origin) return;

      const data = event.data;
      if (!data || typeof data.type !== 'string') return;
      if (!data.type.startsWith('advance.checkout.')) return;

      const eventName = data.type.replace('advance.checkout.', '');
      const callback = callbacks[eventName];
      if (callback) callback(data.payload);
    }

    window.addEventListener('message', handleMessage);

    // Cleanup on unmount or when path changes
    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    };
  }, [url]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
