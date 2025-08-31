import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent debug panels from being injected
const preventDebugPanels = () => {
  // Remove any existing debug panels
  const debugSelectors = [
    '[data-debug]',
    '[class*="debug"]',
    '[id*="debug"]',
    '[class*="Debug"]',
    '[id*="Debug"]'
  ];
  
  debugSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Remove elements with debug-related text
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes('🔧') || 
        node.textContent.includes('🔍') || 
        node.textContent.includes('API Debug') ||
        node.textContent.includes('Auth Debug') ||
        node.textContent.includes('Environment Variables')) {
      textNodes.push(node);
    }
  }
  
  textNodes.forEach(textNode => {
    if (textNode.parentElement) {
      textNode.parentElement.remove();
    }
  });
};

// Run prevention on load
document.addEventListener('DOMContentLoaded', preventDebugPanels);

// Run prevention periodically
setInterval(preventDebugPanels, 1000);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
