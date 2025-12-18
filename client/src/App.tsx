import { useState, useEffect } from "react";
import { projectsAPI } from "./services/api";
import type { User, Project } from "./types";
import { AuthForm } from "./components/AuthForm";
import { ProjectCard } from "./components/ProjectCard";
import { CreateProjectForm } from "./components/CreateProjectForm";
import "./App.css";

// Generate avatar URL from user name
function getAvatarUrl(name?: string | null, email?: string): string {
  const displayName = name || email?.split('@')[0] || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7c3aed&color=fff&size=128`;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      loadProjects();
    }
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await projectsAPI.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    loadProjects();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProjects([]);
    setIsAuthenticated(false);
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      return;
    }
    
    try {
      await projectsAPI.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      alert(`Failed to delete project: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>🚀 My Projects</h1>
          <div className="user-info">
            <img 
              src={getAvatarUrl(user?.name, user?.email)} 
              alt={user?.name || user?.email || 'User avatar'}
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <CreateProjectForm onProjectCreated={loadProjects} />

          <div className="projects-section">
            <h2>Your Projects ({projects.length})</h2>
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Create your first project above! 👆</p>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
