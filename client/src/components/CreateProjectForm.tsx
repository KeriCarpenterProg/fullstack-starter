import { useState, useEffect } from "react";
import { projectsAPI, mlAPI } from "../services/api";
import type { MlPrediction } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { categoryConfig } from "../utils/categoryUtils";

interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [previousCategory, setPreviousCategory] = useState("uncategorized");
  const [loading, setLoading] = useState(false);

  // ML suggestion state
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [suggestedConfidence, setSuggestedConfidence] = useState<number | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const debouncedDescription = useDebounce(description, 600);

  // Fetch ML category suggestion when description changes (debounced)
  useEffect(() => {
    if (!debouncedDescription || debouncedDescription.trim().length < 4) {
      setSuggestedCategory(null);
      setSuggestedConfidence(null);
      setSuggestionError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setSuggestionLoading(true);
      setSuggestionError(null);
      try {
        const prediction: MlPrediction = await mlAPI.predictCategory(debouncedDescription);
        if (cancelled) return;

        setSuggestedCategory(prediction.category);
        setSuggestedConfidence(prediction.confidence);

        // Always auto-fill category with new suggestion
        setPreviousCategory(category);
        setCategory(prediction.category);
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Failed to get suggestion";
          setSuggestionError(errorMessage);
          setSuggestedCategory(null);
          setSuggestedConfidence(null);
        }
      } finally {
        if (!cancelled) {
          setSuggestionLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedDescription, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projectsAPI.createProject(title, description, category);
      setTitle("");
      setDescription("");
      setCategory("uncategorized");
      setSuggestedCategory(null);
      setSuggestedConfidence(null);
      onProjectCreated();
    } catch (error) {
      alert(`Failed to create project: ${error}`);
    }
    setLoading(false);
  };

  const acceptSuggestion = () => {
    if (suggestedCategory) {
      setPreviousCategory(category);
      setCategory(suggestedCategory);
      setSuggestedCategory(null);
      setSuggestedConfidence(null);
    }
  };

  const dismissSuggestion = () => {
    setCategory(previousCategory);
    setSuggestedCategory(null);
    setSuggestedConfidence(null);
  };

  return (
    <div className="create-project-section">
      <h2>Create New Project</h2>
      <div className="category-info">
        <strong>Available categories:</strong>
        <div className="category-list">
          {Object.entries(categoryConfig)
            .filter(([key]) => key !== 'uncategorized')
            .map(([name, style]) => (
              <span
                key={name}
                className="category-chip"
                style={{
                  backgroundColor: style.bgColor,
                  color: style.color,
                  borderColor: style.color,
                }}
              >
                <span>{style.icon}</span>
                {name}
              </span>
            ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="project-title">Title</label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="project-description">Description</label>
            <input
              id="project-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
            />
          </div>

          <div className="form-field">
            <label htmlFor="project-category">Category</label>
            <input
              id="project-category"
              type="text"
              value={category}
              onChange={(e) => {
                setPreviousCategory(category);
                setCategory(e.target.value);
              }}
              placeholder="Category"
            />
            {/* ML Suggestion under category field */}
            {(suggestionLoading || suggestedCategory || suggestionError) && (
              <div className="category-suggestion">
                {suggestionLoading && (
                  <p className="muted">Predicting category...</p>
                )}
                {!suggestionLoading && suggestionError && (
                  <p className="error-text">{suggestionError}</p>
                )}
                {!suggestionLoading && suggestedCategory && (
                  <div className="suggestion-box">
                    <div className="suggestion-text">
                      <strong>Suggested:</strong> {suggestedCategory}
                      {suggestedConfidence !== null && (
                        <small>
                          {" "}
                          (confidence {(suggestedConfidence * 100).toFixed(1)}%)
                        </small>
                      )}
                    </div>
                    <div className="suggestion-actions">
                      <button
                        type="button"
                        onClick={acceptSuggestion}
                        className="accept-btn"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={dismissSuggestion}
                        className="dismiss-btn"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? "⏳" : "+ Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
