import axios from 'axios';
import type { Project, AuthResponse } from '../types';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  async signin(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  },

  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },
};

// Projects API calls
export const projectsAPI = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  },

  async createProject(title: string, description?: string): Promise<Project> {
    const response = await api.post('/projects', { title, description });
    return response.data;
  },

  async updateProject(id: string, title?: string, description?: string): Promise<Project> {
    const response = await api.put(`/projects/${id}`, { title, description });
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};