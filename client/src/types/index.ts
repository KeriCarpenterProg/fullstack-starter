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