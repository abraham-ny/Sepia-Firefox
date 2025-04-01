// Save all settings (toggles, slider, and whitelist) to chrome.storage.sync
document.getElementById('saveBtn').addEventListener('click', () => {
    const settings = {
        sepiaImages: document.getElementById('sepiaImages').checked,
        textGlow: document.getElementById('textGlow').checked,
        glowIntensity: parseFloat(document.getElementById('glowIntensity').value), // Changed to float for 0.5
        pageTheme: document.getElementById('pageTheme').checked,
        whitelist: whitelistDomains // from our local array
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
            // Set default values if not already stored
            const defaults = {
                sepiaImages: true,
                textGlow: true,
                glowIntensity: 1, // Changed default to 1
                pageTheme: true,
                whitelist: []
            };

            const settings = { ...defaults, ...result };

            document.getElementById('sepiaImages').checked = settings.sepiaImages;
            document.getElementById('textGlow').checked = settings.textGlow;
            document.getElementById('pageTheme').checked = settings.pageTheme;
            document.getElementById('glowIntensity').value = settings.glowIntensity;
            document.getElementById('glowValue').textContent = settings.glowIntensity;
            whitelistDomains = settings.whitelist;
            renderWhitelist();

            // Save defaults if this is the first load
            chrome.storage.sync.set(settings);
        }
    );
});
