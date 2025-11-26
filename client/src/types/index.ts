// Types that match your backend API responses

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category?: string; // added category (optional in older rows before migration sync)
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

export interface MlPrediction {
  category: string;
  confidence: number;
  probabilities?: Record<string, number>;
}
