// server/mock-ml.js
const express = require("express");
const app = express();
app.use(express.json());

app.post("/predict", (req, res) => {
  // Return the shape your tests expect (matching real ML service)
  res.json({
    category: "Development",
    confidence: 0.85,
    all_probabilities: {
      Development: 0.85,
      Design: 0.05,
      Marketing: 0.04,
      Operations: 0.03,
      Research: 0.03
    }
  });
});

const port = process.env.MOCK_ML_PORT || 5002;
// bind to 127.0.0.1 explicitly (avoid ::1/IPv6 resolution issues)
app.listen(port, "127.0.0.1", () => {
  console.log(`Mock ML listening on http://127.0.0.1:${port}`);
});