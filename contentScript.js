let triggered = localStorage.getItem("triggered") || "";
(() => {
  const stopHomeVideos = () => {
    const thumbnails = document.querySelectorAll("yt-thumbnail-view-model");
    thumbnails.forEach((thumb) => {
      const video = thumb;

      if (!thumb.querySelector(".doom-overlay")) {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          zIndex: 9999,
          pointerEvents: "none",
        });
        overlay.className = "doom-overlay";
        thumb.style.position = "relative";
        thumb.appendChild(overlay);
      }
    });
  };

let blockIntervalId = null; 

const newVideoLoaded = () => {
  let attempts = 0;
  const maxAttempts = 10;

  const interval = setInterval(() => {
    const video = document.querySelector("video");

    const tagElements = document.querySelectorAll('a[href^="/hashtag/"]');
    const tags = new Set();
    tagElements.forEach(a => {
      if (a.textContent.startsWith('#')) {
        tags.add(a.textContent.trim().substring(1));
      }
    });

    if (tags.size > 0 && video) {
      clearInterval(interval);
      const tagq = Array.from(tags).join('_');

      fetch(`http://localhost:5000/check?tag=${encodeURIComponent(tagq)}`)
        .then(response => response.json())
        .then(data => {
          console.log("🧠 API response:", data);
          
          if (data.result !== "Productive") {
            chrome.storage.local.get(["blockedCount"], (res) => {
              let newCount = (res.blockedCount || 0) + 1;
              chrome.storage.local.set({ blockedCount: newCount });
            });
            overlayImageOnVideo();
            startVideoBlockerInterval(); 
          } else {
            stopVideoBlockerInterval();
          }
        })
        .catch(error => {
          console.error("API error:", error);
        });
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }

    attempts++;
  }, 500);
};

function startVideoBlockerInterval() {
  if (blockIntervalId) return; 

  const gifUrl = chrome.runtime.getURL("assets/replace.gif");
  blockIntervalId = setInterval(() => {
    const video = document.querySelector("video");
    if (video) {
      video.src = gifUrl;
    }
  }, 1000); 
}

function stopVideoBlockerInterval() {
  if (blockIntervalId) {
    clearInterval(blockIntervalId);
    blockIntervalId = null;
  }
}


function overlayImageOnVideo() {
  let video;
  const url = window.location.href; 
  if (url.includes("youtube.com/watch")) {
    video = document.querySelector("#movie_player");
  } else if (url.includes("youtube.com/shorts")) {
    video = document.querySelector("ytd-reel-video-renderer #player-container");
  }
  if (!video) return;
  const container = video.parentElement;
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/replace.jpg");
  Object.assign(img.style, { 
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: "1",
  });
  container.style.position = "relative"; 
  container.appendChild(img);
}

  setTimeout(stopHomeVideos, 2000);
  chrome.runtime.onMessage.addListener((obj) => {
    if (obj.type === "HOME") {
      triggered="HOME";
      localStorage.setItem("triggered", "HOME");
      console.log("📨 Message received: HOME");
      setTimeout(stopHomeVideos, 2000);
    }
  });



  chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, videoId } = obj;
      if (type === "NEWV") {

          triggered="NEWV";
          localStorage.setItem("triggered", "NEWV");
          location.reload();
          stopVideoBlockerInterval();
          newVideoLoaded();

      }
      if (type === "NEWS") {

          triggered="NEWS";
          localStorage.setItem("triggered", "NEWS");          
          location.reload();
          stopVideoBlockerInterval();
          newVideoLoaded();    
      }
  });
  const observer = new MutationObserver(() => {
    stopHomeVideos();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  if(triggered=="HOME"){
    stopHomeVideos();
  }
  if(triggered=="NEWS" || triggered=="NEWV"){
    stopVideoBlockerInterval();
    newVideoLoaded();
  }
})();
