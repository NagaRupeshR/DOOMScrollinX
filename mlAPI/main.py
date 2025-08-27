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
    raw_tag = request.args.get("tag")
    if not raw_tag:
        return jsonify({"error": "No tag provided"}), 400

    # Split + clean hashtags
    split_tags = raw_tag.split("_")
    clean_tags = [t[1:] if t.startswith("#") else t for t in split_tags]
    print("cleaned",clean_tags)
    # Encode each tag & average
    vectors = [model.encode([t])[0] for t in clean_tags]
    test_vector = np.mean(vectors, axis=0)

    # Compare with dataset
    similarities = cosine_similarity([test_vector], non_prod_vectors)
    max_sim = np.max(similarities)

    threshold = 0.45
    result = "Non-Productive" if max_sim >= threshold else "Productive"

    return jsonify({
        "input": clean_tags,
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
