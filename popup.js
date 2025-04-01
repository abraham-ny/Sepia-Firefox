// Add this polyfill at the top of your scripts
if (typeof browser === "undefined") {
  var browser = chrome;
}

// Save all settings (toggles, slider, and whitelist) to chrome.storage.sync
document.getElementById('saveBtn').addEventListener('click', () => {
    const settings = {
      sepiaImages: document.getElementById('sepiaImages').checked,
      textGlow: document.getElementById('textGlow').checked,
      glowIntensity: parseInt(document.getElementById('glowIntensity').value, 10),
      pageTheme: document.getElementById('pageTheme').checked,
      whitelist: whitelistDomains  // from our local array
    };
  
    chrome.storage.sync.set(settings, () => {
      alert('Settings saved!');
    });
  });
  
  // Update slider display as user moves it
  document.getElementById('glowIntensity').addEventListener('input', (e) => {
    document.getElementById('glowValue').textContent = e.target.value;
  });
  
  // Local variable to store whitelist domains
  let whitelistDomains = [];
  
  // Function to render whitelist in the UI
  function renderWhitelist() {
    const listEl = document.getElementById('whitelist');
    listEl.innerHTML = '';
    whitelistDomains.forEach((domain, index) => {
      const li = document.createElement('li');
      li.textContent = domain;
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('remove-btn');
      removeBtn.addEventListener('click', () => {
        whitelistDomains.splice(index, 1);
        renderWhitelist();
      });
      
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }
  
  // Add new domain to whitelist
  document.getElementById('addDomainBtn').addEventListener('click', () => {
    const newDomainInput = document.getElementById('newDomain');
    const domain = newDomainInput.value.trim();
    if (domain && !whitelistDomains.includes(domain)) {
      whitelistDomains.push(domain);
      renderWhitelist();
      newDomainInput.value = '';
    }
  });
  
  // On load, retrieve and update settings including whitelist
  window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(
      ['sepiaImages', 'textGlow', 'glowIntensity', 'pageTheme', 'whitelist'],
      (result) => {
        document.getElementById('sepiaImages').checked = result.sepiaImages || false;
        document.getElementById('textGlow').checked = result.textGlow || false;
        document.getElementById('pageTheme').checked = result.pageTheme || false;
        document.getElementById('glowIntensity').value = result.glowIntensity || 5;
        document.getElementById('glowValue').textContent = result.glowIntensity || 5;
        whitelistDomains = result.whitelist || [];
        renderWhitelist();
      }
    );
  });
  