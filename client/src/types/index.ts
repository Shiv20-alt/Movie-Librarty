export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  posterUrl?: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface MoviesResponse {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalMovies: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface MovieFormData {
  title: string;
  description: string;
  genre?: string;
  releaseYear?: number;
  rating?: number;
  posterUrl?: string;
}