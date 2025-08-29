DoomExtension :
A productivity-focused Chrome Extension that blocks unproductive YouTube videos based on **hashtags** using a local **Machine Learning API**.
and can be made global ML model if required

Features :
- Blocks videos with non-productive hashtags + ML (Sentence Transformers , cosine similarity)
- Local Flask backend for secure predictions
- Works on both YouTube Videos and Shorts
- Replaces blocked video with a custom image or gif overlay
- Youtube Home video player which plays videos on hover is blurred

Tech Stack:
- Chrome Extension (Manifest v3)
- JavaScript (Frontend logic)
- Python (Flask API)
- HuggingFace Sentence Transformers
- Pandas, NumPy, scikit-learn

| File / Folder            | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `extension/`             | Contains all Chrome Extension files              |
| ├── `contentScript.js`   | Main logic that scans hashtags and blocks videos |
| ├── `background.js`      | Handles background messaging in the extension    |
| ├── `manifest.json`      | Extension configuration file (Manifest V3)       |
| └── `assets/`            | Folder containing image/gif for overlay          |
| `mlAPI/`                 | Python backend server with ML logic              |
| ├── `main.py`            | Flask server that classifies hashtags            |
| └── `nonProHashtags.csv` | Dataset of non-productive hashtags               |
| `README.md`              | Project documentation                            |


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
Python 3.13 had compatibility issues with certain ML libraries.
It’s recommended to use a virtual environment.


Preview of how output looks like
[Click here to watch the demo]( https://drive.google.com/drive/folders/1Nz9b6X_UEQj1XcH19qVfyZgix0mZl9Hv?usp=drive_link )

