document.addEventListener("DOMContentLoaded", () => {
  const blockedCountEl = document.getElementById("blockedCount");
  const timeSavedEl = document.getElementById("timeSaved");
  const resetBtn = document.getElementById("resetBtn");
  const addChannelBtn = document.getElementById("addChannelBtn");
  const removeChannelBtn = document.getElementById("removeChannelBtn");

  // Load blocked count
  chrome.storage.local.get(["blockedCount"], (data) => {
    const count = data.blockedCount || 0;
    blockedCountEl.textContent = count;
    timeSavedEl.textContent = (count * 5); // assume 5 min per video
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ blockedCount: 0 }, () => {
      blockedCountEl.textContent = 0;
      timeSavedEl.textContent = 0;
    });
  });

  // Helper: Get channelId of current active tab
  function getCurrentChannelId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            const link = document.querySelector("ytd-video-owner-renderer a.yt-simple-endpoint");
            if (!link) return null;
            const href = link.getAttribute("href");
            if (href.startsWith("/channel/")) return href.replace("/channel/", "").trim();
            if (href.startsWith("/@")) return href.replace("/@", "").trim();
            if (href.startsWith("/c/")) return href.replace("/c/", "").trim();
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
      if (!channelId) return alert("⚠️ No channel found!");
      chrome.storage.sync.get({ blockedChannels: [] }, (data) => {
        const list = data.blockedChannels;
        if (!list.includes(channelId)) {
          list.push(channelId);
          chrome.storage.sync.set({ blockedChannels: list }, () => {
            alert(`✅ Blocked channel: ${channelId}`);
          });
        } else {
          alert("⚠️ Channel already blocked!");
        }
      });
    });
  });

  // Remove current channel from blocked list
  removeChannelBtn.addEventListener("click", () => {
    getCurrentChannelId((channelId) => {
      if (!channelId) return alert("⚠️ No channel found!");
      chrome.storage.sync.get({ blockedChannels: [] }, (data) => {
        let list = data.blockedChannels;
        if (list.includes(channelId)) {
          list = list.filter(id => id !== channelId);
          chrome.storage.sync.set({ blockedChannels: list }, () => {
            alert(`🚫 Unblocked channel: ${channelId}`);
          });
        } else {
          alert("⚠️ Channel not in blocked list!");
        }
      });
    });
  });
});
