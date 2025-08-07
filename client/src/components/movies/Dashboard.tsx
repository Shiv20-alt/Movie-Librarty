import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Movie } from '../../types';
import { moviesAPI } from '../../services/api';
import MovieCard from './MovieCard';
import MovieForm from './MovieForm';
import SearchBar from './SearchBar';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError('');
      const response = await moviesAPI.getMovies({
        page,
        limit: 12,
        search: search || undefined,
        sortBy: 'uploadedAt',
        sortOrder: 'desc'
      });
      setMovies(response.movies);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchMovies(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(page, searchTerm);
  };

  const handleMovieAdded = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
    setShowAddModal(false);
  };

  const handleMovieUpdated = (updatedMovie: Movie) => {
    setMovies(prev => prev.map(movie => 
      movie._id === updatedMovie._id ? updatedMovie : movie
    ));
    setEditingMovie(null);
  };

  const handleMovieDeleted = (movieId: string) => {
    setMovies(prev => prev.filter(movie => movie._id !== movieId));
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a1 1 0 001 1h8a1 1 0 001-1V8M9 8h6" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Movie Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Movie
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a1 1 0 001 1h8a1 1 0 001-1V8M9 8h6" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No movies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first movie.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onEdit={handleEditMovie}
                onDelete={handleMovieDeleted}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Add Movie Modal */}
      {showAddModal && (
        <MovieForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleMovieAdded}
        />
      )}

      {/* Edit Movie Modal */}
      {editingMovie && (
        <MovieForm
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSuccess={handleMovieUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;