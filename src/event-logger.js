/**
 * EventLogger renders a scrollable log panel that displays
 * timestamped, color-coded checkout events.
 */
export class EventLogger {
  /** @type {HTMLElement} */
  #containerEl;

  /** @type {HTMLElement} */
  #logList;

  /** @type {Record<string, string>} */
  static #COLORS = {
    ready: '#3b82f6',   // blue
    success: '#22c55e', // green
    error: '#ef4444',   // red
    settled: '#6b7280', // gray
  };

  /**
   * @param {HTMLElement} containerEl — Element to render the logger into.
   */
  constructor(containerEl) {
    this.#containerEl = containerEl;
    this.#containerEl.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'logger-header';

    const title = document.createElement('h3');
    title.textContent = 'Event Log';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.className = 'clear-btn';
    clearBtn.addEventListener('click', () => this.clear());

    header.appendChild(title);
    header.appendChild(clearBtn);

    // Log list
    this.#logList = document.createElement('div');
    this.#logList.className = 'log-list';

    this.#containerEl.appendChild(header);
    this.#containerEl.appendChild(this.#logList);
  }

  /**
   * Append a log entry.
   *
   * @param {string} type — Event type (ready, success, error, settled).
   * @param {*} [payload] — Optional event payload to display.
   */
  log(type, payload) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const color = EventLogger.#COLORS[type] || '#6b7280';

    const time = new Date().toLocaleTimeString('en-US', { hour12: false });

    const badge = document.createElement('span');
    badge.className = 'log-badge';
    badge.style.backgroundColor = color;
    badge.textContent = type;

    const timestamp = document.createElement('span');
    timestamp.className = 'log-time';
    timestamp.textContent = time;

    const meta = document.createElement('div');
    meta.className = 'log-meta';
    meta.appendChild(badge);
    meta.appendChild(timestamp);

    entry.appendChild(meta);

    if (payload !== undefined) {
      const detail = document.createElement('pre');
      detail.className = 'log-payload';
      detail.textContent = JSON.stringify(payload, null, 2);
      entry.appendChild(detail);
    }

    this.#logList.prepend(entry);
  }

  /**
   * Remove all log entries.
   */
  clear() {
    this.#logList.innerHTML = '';
  }
}
