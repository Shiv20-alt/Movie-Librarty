import React, { useState, useEffect } from 'react';
import { Movie, MovieFormData } from '../../types';
import { moviesAPI } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
  onSuccess: (movie: Movie) => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    genre: '',
    releaseYear: undefined,
    rating: undefined,
    posterUrl: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!movie;

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description,
        genre: movie.genre || '',
        releaseYear: movie.releaseYear,
        rating: movie.rating,
        posterUrl: movie.posterUrl || ''
      });
    }
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clean up form data
      const cleanedData: MovieFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ...(formData.genre?.trim() && { genre: formData.genre.trim() }),
        ...(formData.releaseYear && { releaseYear: formData.releaseYear }),
        ...(formData.rating && { rating: formData.rating }),
        ...(formData.posterUrl?.trim() && { posterUrl: formData.posterUrl.trim() })
      };

      let response;
      if (isEditMode && movie) {
        response = await moviesAPI.updateMovie(movie._id, cleanedData);
      } else {
        response = await moviesAPI.createMovie(cleanedData);
      }

      onSuccess(response.movie);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'rating' 
        ? value === '' ? undefined : Number(value)
        : value
    }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter movie title"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter movie description"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Genre and Release Year Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Action, Comedy, Drama"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-2">
                Release Year
              </label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear || ''}
                onChange={handleInputChange}
                min={1900}
                max={currentYear + 5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 2023"
              />
            </div>
          </div>

          {/* Rating and Poster URL Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-10)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating || ''}
                onChange={handleInputChange}
                min={0}
                max={10}
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 8.5"
              />
            </div>

            <div>
              <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>

          {/* Preview Poster */}
          {formData.posterUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster Preview
              </label>
              <div className="w-32 h-48 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={formData.posterUrl}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = 
                      '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">Invalid URL</div>';
                  }}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Movie' : 'Add Movie'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;