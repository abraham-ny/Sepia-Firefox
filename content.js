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
    // Set default values
    const defaults = {
      sepiaImages: true,
      textGlow: true,
      glowIntensity: 5,
      pageTheme: true,
      whitelist: []
    };

    const settings = { ...defaults, ...result };

    // Check whitelist: if current domain is in the whitelist, do nothing.
    const whitelist = settings.whitelist;
    if (whitelist.some(domain => currentHost.includes(domain.toLowerCase()))) {
      return;
    }

    let cssRules = '';

    if (settings.sepiaImages) {
      cssRules += `
        img {
          filter: sepia(100%) !important;
        }
      `;
    }

    if (settings.textGlow) {
      const intensity = settings.glowIntensity;
      cssRules += `
        body, p, span, h1, h2, h3, h4, h5, h6, a {
          color: #704214 !important;
          text-shadow: 0 0 ${intensity}px rgba(255, 228, 196, 0.8);
          font-family: 'Caslon Antique', serif !important;
        }
      `;
    }

    if (settings.pageTheme) {
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
