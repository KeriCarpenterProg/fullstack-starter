import { useState } from 'react';
import { authAPI, projectsAPI } from './services/api';

function App() {
  const [result, setResult] = useState<string>('Click a button to test!');
  const [loading, setLoading] = useState(false);

  const testSignin = async () => {
    setLoading(true);
    setResult('Testing signin...');
    try {
      const auth = await authAPI.signin('kericarpenter@gmail.com', 'password123');
      setResult(`✅ Signin success! Token: ${auth.token.substring(0, 30)}...`);
      localStorage.setItem('token', auth.token);
    } catch (error) {
      setResult(`❌ Signin failed: ${error}`);
    }
    setLoading(false);
  };

  const testGetProjects = async () => {
    setLoading(true);
    setResult('Testing get projects...');
    try {
      const projects = await projectsAPI.getProjects();
      setResult(`✅ Found ${projects.length} projects: ${JSON.stringify(projects, null, 2)}`);
    } catch (error) {
      setResult(`❌ Get projects failed: ${error}`);
    }
    setLoading(false);
  };

  const testConnection = () => {
    console.log('API functions loaded:', { authAPI, projectsAPI });
  };

  return (
   <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Frontend + Backend Test</h1>

      {/* <button onClick={testConnection}>
        Test API Import (check console)
      </button> */}
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testSignin} disabled={loading} style={{ marginRight: '10px' }}>
          Test Signin
        </button>
        <button onClick={testGetProjects} disabled={loading}>
          Test Get Projects
        </button>
      </div>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        fontFamily: 'monospace'
      }}>
        {loading ? '⏳ Loading...' : result}
      </div>
    </div>
  );
}

export default App;