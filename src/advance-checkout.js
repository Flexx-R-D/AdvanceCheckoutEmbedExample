import { ADVANCE_BASE_URL } from './config.js';

/**
 * AdvanceCheckout manages an embedded Advance checkout iframe and
 * provides a simple event interface for integration.
 *
 * @example
 * const checkout = new AdvanceCheckout({
 *   containerEl: document.getElementById('checkout-container'),
 * });
 *
 * checkout.on('ready', () => console.log('Checkout ready'));
 * checkout.on('success', (payload) => console.log('Payment succeeded', payload));
 * checkout.on('error', (payload) => console.error('Payment failed', payload));
 * checkout.on('settled', (payload) => console.log('Payment settled', payload));
 *
 * checkout.load('/pay/req_abc123');
 */
export class AdvanceCheckout {
  /** @type {string} */
  #baseUrl;

  /** @type {HTMLElement} */
  #containerEl;

  /** @type {HTMLIFrameElement | null} */
  #iframe = null;

  /** @type {Record<string, Function[]>} */
  #listeners = {};

  /** @type {((e: MessageEvent) => void) | null} */
  #messageHandler = null;

  /**
   * Create an AdvanceCheckout instance.
   *
   * @param {Object} options
   * @param {HTMLElement} options.containerEl — DOM element that will contain the iframe.
   * @param {string} [options.baseUrl] — Override the default Advance base URL.
   */
  constructor({ containerEl, baseUrl = ADVANCE_BASE_URL }) {
    if (!containerEl) {
      throw new Error('AdvanceCheckout: containerEl is required');
    }

    this.#baseUrl = baseUrl.replace(/\/+$/, '');
    this.#containerEl = containerEl;

    this.#messageHandler = this.#handleMessage.bind(this);
    window.addEventListener('message', this.#messageHandler);
  }

  /**
   * Load a checkout page into the iframe.
   *
   * @param {string} path — The checkout or payment-request path
   *   (e.g. "/pay/req_abc123" or "/checkout/inv_xyz").
   */
  load(path) {
    // Remove existing iframe if present
    if (this.#iframe) {
      this.#iframe.remove();
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const separator = normalizedPath.includes('?') ? '&' : '?';
    const src = `${this.#baseUrl}${normalizedPath}${separator}embed=true`;

    this.#iframe = document.createElement('iframe');
    this.#iframe.src = src;
    this.#iframe.style.width = '100%';
    this.#iframe.style.height = '100%';
    this.#iframe.style.border = 'none';
    this.#iframe.setAttribute('allow', 'payment');
    this.#iframe.setAttribute('title', 'Advance Checkout');

    this.#containerEl.appendChild(this.#iframe);
  }

  /**
   * Register a handler for a checkout event.
   *
   * Supported events:
   * - `ready`   — The checkout iframe has loaded and is interactive.
   * - `success` — The payment was submitted successfully.
   * - `error`   — The payment failed or an error occurred.
   * - `settled` — The payment has been fully settled / finalized.
   *
   * @param {string} eventName — One of: ready, success, error, settled.
   * @param {Function} callback — Called with the event payload (if any).
   * @returns {AdvanceCheckout} — Returns `this` for chaining.
   */
  on(eventName, callback) {
    if (!this.#listeners[eventName]) {
      this.#listeners[eventName] = [];
    }

    this.#listeners[eventName].push(callback);

    return this;
  }

  /**
   * Remove all event listeners and the iframe from the DOM.
   * Call this when unmounting or navigating away.
   */
  destroy() {
    if (this.#messageHandler) {
      window.removeEventListener('message', this.#messageHandler);
      this.#messageHandler = null;
    }

    if (this.#iframe) {
      this.#iframe.remove();
      this.#iframe = null;
    }

    this.#listeners = {};
  }

  /**
   * Handle incoming postMessage events from the iframe.
   *
   * Expected message format:
   * ```json
   * {
   *   "type": "advance.checkout.success",
   *   "payload": { ... }
   * }
   * ```
   *
   * @param {MessageEvent} event
   */
  #handleMessage(event) {
    // Only accept messages from the configured Advance origin
    if (event.origin !== this.#baseUrl) {
      return;
    }

    const data = event.data;

    if (!data || typeof data.type !== 'string') {
      return;
    }

    const prefix = 'advance.checkout.';

    if (!data.type.startsWith(prefix)) {
      return;
    }

    const eventName = data.type.slice(prefix.length);
    const handlers = this.#listeners[eventName];

    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data.payload);
        } catch (err) {
          console.error(`AdvanceCheckout: error in "${eventName}" handler`, err);
        }
      }
    }
  }
}
