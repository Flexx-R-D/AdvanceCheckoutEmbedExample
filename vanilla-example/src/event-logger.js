const COLORS = {
  ready: '#3b82f6',   // blue
  success: '#22c55e', // green
  error: '#ef4444',   // red
  settled: '#6b7280', // gray
};

// Creates a log panel that shows timestamped, color-coded checkout events.
//
// Usage:
//   const logger = createEventLogger(document.getElementById('log'));
//   logger.log('success', { paymentId: '123' });
//   logger.clear();
//
export function createEventLogger(containerEl) {
  containerEl.innerHTML = `
    <div class="logger-header">
      <h3>Event Log</h3>
      <button class="clear-btn" id="clear-log-btn">Clear</button>
    </div>
    <div class="log-list" id="log-list"></div>
  `;

  const logList = containerEl.querySelector('#log-list');
  containerEl.querySelector('#clear-log-btn').addEventListener('click', clear);

  function log(type, payload) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const color = COLORS[type] || '#6b7280';

    const entry = document.createElement('div');
    entry.className = 'log-entry';

    let html = `
      <div class="log-meta">
        <span class="log-badge" style="background-color: ${color}">${type}</span>
        <span class="log-time">${time}</span>
      </div>
    `;

    if (payload !== undefined) {
      const json = JSON.stringify(payload, null, 2);
      html += `<pre class="log-payload">${json}</pre>`;
    }

    entry.innerHTML = html;
    logList.prepend(entry);
  }

  function clear() {
    logList.innerHTML = '';
  }

  return { log, clear };
}
