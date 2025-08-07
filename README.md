DoomExtension :
A productivity-focused Chrome Extension that blocks unproductive YouTube videos based on **hashtags** using a local **Machine Learning API**.
and can be made global ML model if required

Features :
- Blocks videos with non-productive hashtags + ML (Sentence Transformers , cosine similarity)
- Local Flask backend for secure predictions
- Works on both YouTube Videos and Shorts
- Replaces blocked video with a custom image or gif overlay
- Blurs autoplaying YouTube Home videos on hover

Tech Stack:
- Chrome Extension (Manifest v3)
- JavaScript (Frontend logic)
- Python (Flask API)
- HuggingFace Sentence Transformers
- Pandas, NumPy, scikit-learn

<pre> ``` DoomExt/ │ ├── extension/ # Chrome extension files │ ├── contentScript.js # Core logic to scan & block │ ├── background.js # Message handler │ ├── manifest.json # Extension config │ └── assets/ # Replace image/gif │ ├── mlAPI/ # Python backend │ ├── main.py # Flask server + ML logic │ └── nonProHashtags.csv # Dataset for non-productive tags │ └── README.md ``` </pre>

How It Works : 
1. The extension watches for new YouTube videos.
2. It extracts hashtags like `#fun`, `#gaming`, etc.
3. Sends them to the Flask ML API (`localhost:5000/check?tag=...`)
4. API checks if it's “Productive” or “Non-Productive”
5. If not productive → video is blocked, overlay is shown.

Setup Instructions:

1. Clone the repo
```bash
git clone https://github.com/yourusername/DoomExtension.git
cd DoomExtension

cd mlAPI
pip install -r requirements.txt
python main.py

⚠️ Note: This project was tested and works on Python 3.10.
Python 3.13 had compatibility issues with certain libraries while building.
It’s recommended to use a virtual environment.
