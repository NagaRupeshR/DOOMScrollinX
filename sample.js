const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// --- Step 1: Create a simple text classification model ---
// For simplicity, we’ll just use a basic Dense network with dummy training

const model = tf.sequential();
model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [5] }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // binary output
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

// Dummy training data (pretend hashtags are converted to 5 features)
const xs = tf.tensor2d([
  [0, 1, 0, 0, 1],  // productive
  [1, 0, 1, 0, 0],  // not productive
  [0, 0, 1, 1, 0],  // productive
  [1, 1, 0, 1, 0]   // not productive
]);
const ys = tf.tensor2d([[1], [0], [1], [0]]);

(async () => {
  console.log("Training model...");
  await model.fit(xs, ys, { epochs: 100 });
  console.log("Model trained!");
})();

// --- Step 2: API endpoint ---
// Input: JSON with "hashtags": ["#study", "#fun", ...]
// Output: 1 or 0 (productive or not)
app.post('/classify', async (req, res) => {
  const hashtags = req.body.hashtags || [];

  // Convert hashtags to dummy 5D numeric features (placeholder logic)
  const features = hashtags.map((tag, idx) => (tag.includes("study") || tag.includes("work")) ? 1 : 0);
  while (features.length < 5) features.push(0); // pad to 5
  const inputTensor = tf.tensor2d([features.slice(0, 5)]);

  const prediction = model.predict(inputTensor);
  const output = (await prediction.data())[0] > 0.5 ? 1 : 0;

  res.json({ productive: output });
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
