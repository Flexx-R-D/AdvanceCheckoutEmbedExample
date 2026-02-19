# Advance Checkout Embed Example

Examples showing how to embed the Advance checkout in your application using an iframe and handle all `postMessage` events.

## Examples

| Directory | Stack | How to run |
|-----------|-------|------------|
| `vanilla-example/` | Plain HTML + JS (no build tools) | `npm install && npm start` |
| `react-example/` | React 19 + Vite | `npm install && npm run dev` |

## Quick Start

### Vanilla

```bash
git clone https://github.com/Flexx-R-D/AdvanceCheckoutEmbedExample.git
cd AdvanceCheckoutEmbedExample/vanilla-example
npm install
npm start
```

### React

```bash
git clone https://github.com/Flexx-R-D/AdvanceCheckoutEmbedExample.git
cd AdvanceCheckoutEmbedExample/react-example
npm install
npm run dev
```

Then enter a payment path (e.g. `/pay/req_abc123`), click **Load**, and watch events appear in the log panel.

## Configuration

Both examples default to `https://app.advancehq.com`. To change the base URL:

**Vanilla** — edit `DEFAULT_BASE_URL` in `vanilla-example/src/advance-checkout.js`

**React** — edit `BASE_URL` in `react-example/src/CheckoutEmbed.jsx`

Or pass `baseUrl` directly:

```js
// Vanilla
const checkout = createCheckout({
  containerEl: document.getElementById('container'),
  baseUrl: 'http://localhost:3000',
});

// React
<CheckoutEmbed path="/pay/req_abc123" baseUrl="http://localhost:3000" />
```

## Events Reference

The checkout iframe sends events via `postMessage`. Each message has the shape:

```json
{
  "type": "advance.checkout.<event>",
  "payload": { ... }
}
```

| Event     | Description                              | Payload                                                    |
|-----------|------------------------------------------|------------------------------------------------------------|
| `ready`   | Iframe has loaded and is interactive     | `{}`                                                       |
| `success` | Payment was submitted successfully       | `{ paymentId: string, amount: number, currency: string }`  |
| `error`   | Payment failed or an error occurred      | `{ code: string, message: string }`                        |
| `settled` | Payment has been fully settled/finalized | `{ paymentId: string, settledAt: string }`                 |

## Callbacks

Both examples accept the same four callbacks:

| Callback    | When it fires                            |
|-------------|------------------------------------------|
| `onReady`   | Checkout iframe is loaded and interactive |
| `onSuccess` | Payment was submitted successfully       |
| `onError`   | Payment failed or an error occurred      |
| `onSettled` | Payment has been fully settled/finalized |

### Vanilla usage

```js
import { createCheckout } from './src/advance-checkout.js';

const checkout = createCheckout({
  containerEl: document.getElementById('checkout'),
  onSuccess: (payload) => console.log('Paid!', payload),
  onError: (payload) => console.error('Failed', payload),
});

checkout.load('/pay/req_abc123');

// Clean up when done:
checkout.destroy();
```

### React usage

```jsx
import CheckoutEmbed from './CheckoutEmbed.jsx';

<CheckoutEmbed
  path="/pay/req_abc123"
  onSuccess={(payload) => console.log('Paid!', payload)}
  onError={(payload) => console.error('Failed', payload)}
/>
```

## License

MIT
