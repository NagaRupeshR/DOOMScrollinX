function overlayImageOnVideo() {
  let video;
  const url = window.location.href;  // ✅ Use window.location in content script

  if (url.includes("youtube.com/watch")) {
    video = document.querySelector("#movie_player");
  } else if (url.includes("youtube.com/shorts")) {
    video = document.querySelector("ytd-reel-video-renderer #player-container");
  }

  const container = video.parentElement;

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
  container.style.position = "relative"; // Make sure parent allows absolute positioning
  container.appendChild(img);
}


(() => {
    let youtubePlayer,playerContainer;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        if (type === "NEWV") {
            overlayImageOnVideo();
            newVideoLoaded();
        }
        if (type === "NEWS") {
            
            //alert("iii");
            
            location.reload();
            overlayImageOnVideo();
            newVideoLoaded();
        }
    });

const newVideoLoaded = () => {
  const interval = setInterval(() => {
    

    const video = document.querySelector("video");

    //if (video && !video.paused) {//!!!remove paused for shorts latr
      video.src="./assets/replace.gif";
      overlayImageOnVideo();
    //}

  }, 500);
};
//overlayImageOnVideo();
newVideoLoaded();
overlayImageOnVideo();
})();