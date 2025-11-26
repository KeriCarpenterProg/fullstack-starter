import axios from "axios";
import type { Project, AuthResponse, MlPrediction } from "../types";

// Base configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  async signin(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
  },

  async signup(
    email: string,
    password: string,
    name?: string,
  ): Promise<AuthResponse> {
    const response = await api.post("/auth/signup", { email, password, name });
    return response.data;
  },
};

// Projects API calls
export const projectsAPI = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get("/projects");
    return response.data;
  },

  async createProject(
    title: string,
    description?: string,
    category?: string,
  ): Promise<Project> {
    const payload: Record<string, any> = { title };
    if (description && description.trim().length)
      payload.description = description;
    if (category && category.trim().length) payload.category = category;
    const response = await api.post("/projects", payload);
    return response.data;
  },

  async updateProject(
    id: string,
    title?: string,
    description?: string,
    category?: string,
  ): Promise<Project> {
    const payload: Record<string, any> = {};
    if (title && title.trim().length) payload.title = title;
    if (description && description.trim().length)
      payload.description = description;
    if (category && category.trim().length) payload.category = category;
    const response = await api.put(`/projects/${id}`, payload);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

// ML prediction API
export const mlAPI = {
  async predictCategory(text: string): Promise<MlPrediction> {
    const response = await api.post("/ml/predict-category", { text });
    return response.data;
  },
};
