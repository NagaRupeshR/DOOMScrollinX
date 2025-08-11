chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      chrome.tabs.sendMessage(tabId, {
        type: "NEWV",
      });
    }
    else if (tab.url && tab.url.includes("youtube.com/shorts")) {
      chrome.tabs.sendMessage(tabId, {
        type: "NEWS",
      });
    }
    else if (tab.url && tab.url.includes("youtube.com/")) {
      chrome.tabs.sendMessage(tabId, {
        type: "HOME",
      });
    }
  });

