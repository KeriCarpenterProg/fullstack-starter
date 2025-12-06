# ML Service Training Data

## Overview

The ML model is trained on data from `training_data.csv`. This file can be easily updated to improve model accuracy or add new categories.

## File Format

The CSV file must have two columns:
- `text`: The project description or text to classify
- `category`: The category label (Development, Marketing, Design, Research, Operations)

**Example:**
```csv
text,category
Build new API endpoint,Development
Create marketing campaign,Marketing
Design new logo,Design
```

## Adding Training Data

1. Open `training_data.csv`
2. Add new rows with project descriptions and their categories
3. Save the file
4. Retrain the model (see below)

## Categories

Current categories:
- **Development**: Code, APIs, testing, deployment
- **Marketing**: Campaigns, content, SEO, analytics
- **Design**: UI/UX, logos, mockups, visual design
- **Research**: User research, market analysis, benchmarking
- **Operations**: Infrastructure, monitoring, security, DevOps

## Retraining the Model

After updating `training_data.csv`, retrain the model:

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Train the model
python train_model.py
```

This will:
1. Load data from `training_data.csv`
2. Train a new model
3. Save it as both `category_classifier.pkl` and `category_classifier_v1.pkl`
4. Show test predictions

**Note:** The model is saved twice:
- `category_classifier.pkl` - Main model file
- `category_classifier_v1.pkl` - Versioned file (used by the API)

Both files are identical, just with different names for compatibility.

## Best Practices

### Quality Data
- Use diverse, realistic project descriptions
- Include various phrasings for each category
- Aim for balanced representation across categories

### Quantity
- Minimum: ~10 examples per category
- Recommended: 20-50 examples per category
- More data = better accuracy

### Testing
After retraining, test with real project descriptions:
```bash
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"Your test project description"}'
```

## Data Guidelines

**Good Examples:**
```csv
Implement user authentication with JWT,Development
Launch email marketing campaign for Q4,Marketing
Create wireframes for checkout flow,Design
```

**Avoid:**
- Very short texts (< 3 words): "Fix bug"
- Ambiguous descriptions: "Update things"
- Duplicate entries
- Missing category values

## Troubleshooting

**Error: "CSV must have 'text' and 'category' columns"**
- Check that your CSV has exactly these column names (case-sensitive)

**Poor predictions:**
- Add more training examples for problematic categories
- Use more diverse vocabulary
- Check for typos in category names

**Model not updating:**
- Ensure `category_classifier.pkl` was regenerated
- Restart the FastAPI server after retraining

## Example Workflow

```bash
# 1. Edit training data
nano training_data.csv

# 2. Add new examples (at least 5-10 per category)

# 3. Retrain
python train_model.py

# 4. Test
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"Build REST API"}'

# 5. If satisfied, restart server
# Stop with Ctrl+C, then:
uvicorn app:app --reload --port 5002
```

## Version Control

✅ **Commit** `training_data.csv` to git
❌ **Don't commit** `category_classifier.pkl` (generated file)

This allows team members to:
- See training data changes
- Retrain locally with the same data
- Track model improvements over time
