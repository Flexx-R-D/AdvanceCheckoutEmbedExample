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

Then enter a full checkout URL (e.g. `https://app.sandbox.advancehq.com/checkout/abc_123`), click **Load**, and watch events appear in the log panel.

The React tester also has a **Style** panel: edit the theme JSON (or load a preset), toggle **Payment fields only**, and the iframe reloads with the new URL. The generated `iframe src` is shown above the checkout with a Copy button, and the tester's own page URL keeps the current setup, so you can share a link to it. If the checkout rejects part of the style, its warnings appear under the editor.

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
<CheckoutEmbed url="http://localhost:3000/checkout/abc_123" />
```

## Styling and layout

The checkout reads two optional query params next to `embed=true`:

| Param | Value | Effect |
|-------|-------|--------|
| `style` | URL-encoded JSON `{ variables, rules, showPoweredBy }` | Themes the checkout (colors, fonts, radius, per-component rules) |
| `fields_only` | `true` | Hides the invoice details (summary card) and shows only the payment fields, up to 800px wide |

Both helpers build these for you. Change the options and the iframe reloads with the new URL:

```js
// Vanilla
checkout.load(url, { style: { variables: { colorPrimary: '#2563EB' } }, fieldsOnly: true });

// React
<CheckoutEmbed url={url} style={{ variables: { colorPrimary: '#2563EB' } }} fieldsOnly />
```

Notes:
- `style` and `fields_only` only apply when the checkout runs inside an iframe. If you open the same URL in its own tab, you get the default full checkout.
- Invalid parts of `style` are dropped, and the reasons come back in the `ready` event as `style_warnings`.
- `style` is limited to 12,000 characters (as JSON). Longer values are ignored.
- The full list of variables, components, modifiers and fonts is in the React tester under **Style reference** (`react-example/src/styleReference.js`).

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
| `ready`   | Iframe has loaded and is interactive     | `{}`, or `{ style_warnings: string[] }` if part of `style` was rejected |
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

checkout.load('https://app.sandbox.advancehq.com/checkout/abc_123', {
  style: { variables: { colorPrimary: '#2563EB' } }, // optional
  fieldsOnly: true,                                  // optional
});

// Clean up when done:
checkout.destroy();
```

### React usage

```jsx
import CheckoutEmbed from './CheckoutEmbed.jsx';

<CheckoutEmbed
  url="https://app.sandbox.advancehq.com/checkout/abc_123"
  style={{ variables: { colorPrimary: '#2563EB' } }} // optional
  fieldsOnly                                         // optional
  onSuccess={(payload) => console.log('Paid!', payload)}
  onError={(payload) => console.error('Failed', payload)}
/>
```

## License

MIT
