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
  });
chrome.runtime.onMessage.addListener((obj, sender, response) => {
  if (obj.type === "HOME") {
    console.log("📨 Message received: HOME");
    setTimeout(stopHomeVideos, 2000);
  }
});
