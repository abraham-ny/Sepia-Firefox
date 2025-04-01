// Add this polyfill at the top of your scripts
if (typeof browser === "undefined") {
    var browser = chrome;
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        chrome.tabs.create({ url: "donate.html" });
    }
});