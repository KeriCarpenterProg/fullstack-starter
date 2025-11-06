# ML Service - Project Category Classifier

AI-powered project categorization using machine learning.

## Setup

1. **Create Python virtual environment:**
   ```bash
   cd ml-service
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the model:**
   ```bash
   python train_model.py
   ```

4. **Start the API server:**
  ```bash
  python app.py
  ```
   
  The API will run on http://localhost:5002 (default). Set PORT to override.

## API Endpoints

### `GET /`
Health check and API information

### `POST /predict`
Classify a project text into a category

**Request:**
```json
{
  "text": "Build new React component for dashboard"
}
```

**Response:**
```json
{
  "category": "Development",
  "confidence": 0.87,
  "all_probabilities": {
    "Development": 0.87,
    "Design": 0.08,
    "Marketing": 0.03,
    "Research": 0.01,
    "Operations": 0.01
  }
}
```

## Categories

- **Development**: Coding, bug fixes, technical implementation
- **Marketing**: Campaigns, content, SEO, social media
- **Design**: UI/UX, graphics, mockups, branding
- **Research**: Analysis, investigation, user studies
- **Operations**: Infrastructure, monitoring, maintenance

## How It Works

1. **TF-IDF Vectorization**: Converts text to numerical features
2. **Naive Bayes Classifier**: Predicts category based on word patterns
3. **Confidence Scores**: Returns probability for each category

## Integration with Express Backend

Add to your Express server (now using env var `ML_SERVICE_URL`):

```typescript
// Add ML prediction endpoint
app.post('/api/ml/predict-category', async (req, res) => {
  const { text } = req.body;
  const baseUrl = process.env.ML_SERVICE_URL || 'http://localhost:5002';
  const url = `${baseUrl.replace(/\/$/, '')}/predict`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error(`ML service returned ${response.status}`);
    const prediction = await response.json();
    res.json(prediction);
  } catch (error: any) {
    res.status(503).json({ error: 'ML service unavailable', message: error.message });
  }
});

## Container Deployment

1. Create a production image:
   ```bash
   docker build -t project-category-ml ./ml-service
   ```
2. Run the container locally:
   ```bash
   docker run --rm -p 5002:5002 -e PORT=5002 project-category-ml
   ```
3. Health check:
   ```bash
   curl http://localhost:5002/health
   ```
4. Set `ML_SERVICE_URL` in the backend `.env` (e.g. Railway deployment URL) so Express can proxy requests.

### Suggested Railway Deployment
Create a new service, select "Deploy from Repo" or upload Dockerfile.
Set `PORT` env var to `5002` (or default). After deploy note the public URL and set that as `ML_SERVICE_URL` in the server environment.
```
