// background.js

const CHEAT_STATE_KEY = 'autoInjectEnabled';
// BLOOKET_URL_PATTERN is no longer needed since we use a simpler check

function injectCheat(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['gui.js']
    }).catch(err => {
        console.error("Failed to inject gui.js:", err);
    });
}

// Check for domain and protocol correctly
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    // Corrected URL check: Check if status is complete, URL exists, 
    // and contains the domain (handles subdomains and paths)
    const isBlooketUrl = tab.url && 
                         tab.url.includes('.blooket.com') && 
                         (tab.url.startsWith('https://') || tab.url.startsWith('http://'));
                         
    if (changeInfo.status === 'complete' && isBlooketUrl) {
        chrome.storage.local.get(CHEAT_STATE_KEY, (data) => {
            if (data[CHEAT_STATE_KEY] === true) {
                injectCheat(tabId);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'UPDATE_INJECTION_STATE') {
        console.log('Auto-Injection state updated to:', message.enabled);
    }
});


chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const informationPageUrl = chrome.runtime.getURL("information.html");
        chrome.tabs.create({ url: informationPageUrl });
    }
});