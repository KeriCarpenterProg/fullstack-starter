import { useState, useEffect } from 'react';
import { authAPI, projectsAPI } from './services/api';
import type { Project } from './types';
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
      await projectsAPI.createProject(newProjectTitle, newProjectDescription);
      setNewProjectTitle('');
      setNewProjectDescription('');
      await loadProjects();
    } catch (error) {
      alert(`Failed to create project: ${error}`);
    }
    setLoading(false);
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
              <button type="submit" disabled={loading} className="primary-button">
                {loading ? '⏳' : '+ Add Project'}
              </button>
            </div>
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
    </div>
  );
}

export default App;