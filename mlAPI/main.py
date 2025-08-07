from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Step 1️⃣: Load model & pre-encode once when server starts
print("🔥 Initializing model & vectors (only once)...")
model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
df = pd.read_csv("nonProHashtags.csv")
non_prod_tags = df['lemmatized_tags'].tolist()
non_prod_vectors = model.encode(non_prod_tags)
print("✅ Model & vectors ready!")

# Step 2️⃣: Define route for checking tags
@app.route("/check", methods=["GET"])
def check_tag():
    tag = request.args.get("tag")
    if not tag:
        return jsonify({"error": "No tag provided"}), 400

    test_vector = model.encode([tag])[0]
    similarities = cosine_similarity([test_vector], non_prod_vectors)
    max_sim = np.max(similarities)

    threshold = 0.45
    result = "Non-Productive" if max_sim >= threshold else "Productive"

    return jsonify({
        "input": tag,
        "similarity": round(float(max_sim), 2),
        "result": result
    }), 200

# Optional index route
@app.route("/")
def index():
    return "🔥 API is live and ready brooo!", 200

# Main entry
if __name__ == "__main__":
    app.run(debug=True)
