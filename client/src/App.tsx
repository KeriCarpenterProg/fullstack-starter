import { useState, useEffect } from 'react';
import { authAPI, projectsAPI, mlAPI } from './services/api';
import type { Project, MlPrediction } from './types';
import { useDebounce } from './hooks/useDebounce';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'dashboard'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('uncategorized');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [suggestedConfidence, setSuggestedConfidence] = useState<number | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const debouncedDescription = useDebounce(newProjectDescription, 600);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setActiveTab('dashboard');
      loadProjects();
    }
  }, []);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = await authAPI.signin(email, password);
      localStorage.setItem('token', auth.token);
      setUser(auth.user);
      setActiveTab('dashboard');
      await loadProjects();
    } catch (error) {
      alert(`Signin failed: ${error}`);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = await authAPI.signup(email, password, name);
      localStorage.setItem('token', auth.token);
      setUser(auth.user);
      setActiveTab('dashboard');
      await loadProjects();
    } catch (error) {
      alert(`Signup failed: ${error}`);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProjects([]);
    setActiveTab('login');
    setEmail('');
    setPassword('');
    setName('');
  };

  const loadProjects = async () => {
    try {
      const projectList = await projectsAPI.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projectsAPI.createProject(newProjectTitle, newProjectDescription, newProjectCategory);
      setNewProjectTitle('');
      setNewProjectDescription('');
      setNewProjectCategory('uncategorized');
      setSuggestedCategory(null);
      setSuggestedConfidence(null);
      await loadProjects();
    } catch (error) {
      alert(`Failed to create project: ${error}`);
    }
    setLoading(false);
  };

  // Fetch ML category suggestion when description changes (debounced)
  useEffect(() => {
    // Basic guard: avoid predictions for very short or empty text
    if (!debouncedDescription || debouncedDescription.trim().length < 8) {
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
        console.log('ML Prediction:', prediction); // Add this line
        // Optional confidence threshold
        if (prediction.confidence < 0.25) {
          setSuggestedCategory(null);
          setSuggestedConfidence(null);
          return;
        }
        setSuggestedCategory(prediction.category);
        console.log("Suggested Category:", prediction.category);
        setSuggestedConfidence(prediction.confidence);
      } catch (err: any) {
        if (!cancelled) {
          setSuggestionError(err.message || 'Failed to get suggestion');
          setSuggestedCategory(null);
          setSuggestedConfidence(null);
        }
      } finally {
        !cancelled && setSuggestionLoading(false);
      }
      
    })();
    return () => { cancelled = true; };
  }, [debouncedDescription]);

  const acceptSuggestion = () => {
    if (suggestedCategory) {
      setNewProjectCategory(suggestedCategory);
      setSuggestedCategory(null); // hide suggestion after accepting
    }
  };

  const dismissSuggestion = () => {
    setSuggestedCategory(null);
    setSuggestedConfidence(null);
  };

  const renderAuth = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 Project Manager</h1>
        
        <div className="tab-buttons">
          <button 
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={activeTab === 'login' ? handleSignin : handleSignup}>
          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="primary-button">
            {loading ? '⏳ Please wait...' : (activeTab === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚀 My Projects</h1>
        <div className="user-info">
          <span>Welcome, {user?.email || 'User'}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="create-project-section">
          <h2>Create New Project</h2>
          <form onSubmit={handleCreateProject} className="create-project-form">
            <div className="form-row">
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project title"
                required
              />
              <input
                type="text"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project description"
              />
              <input
                type="text"
                value={newProjectCategory}
                onChange={(e) => setNewProjectCategory(e.target.value)}
                placeholder="Category (or accept suggestion)"
              />
              
              <button type="submit" disabled={loading} className="primary-button">
                {loading ? '⏳' : '+ Add Project'}
              </button>
            </div>
            {/* Suggestion panel */}
            {(suggestionLoading || suggestedCategory || suggestionError) && (
              <div className="suggestion-panel">
                {suggestionLoading && <p className="muted">Predicting category...</p>}
                {!suggestionLoading && suggestionError && (
                  <p className="error-text">{suggestionError}</p>
                )}
                {!suggestionLoading && suggestedCategory && (
                  <div className="suggestion-box">
                    <strong>Suggested:</strong> {suggestedCategory}
                    {suggestedConfidence !== null && (
                      <small> (confidence {(suggestedConfidence * 100).toFixed(1)}%)</small>
                    )}
                    <div className="suggestion-actions">
                      <button type="button" onClick={acceptSuggestion} className="accept-btn">Accept</button>
                      <button type="button" onClick={dismissSuggestion} className="dismiss-btn">Dismiss</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="projects-section">
          <h2>Your Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Create your first project above! 👆</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description || 'No description'}</p>
                  <div className="project-meta">
                    <small>Category: {project.category || 'uncategorized'}</small><br />
                    <small>Created: {new Date(project.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <div className="app">
      {activeTab === 'dashboard' ? renderDashboard() : renderAuth()}
      <button onClick={() => setSuggestionLoading(true)}>Simulate Loading</button>
    </div>
  );
}

export default App;