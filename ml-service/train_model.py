"""
Train a project category classifier
"""
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os

# Load training data from CSV file
def load_training_data(csv_path='training_data.csv'):
    """Load training data from a CSV file with 'text' and 'category' columns."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Training data file not found: {csv_path}")
    
    df = pd.read_csv(csv_path)
    
    # Validate required columns
    if 'text' not in df.columns or 'category' not in df.columns:
        raise ValueError("CSV must have 'text' and 'category' columns")
    
    # Remove any rows with missing values
    df = df.dropna()
    
    print(f"Loaded {len(df)} training examples from {csv_path}")
    print(f"Categories: {df['category'].unique().tolist()}")
    print(f"Distribution:\n{df['category'].value_counts()}")
    
    return df['text'].tolist(), df['category'].tolist()

# Load data
texts, labels = load_training_data()

# Create and train pipeline
model = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
    ('clf', MultinomialNB())
])

print("Training model...")
model.fit(texts, labels)

# Save the model with version
# Save both non-versioned (for compatibility) and versioned (for API)
joblib.dump(model, 'category_classifier.pkl')
joblib.dump(model, 'category_classifier_v1.pkl')
print("Model saved to category_classifier.pkl and category_classifier_v1.pkl")

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
