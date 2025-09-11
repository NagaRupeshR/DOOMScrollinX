DoomExtension :
A productivity-focused Chrome Extension that blocks unproductive YouTube videos based on **hashtags** using a local **Machine Learning API**.
and can be made global ML model if required

Features :

- Blocks videos with non-productive hashtags + ML (Sentence Transformers , cosine similarity)
- Channel Blocking – Add/remove channels to a blocklist (auto-block across all videos/shorts)
- Scroll-friendly Blocklist UI in popup (transparency + blocking & unblocking option + Time Saved Counter + Blocked Videos Counter)
- Works on both YouTube Videos and Shorts
- Replaces blocked video with a custom image or gif overlay
- Youtube Home video player which plays videos on hover is blurred
- Local Flask backend for secure predictions

Tech Stack:

- Chrome Extension (Manifest v3)
- JavaScript (Frontend logic)
- Python (Flask API)
- HuggingFace Sentence Transformers
- Pandas, NumPy, scikit-learn

```bash
PROJECT STRUCTURE
DOOMEXTPROJ/
assets/ # Extension assets (icons + overlay)
── icon16.png
── icon48.png
── icon128.png
── replace.gif
── replace.jpg

mlAPI/ # Python ML API backend
── hashtags_dedup.csv # Dataset of non-productive hashtags
── main.py # Flask ML server

── background.js # Background service worker
── contentScript.js # Blocks hashtags + channels
── manifest.json # Chrome extension config (MV3)
── popup.css # Popup styling
── popup.html # Popup UI
── popup.js # Popup logic (blocklist, counters)
── LICENSE # License file
── README.md # Project documentation
```

How It Works :

1. The extension watches for new YouTube videos.
2. Checks if that video belongs to blocked channels
3. It extracts hashtags like `#fun`, `#gaming`, etc.
4. Sends them to the Flask ML API (`localhost:5000/check?tag=...`)
5. API checks if it's “Productive” or “Non-Productive”
6. If Non-Productive or Blocked Channel →
   Video is blocked, overlay image shown
   Counters updated (time saved + videos blocked)

Setup Instructions:

```bash
1. Clone the repo
git clone https://github.com/yourusername/DoomExtension.git
cd DoomExtension

2. Install ML API dependencies
cd mlAPI
pip install -r requirements.txt
python main.py

3. Load Extension in Chrome
Open chrome://extensions
Enable Developer Mode
Click Load unpacked → Select extension/ folder
```

⚠️ Note: This project was tested and works on Python 3.10.
Python 3.13 had compatibility issues with certain ML libraries.
It’s recommended to use a virtual environment.

Preview of how output looks like
( https://drive.google.com/drive/folders/1Nz9b6X_UEQj1XcH19qVfyZgix0mZl9Hv?usp=drive_link )
