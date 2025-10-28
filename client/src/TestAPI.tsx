import { useState } from 'react';
import { authAPI, projectsAPI } from './services/api';

function TestAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSignin = async () => {
    setLoading(true);
    try {
      const auth = await authAPI.signin('kericarpenter@gmail.com', 'password123');
      setResult(`✅ Signin success! Token: ${auth.token.substring(0, 20)}...`);
      localStorage.setItem('token', auth.token);
    } catch (error) {
      setResult(`❌ Signin failed: ${error}`);
    }
    setLoading(false);
  };

  const testGetProjects = async () => {
    setLoading(true);
    try {
      const projects = await projectsAPI.getProjects();
      setResult(`✅ Found ${projects.length} projects: ${JSON.stringify(projects, null, 2)}`);
    } catch (error) {
      setResult(`❌ Get projects failed: ${error}`);
    }
    setLoading(false);
  };

  const testCreateProject = async () => {
    setLoading(true);
    try {
      const project = await projectsAPI.createProject('Frontend Test Project', 'Created from React!');
      setResult(`✅ Created project: ${JSON.stringify(project, null, 2)}`);
    } catch (error) {
      setResult(`❌ Create project failed: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Test</h2>
      <button onClick={testSignin} disabled={loading}>
        Test Signin
      </button>
      <button onClick={testGetProjects} disabled={loading}>
        Test Get Projects
      </button>
      <button onClick={testCreateProject} disabled={loading}>
        Test Create Project
      </button>
      
      {loading && <p>Loading...</p>}
      
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '20px' }}>
        {result}
      </pre>
    </div>
  );
}

export default TestAPI;