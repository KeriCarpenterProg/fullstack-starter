// server/mock-ml.js
const express = require("express");
const app = express();
app.use(express.json());

app.post("/predict", (req, res) => {
  // return the shape your tests expect
  res.json({ category: "ci-mock", score: 0.9 });
});

const port = process.env.MOCK_ML_PORT || 5002;
// bind to 127.0.0.1 explicitly (avoid ::1/IPv6 resolution issues)
app.listen(port, "127.0.0.1", () => {
  console.log(`Mock ML listening on http://127.0.0.1:${port}`);
});