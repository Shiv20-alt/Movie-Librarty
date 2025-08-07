import React, { useState } from 'react';
import { Movie } from '../../types';
import { moviesAPI } from '../../services/api';
import { PencilIcon, TrashIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await moviesAPI.deleteMovie(movie._id);
      onDelete(movie._id);
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Movie Poster */}
      <div className="relative h-64 bg-gray-200">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a1 1 0 001 1h8a1 1 0 001-1V8M9 8h6" />
            </svg>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => onEdit(movie)}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-sm transition-all duration-200"
            title="Edit movie"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 p-2 rounded-full shadow-sm transition-all duration-200"
            title="Delete movie"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {truncateText(movie.title, 30)}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          {truncateText(movie.description, 100)}
        </p>

        {/* Movie Info */}
        <div className="space-y-2 text-sm text-gray-500">
          {movie.genre && (
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                {movie.genre}
              </span>
            </div>
          )}
          
          {movie.releaseYear && (
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{movie.releaseYear}</span>
            </div>
          )}
          
          {movie.rating !== undefined && movie.rating > 0 && (
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{movie.rating}/10</span>
            </div>
          )}
        </div>

        {/* Upload Info */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Added by {movie.uploadedBy.username}</span>
            <span>{formatDate(movie.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Movie</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{movie.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;