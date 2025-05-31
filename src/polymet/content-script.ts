import ChatbotWidget from './components/chatbot-widget'; // Import the ChatbotWidget component

// Wait for the page to fully load
window.addEventListener('load', async () => {
  console.log('[GhostGov] Content script running');
  // Removed .gov domain restriction for testing on any site

  // Don't double-inject
  if (document.getElementById('ghostgov-widget-container')) {
    console.log('[GhostGov] Widget already injected, exiting');
    return;
  }

  // Cast chrome global for TypeScript
  const chrome = (window as any).chrome;

  if (!chrome || !chrome.runtime || !chrome.storage || !chrome.tabs) {
      console.error('[GhostGov] Chrome extension APIs not available.');
      return;
  }

  // Initialize the widget container
  const container = document.createElement('div');
  container.id = 'ghostgov-widget-container';
  container.style.position = 'fixed';
  container.style.zIndex = '999999';
  container.style.right = '0';
  container.style.bottom = '0';
  // Set initial size to allow the widget to render its actual size, but control visibility with display/pointerEvents
  container.style.width = 'auto';
  container.style.height = 'auto';

  // Initially hidden and non-interactive until state is determined/message received
  container.style.display = 'none';
  container.style.pointerEvents = 'none';

  document.body.appendChild(container);

  // Render the React app into the container
  // We need React and ReactDOM globals to be available here (bundled by Vite)
  // Ensure React and ReactDOM are available as globals (should be due to UMD bundle)
  if (typeof (window as any).React === 'undefined' || typeof (window as any).ReactDOM === 'undefined') {
    console.error('[GhostGov] React or ReactDOM not found on window. Widget cannot initialize.');
    return;
  }

  try {
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;
    // Use ReactDOM.createRoot and standard React.createElement syntax
    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement('div', {
          className: 'ghostgov-widget-wrapper',
          'data-theme': window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
          // Initial display is none, will be set by message from background script
        },
          React.createElement(ChatbotWidget, null)
        )
      )
    );
    console.log('[GhostGov] Widget container appended and React app rendered.');
  } catch (e) {
    console.error('[GhostGov] Error rendering React app:', e);
    return;
  }

  // Define the type for messages from the background script
  interface BackgroundMessage {
    action: string;
    isVisible: boolean;
  }

  // Listen for messages from the background script to toggle visibility and set initial state
  chrome.runtime.onMessage.addListener((request: BackgroundMessage, sender: any, sendResponse: any) => {
    if (request.action === 'toggleWidget' || request.action === 'setInitialState') {
      const widgetContainer = document.getElementById('ghostgov-widget-container');

      if (widgetContainer) {
        // Control visibility via display style on the container itself
        widgetContainer.style.display = request.isVisible ? 'block' : 'none';
        // Control pointer events on the container
        widgetContainer.style.pointerEvents = request.isVisible ? 'auto' : 'none';

        console.log(`[GhostGov] Widget visibility set to: ${request.isVisible}`);
      }
      // No sendResponse needed for message passing from background to content script
    }
    // We don't need to return anything for simple messages from background to content.
  });

  // Request initial state from background script right after setting up the listener
  chrome.runtime.sendMessage({ action: 'requestInitialState' }).catch((error: any) => {
      console.warn('[GhostGov Content] Could not request initial state:', error.message);
  });

  // Listen for system dark mode changes (existing logic)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const widgetWrapper = document.querySelector('.ghostgov-widget-wrapper');
    if (widgetWrapper) {
      widgetWrapper.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}); 