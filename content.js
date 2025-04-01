// Inject the @font-face rule to load the bundled vintage font
const fontFaceStyle = document.createElement('style');
fontFaceStyle.textContent = `
  @font-face {
    font-family: 'Caslon Antique';
    src: url(${chrome.runtime.getURL('caslon-antique.woff2')}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`;
document.head.appendChild(fontFaceStyle);

// Get the current hostname
const currentHost = window.location.hostname.toLowerCase();

// Retrieve user settings from storage
chrome.storage.sync.get(
  ['sepiaImages', 'textGlow', 'glowIntensity', 'pageTheme', 'whitelist'],
  (result) => {
    // Check whitelist: if current domain is in the whitelist, do nothing.
    const whitelist = result.whitelist || [];
    if (whitelist.some(domain => currentHost.includes(domain.toLowerCase()))) {
      // Skip applying styles if site is whitelisted
      return;
    }

    let cssRules = '';

    if (result.sepiaImages) {
      cssRules += `
        img {
          filter: sepia(100%) !important;
        }
      `;
    }

    if (result.textGlow) {
      const intensity = result.glowIntensity || 5;
      cssRules += `
        body, p, span, h1, h2, h3, h4, h5, h6, a {
          color: #704214 !important;
          text-shadow: 0 0 ${intensity}px rgba(255, 228, 196, 0.8);
          font-family: 'Caslon Antique', serif !important;
        }
      `;
    }

    if (result.pageTheme) {
      cssRules += `
        body {
          background: #f5f3ed !important;
        }
      `;
    }

    if (cssRules) {
      const styleTag = document.createElement('style');
      styleTag.id = 'nostalgia-sepia-style';
      styleTag.textContent = cssRules;
      document.head.appendChild(styleTag);
    }
  }
);
