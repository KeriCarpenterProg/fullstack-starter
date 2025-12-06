#!/usr/bin/env python3
"""
Interactive script to add training data to training_data.csv
"""
import pandas as pd
import os

CSV_FILE = 'training_data.csv'
CATEGORIES = ['Development', 'Marketing', 'Design', 'Research', 'Operations']

def add_training_example():
    """Add a new training example to the CSV file."""
    
    print("\n=== Add Training Data ===\n")
    
    # Get text input
    text = input("Enter project description: ").strip()
    if not text:
        print("❌ Text cannot be empty")
        return False
    
    # Show category options
    print("\nCategories:")
    for i, cat in enumerate(CATEGORIES, 1):
        print(f"  {i}. {cat}")
    
    # Get category
    while True:
        choice = input(f"\nSelect category (1-{len(CATEGORIES)}): ").strip()
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(CATEGORIES):
                category = CATEGORIES[idx]
                break
            else:
                print(f"❌ Please enter a number between 1 and {len(CATEGORIES)}")
        except ValueError:
            print("❌ Please enter a valid number")
    
    # Confirm
    print(f"\n📝 Adding:")
    print(f"   Text: {text}")
    print(f"   Category: {category}")
    confirm = input("\nSave this example? (y/n): ").strip().lower()
    
    if confirm != 'y':
        print("❌ Cancelled")
        return False
    
    # Load existing data
    if os.path.exists(CSV_FILE):
        df = pd.read_csv(CSV_FILE)
    else:
        df = pd.DataFrame(columns=['text', 'category'])
    
    # Add new row
    new_row = pd.DataFrame({'text': [text], 'category': [category]})
    df = pd.concat([df, new_row], ignore_index=True)
    
    # Save
    df.to_csv(CSV_FILE, index=False)
    print(f"✅ Added! Total examples: {len(df)}")
    
    return True

def show_stats():
    """Show current training data statistics."""
    if not os.path.exists(CSV_FILE):
        print(f"❌ {CSV_FILE} not found")
        return
    
    df = pd.read_csv(CSV_FILE)
    print(f"\n📊 Training Data Statistics")
    print(f"   Total examples: {len(df)}")
    print(f"\n   Distribution:")
    for cat, count in df['category'].value_counts().items():
        print(f"      {cat}: {count}")

def main():
    """Main interactive loop."""
    print("🤖 ML Training Data Manager")
    print("=" * 40)
    
    while True:
        print("\n1. Add training example")
        print("2. Show statistics")
        print("3. Quit")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == '1':
            if add_training_example():
                another = input("\nAdd another? (y/n): ").strip().lower()
                if another != 'y':
                    break
        elif choice == '2':
            show_stats()
        elif choice == '3':
            break
        else:
            print("❌ Invalid choice")
    
    print("\n✨ Done! Don't forget to retrain the model:")
    print("   python train_model.py")

if __name__ == '__main__':
    main()
