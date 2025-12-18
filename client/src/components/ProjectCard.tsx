import { useState } from "react";
import { projectsAPI } from "../services/api";
import type { Project, SimilarProject } from "../types";
import { getCategoryStyle, getSimilarityColor } from "../utils/categoryUtils";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string, projectTitle: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryStyle = getCategoryStyle(project.category || "uncategorized");

  const fetchSimilarProjects = async () => {
    if (similarProjects.length > 0) {
      // Already cached, just toggle
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const similar = await projectsAPI.getSimilarProjects(project.id, 5);
      setSimilarProjects(similar);
      setIsExpanded(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch similar projects";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSimilar = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      fetchSimilarProjects();
    }
  };

  return (
    <div className="project-card-wrapper">
      <div className="project-card">
        <div className="project-card-header">
          <h3>{project.title}</h3>
          <button
            className="delete-button"
            onClick={() => onDelete(project.id, project.title)}
            title="Delete project"
          >
            🗑️
          </button>
        </div>
        <p>{project.description || "No description"}</p>
        <div className="project-meta">
          <span
            className="category-badge"
            style={{
              backgroundColor: categoryStyle.bgColor,
              color: categoryStyle.color,
              borderColor: categoryStyle.color,
            }}
          >
            <span className="category-icon">{categoryStyle.icon}</span>
            {project.category || "uncategorized"}
          </span>
          <small className="project-date">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </small>
        </div>
        <button
          className="similar-button"
          onClick={handleToggleSimilar}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Hide' : 'Find'} similar projects`}
        >
          {isExpanded ? "▼ Hide Similar" : "▶ Find Similar"}
        </button>
      </div>

      {isExpanded && (
        <div className="similar-projects-section">
          {isLoading && (
            <div className="similar-projects-content">
              <p className="loading">Loading similar projects...</p>
            </div>
          )}
          {error && (
            <div className="similar-projects-content">
              <p className="error-message">{error}</p>
            </div>
          )}
          {!isLoading && !error && similarProjects.length === 0 && (
            <div className="similar-projects-content">
              <p className="similar-projects-empty">
                No similar projects found. This project may not have an embedding yet.
              </p>
            </div>
          )}
          {!isLoading && !error && similarProjects.length > 0 && (
            <div className="similar-projects-content">
              <p className="similar-projects-header">Similar Projects:</p>
              <div className="similar-project-list">
                {similarProjects.map((similar) => {
                  const similarCategoryStyle = getCategoryStyle(similar.category || "uncategorized");
                  const similarityPercent = Math.round(similar.similarityScore * 100);
                  const similarityColor = getSimilarityColor(similar.similarityScore);

                  return (
                    <div key={similar.id} className="similar-project-item">
                      <div className="similar-project-info">
                        <h4>{similar.title}</h4>
                        <p className="similar-project-desc">{similar.description || "No description"}</p>
                        <span
                          className="similar-category-badge"
                          style={{
                            backgroundColor: similarCategoryStyle.bgColor,
                            color: similarCategoryStyle.color,
                          }}
                        >
                          {similarCategoryStyle.icon} {similar.category || "uncategorized"}
                        </span>
                      </div>
                      <div
                        className="similarity-score"
                        style={{ backgroundColor: similarityColor }}
                        title={`${similarityPercent}% similarity`}
                      >
                        {similarityPercent}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
