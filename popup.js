document.addEventListener("DOMContentLoaded", () => {
  const blockedCountEl = document.getElementById("blockedCount");
  const timeSavedEl = document.getElementById("timeSaved");
  const resetBtn = document.getElementById("resetBtn");
  const addChannelBtn = document.getElementById("addChannelBtn");
  const removeChannelBtn = document.getElementById("removeChannelBtn");

  function renderBlockedChannels(channels) {
  const blockedChannelsList = document.getElementById("blockedChannelsList");
  blockedChannelsList.innerHTML = ""; // Clear old content

  if (!channels || channels.length === 0) {
    blockedChannelsList.innerHTML = `<p style="color: gray; font-size: 12px;">No blocked channels yet.</p>`;
    return;
  }

  channels.forEach((ch) => {
    const item = document.createElement("div");
    item.textContent = ch;
    item.style.padding = "2px 0";
    blockedChannelsList.appendChild(item);
  });
}

// Load blocked count + time saved + channels
chrome.storage.local.get(["blockedCount", "timeSaved"], (localData) => {
  const count = localData.blockedCount || 0;
  blockedCountEl.textContent = count;

  const savedSecs = localData.timeSaved || 0;
  const savedMins = Math.floor(savedSecs / 60);
  timeSavedEl.textContent = savedMins;

  // 🚀 Pull blocked channels from sync, not local
  chrome.storage.sync.get({ blockedChannels: [] }, (syncData) => {
    renderBlockedChannels(syncData.blockedChannels);
  });
});

  // Reset button
  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ blockedCount: 0, timeSaved: 0 }, () => {
      blockedCountEl.textContent = 0;
      timeSavedEl.textContent = 0;
    });
  });


// Helper: Get channelId of current active tab (works for videos + shorts)
function getCurrentChannelId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          let link = document.querySelector('a[href^="/channel/"], a[href^="/@"], a[href^="/c/"]');
          if (!link) return null;

          const href = link.getAttribute("href");
          if (!href) return null;

          if (href.startsWith("/channel/")) {
            return href.replace("/channel/", "").trim();
          } else if (href.startsWith("/@")) {
            return href.split("/")[1].replace("@", "").trim();
          } else if (href.startsWith("/c/")) {
            return href.replace("/c/", "").trim();
          }

          return null;
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0].result) {
          callback(null);
        } else {
          callback(results[0].result);
        }
      }
    );
  });
}


  // Add current channel to blocked list
  addChannelBtn.addEventListener("click", () => {
    getCurrentChannelId((channelId) => {
      if (!channelId) return alert(" No channel found!");
      chrome.storage.sync.get({ blockedChannels: [] }, (data) => {
        const list = data.blockedChannels;
        if (!list.includes(channelId)) {
          list.push(channelId);
          chrome.storage.sync.set({ blockedChannels: list }, () => {
            alert(` Blocked channel: ${channelId}`);
            renderBlockedChannels(list);
          });
        } else {
          alert(" Channel already blocked!");
        }
      });
    });
  });

  // Remove current channel from blocked list
  removeChannelBtn.addEventListener("click", () => {
    getCurrentChannelId((channelId) => {
      if (!channelId) return alert(" No channel found!");
      chrome.storage.sync.get({ blockedChannels: [] }, (data) => {
        let list = data.blockedChannels;
        if (list.includes(channelId)) {
          list = list.filter(id => id !== channelId);
          chrome.storage.sync.set({ blockedChannels: list }, () => {
            alert(` Unblocked channel: ${channelId}`);
            renderBlockedChannels(list);
          });
        } else {
          alert(" Channel not in blocked list!");
        }
      });
    });
  });
});
