# Quick Reference: ML Training Data

## Daily Workflow

### Add New Training Data
```bash
python add_training_data.py
# or manually edit training_data.csv
```

### Retrain Model
```bash
python train_model.py
```

### Test Prediction
```bash
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"Your test text"}'
```

## File Structure

```
ml-service/
├── training_data.csv          ← Edit this to add data
├── train_model.py             ← Run this to retrain
├── add_training_data.py       ← Helper script
├── category_classifier.pkl    ← Generated model (don't edit)
└── app.py                     ← API server
```

## Categories

- **Development**: Code, APIs, bugs, testing
- **Marketing**: Campaigns, content, SEO
- **Design**: UI/UX, mockups, branding
- **Research**: Analysis, user studies
- **Operations**: Infrastructure, monitoring

## Tips

✅ Add 20+ examples per category  
✅ Use realistic project descriptions  
✅ Retrain after every 5-10 new examples  
✅ Test predictions after retraining  

❌ Don't add very short texts (< 3 words)  
❌ Don't duplicate entries  
❌ Don't commit .pkl files to git
