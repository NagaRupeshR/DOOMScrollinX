let triggered = localStorage.getItem("triggered") || "";
(() => {
  const stopHomeVideos = () => {
    const thumbnails = document.querySelectorAll("ytd-rich-grid-media ytd-thumbnail");
    thumbnails.forEach((thumb) => {
      const video = thumb.querySelector("video");
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.muted = true;
        video.removeAttribute("autoplay");
        video.removeAttribute("aria-hidden");
        video.removeAttribute("tabindex");
        video.removeAttribute("aria-label");
        video.setAttribute("muted", "true");
      }
      const unmuteButton = thumb.querySelector(".ytp-unmute.ytp-popup");
      if (unmuteButton) {
        unmuteButton.remove();
      }
      const overlayUI = thumb.querySelector(".ytp-hover-playlist-ui, .ytp-popup, .ytp-tooltip");
      if (overlayUI) {
        overlayUI.remove();
      }
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

const newVideoLoaded = () => {
  const interval = setInterval(() => {
    const video = document.querySelector("video");
    //if (video && !video.paused) {//!!!remove paused for shorts latr
const gifUrl = chrome.runtime.getURL("assets/replace.gif");
video.src = gifUrl;
      overlayImageOnVideo();
    //}
  }, 500);
};

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
  if (container.querySelector(".overlay-image")) return;
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/replace.jpg");
  Object.assign(img.style, { 
    position: "absolute",
    top: "0",
    left: "0", // change to "right: 0" if you want just top-right corner
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: "1",
  });
  img.className = "overlay-image";
  container.style.position = "relative"; // Make sure parent allows absolute positioning
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
          overlayImageOnVideo();
          newVideoLoaded();
      }
      if (type === "NEWS") {
          triggered="NEWS";
          localStorage.setItem("triggered", "NEWS");          
          location.reload();
          overlayImageOnVideo();
          newVideoLoaded();
      }
  });
  // Observe DOM changes (infinite scroll content etc.)
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
    newVideoLoaded();
    overlayImageOnVideo();
  }
})();
