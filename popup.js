document.addEventListener("DOMContentLoaded", () => {
  const blockedCountEl = document.getElementById("blockedCount");
  const timeSavedEl = document.getElementById("timeSaved");
  const resetBtn = document.getElementById("resetBtn");

  // Load from storage
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
});
