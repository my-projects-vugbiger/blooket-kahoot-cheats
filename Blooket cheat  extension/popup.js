// popup.js

const CHEAT_STATE_KEY = 'autoInjectEnabled';
// BLOOKET_URL_PATTERN is no longer needed since we use a simpler check

/**
 * Executes gui.js on the current active tab if it's a Blooket page.
 * @param {boolean} [showSuccess=true] - Whether to show an alert on success.
 */
function injectCheat(showSuccess = true) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        // Corrected URL check: Use includes() for the domain name
        const isBlooketUrl = activeTab && activeTab.url && 
                             activeTab.url.includes('.blooket.com') &&
                             activeTab.url.startsWith('https://');
        
        if (isBlooketUrl) {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['gui.js']
            }, () => {
                if (showSuccess && !chrome.runtime.lastError) {
                   // Optional: alert('Cheat successfully injected!');
                } else if (chrome.runtime.lastError) {
                    console.error('Injection failed:', chrome.runtime.lastError.message);
                    if (showSuccess) {
                         alert('Injection failed. Check console for details.');
                    }
                }
            });
        } else if (showSuccess) {
            alert('Cheats can only be run on a Blooket page.');
        }
    });
}

// Function to save the state of the toggle
function saveToggleState(isEnabled) {
    chrome.storage.local.set({ [CHEAT_STATE_KEY]: isEnabled });
    // Also update the background service worker immediately
    chrome.runtime.sendMessage({
        action: 'UPDATE_INJECTION_STATE',
        enabled: isEnabled
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('info-button');
    const autoInjectToggle = document.getElementById('auto-inject-toggle');
    const runCheatButton = document.getElementById('run-cheat-button');

    // 1. Load the saved toggle state
    chrome.storage.local.get(CHEAT_STATE_KEY, (data) => {
        const isEnabled = data[CHEAT_STATE_KEY] === true;
        autoInjectToggle.checked = isEnabled;
    });

    // 2. Handle Auto-Inject Toggle change
    autoInjectToggle.addEventListener('change', (event) => {
        saveToggleState(event.target.checked);
    });

    // 3. Handle Manual Run button click
    runCheatButton.addEventListener('click', () => {
        injectCheat(true); // show success alert
    });

    // 4. Handle View Information button
    infoButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'information.html' });
    });
});