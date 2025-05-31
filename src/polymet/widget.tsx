import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/chatbot-widget';
import './styles/widget.css'; // We'll create this next

declare global {
  interface Window {
    GhostGovWidget: {
      init: (config?: GhostGovWidgetConfig) => void;
    };
  }
}

interface GhostGovWidgetConfig {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  darkMode?: boolean;
}

class GhostGovWidget {
  private static instance: GhostGovWidget | null = null;
  private container: HTMLDivElement | null = null;
  private root: ReturnType<typeof createRoot> | null = null;
  private config: GhostGovWidgetConfig = {
    position: 'bottom-right',
    primaryColor: '#2563eb', // blue-600
    darkMode: false,
  };

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): GhostGovWidget {
    if (!GhostGovWidget.instance) {
      GhostGovWidget.instance = new GhostGovWidget();
    }
    return GhostGovWidget.instance;
  }

  init(config?: GhostGovWidgetConfig) {
    if (this.container) {
      console.warn('GhostGov Widget is already initialized');
      return;
    }

    // Merge config
    this.config = { ...this.config, ...config };

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'ghostgov-widget-container';
    this.container.style.position = 'fixed';
    this.container.style.zIndex = '999999';
    this.container.style[this.config.position === 'bottom-right' ? 'right' : 'left'] = '0';
    this.container.style.bottom = '0';
    this.container.style.width = '100%';
    this.container.style.height = '0';
    this.container.style.pointerEvents = 'none';

    // Add to document
    document.body.appendChild(this.container);

    // Create root and render
    this.root = createRoot(this.container);
    this.root.render(
      <React.StrictMode>
        <div className="ghostgov-widget-wrapper" data-theme={this.config.darkMode ? 'dark' : 'light'}>
          <ChatbotWidget />
        </div>
      </React.StrictMode>
    );
  }
}

// Initialize global object
window.GhostGovWidget = {
  init: (config?: GhostGovWidgetConfig) => {
    GhostGovWidget.getInstance().init(config);
  },
};

export default GhostGovWidget; 