import axios from 'axios';
import { AuthResponse, MoviesResponse, Movie, MovieFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Movies API
export const moviesAPI = {
  getMovies: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<MoviesResponse> => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  getMovie: async (id: string): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  createMovie: async (movieData: MovieFormData): Promise<{ message: string; movie: Movie }> => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },

  updateMovie: async (id: string, movieData: Partial<MovieFormData>): Promise<{ message: string; movie: Movie }> => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },

  getMyMovies: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<MoviesResponse> => {
    const response = await api.get('/movies/user/my-movies', { params });
    return response.data;
  }
};

export default api;