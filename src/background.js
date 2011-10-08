var settings = {enabled: localStorage.getItem('enabled') == 'false' ? false : true};

function setEnabled(enabled) {
    settings.enabled = enabled;
    localStorage.setItem('enabled', enabled ? 'true' : 'false');
    chrome.browserAction.setTitle({title: enabled ? 'Hide Passwords' : 'Show Passwords'});
    chrome.browserAction.setBadgeText({text: (enabled ? '' : '...')});
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
}

function notifyTab(tabId) {
    chrome.tabs.sendRequest(tabId, {method: 'setEnabled', enabled: settings.enabled});
}

setEnabled(settings.enabled);
chrome.tabs.onSelectionChanged.addListener(notifyTab);
chrome.browserAction.onClicked.addListener(function (tab) {
    setEnabled(!settings.enabled);
    notifyTab(tab.id);
});
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.method == 'isEnabled')
        sendResponse({enabled: settings.enabled});
});
