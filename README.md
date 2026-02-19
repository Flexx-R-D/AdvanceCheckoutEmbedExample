# Advance Checkout Embed Example

A minimal, zero-dependency example showing how to embed the Advance checkout in your application using an iframe and handle all `postMessage` events.

## Quick Start

```bash
git clone https://github.com/Flexx-R-D/AdvanceCheckoutEmbedExample.git
cd AdvanceCheckoutEmbedExample

# Open directly in a browser
open index.html

# Or serve locally (if your browser blocks ES modules over file://)
npx serve .
```

1. Enter a payment path in the input field (e.g. `/pay/req_abc123`)
2. Click **Load**
3. The checkout loads in the left panel; events appear in the right panel

## Configuration

The base URL defaults to `https://app.advancehq.com`. To change it, edit `src/config.js`:

```js
export const ADVANCE_BASE_URL = 'https://staging.advancehq.com';
```

Or pass it when constructing the checkout:

```js
const checkout = new AdvanceCheckout({
  containerEl: document.getElementById('container'),
  baseUrl: 'http://localhost:3000',
});
```

## Events Reference

The checkout iframe sends events via `postMessage`. Each message has the shape:

```json
{
  "type": "advance.checkout.<event>",
  "payload": { ... }
}
```

| Event     | Description                              | Payload                                         |
|-----------|------------------------------------------|--------------------------------------------------|
| `ready`   | Iframe has loaded and is interactive     | `{}`                                             |
| `success` | Payment was submitted successfully       | `{ paymentId: string, amount: number, currency: string }` |
| `error`   | Payment failed or an error occurred      | `{ code: string, message: string }`              |
| `settled` | Payment has been fully settled/finalized | `{ paymentId: string, settledAt: string }`       |

## Integration Guide

### Vanilla JavaScript

```html
<div id="checkout-container" style="width: 600px; height: 700px;"></div>

<script type="module">
  import { AdvanceCheckout } from './src/advance-checkout.js';

  const checkout = new AdvanceCheckout({
    containerEl: document.getElementById('checkout-container'),
  });

  checkout.on('success', (payload) => {
    console.log('Payment succeeded:', payload);
    // Redirect, show confirmation, etc.
  });

  checkout.on('error', (payload) => {
    console.error('Payment error:', payload);
  });

  checkout.load('/pay/req_abc123');
</script>
```

### React

```jsx
import { useEffect, useRef } from 'react';
import { AdvanceCheckout } from './advance-checkout.js';

function CheckoutEmbed({ path, onSuccess, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const checkout = new AdvanceCheckout({
      containerEl: containerRef.current,
    });

    checkout.on('success', onSuccess);
    checkout.on('error', onError);
    checkout.load(path);

    return () => checkout.destroy();
  }, [path]);

  return <div ref={containerRef} style={{ width: '100%', height: 700 }} />;
}
```

### Vue

```vue
<template>
  <div ref="container" style="width: 100%; height: 700px" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { AdvanceCheckout } from './advance-checkout.js';

const props = defineProps({ path: String });
const emit = defineEmits(['success', 'error']);

const container = ref(null);
let checkout;

onMounted(() => {
  checkout = new AdvanceCheckout({ containerEl: container.value });
  checkout.on('success', (p) => emit('success', p));
  checkout.on('error', (p) => emit('error', p));
  checkout.load(props.path);
});

onUnmounted(() => checkout?.destroy());
</script>
```

## API Reference

### `AdvanceCheckout`

#### `constructor({ containerEl, baseUrl? })`

Creates a new checkout embed instance.

| Param          | Type          | Default                         | Description                    |
|----------------|---------------|----------------------------------|--------------------------------|
| `containerEl`  | `HTMLElement`  | —                                | DOM element for the iframe     |
| `baseUrl`      | `string`      | `https://app.advancehq.com`     | Advance app URL                |

#### `load(path: string): void`

Loads a checkout page into the iframe. The `?embed=true` query parameter is appended automatically.

```js
checkout.load('/pay/req_abc123');
```

#### `on(eventName: string, callback: Function): AdvanceCheckout`

Registers an event handler. Returns `this` for chaining.

```js
checkout
  .on('ready', () => { /* ... */ })
  .on('success', (payload) => { /* ... */ });
```

#### `destroy(): void`

Removes the iframe and cleans up all event listeners. Always call this when the checkout is no longer needed (e.g. component unmount, page navigation).

```js
checkout.destroy();
```

## License

MIT
