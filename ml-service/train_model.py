"""
Train a project category classifier
"""
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib

# Sample training data
# In production, you'd load this from your database
training_data = [
    # Development
    ("Test", "Development"),
    ("Development", "Development"),
    ("Build new API endpoint for user authentication", "Development"),
    ("Fix bug in payment processing", "Development"),
    ("Implement React component for dashboard", "Development"),
    ("Set up CI/CD pipeline", "Development"),
    ("Refactor database queries", "Development"),
    ("Add TypeScript types", "Development"),
    
    # Marketing
    ("Marketing", "Marketing"),
    ("Create social media campaign", "Marketing"),    
    ("Design email newsletter", "Marketing"),
    ("Plan product launch strategy", "Marketing"),
    ("Analyze user engagement metrics", "Marketing"),
    ("Write blog post about features", "Marketing"),
    ("SEO optimization for landing page", "Marketing"),
    
    # Design
    ("Design", "Design"),
    ("Design new logo", "Design"),
    ("Create wireframes for mobile app", "Design"),
    ("Update color scheme", "Design"),
    ("Design marketing materials", "Design"),
    ("Create UI mockups", "Design"),
    ("Redesign user profile page", "Design"),
    
    # Research
    ("Research", "Research"),
    ("Research competitor features", "Research"),
    ("User research interviews", "Research"),
    ("Analyze market trends", "Research"),
    ("Investigate new technologies", "Research"),
    ("Study user behavior patterns", "Research"),
    ("Benchmark performance", "Research"),
    
    # Operations
    ("Operations", "Operations"),
    ("Set up monitoring dashboard", "Operations"),
    ("Configure cloud infrastructure", "Operations"),
    ("Implement backup strategy", "Operations"),
    ("Optimize server performance", "Operations"),
    ("Database maintenance", "Operations"),
    ("Update security policies", "Operations"),
]

# Prepare data
texts = [item[0] for item in training_data]
labels = [item[1] for item in training_data]

# Create and train pipeline
model = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
    ('clf', MultinomialNB())
])

print("Training model...")
model.fit(texts, labels)

# Save the model
joblib.dump(model, 'category_classifier.pkl')
print("Model saved to category_classifier.pkl")

# Test predictions
test_cases = [
    "Add new feature to dashboard",
    "Create marketing campaign",
    "Design new icon set",
    "Research best practices"
]

print("\nTest predictions:")
for text in test_cases:
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    confidence = max(probabilities)
    print(f"  '{text}' -> {prediction} (confidence: {confidence:.2%})")
