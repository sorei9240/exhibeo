import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExhibition } from '../context/ExhibitionContext';

function Exhibitions() {
  const { exhibitions, createExhibition, deleteExhibition } = useExhibition();
  const [isCreating, setIsCreating] = useState(false);
  const [newExhibition, setNewExhibition] = useState({
    name: '',
    description: ''
  });

  // new exhibition handler
  const handleCreateExhibition = (e) => {
    e.preventDefault();
    if (newExhibition.name.trim()) {
      createExhibition(newExhibition.name.trim(), newExhibition.description.trim());
      setNewExhibition({ name: '', description: '' });
      setIsCreating(false);
    }
  };

  // date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Exhibitions</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your personal art exhibitions
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isCreating ? 'Cancel' : 'New Exhibition'}
        </button>
      </div>

      {/* create exhibition form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Exhibition</h2>
          <form onSubmit={handleCreateExhibition} className="space-y-4">
            <div>
              <label htmlFor="exhibition-name" className="block text-sm font-medium text-gray-700 mb-1">
                Exhibition Name
              </label>
              <input
                type="text"
                id="exhibition-name"
                value={newExhibition.name}
                onChange={(e) => setNewExhibition(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter exhibition name"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="exhibition-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="exhibition-description"
                value={newExhibition.description}
                onChange={(e) => setNewExhibition(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter exhibition description"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Exhibition
              </button>
            </div>
          </form>
        </div>
      )}

      {/* exhibitions list */}
      {exhibitions.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Exhibitions Yet</h2>
          <p className="text-gray-600">Create your first exhibition to start curating artworks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map(exhibition => (
            <div key={exhibition.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/exhibitions/${exhibition.id}`} className="block p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{exhibition.name}</h3>
                {exhibition.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{exhibition.description}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {exhibition.artworks.length} artwork{exhibition.artworks.length !== 1 ? 's' : ''}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Created {formatDate(exhibition.createdAt)}
                  </span>
                </div>
                
                {/* preview images */}
                {exhibition.artworks.length > 0 && (
                  <div className="flex -space-x-2 mb-4">
                    {exhibition.artworks.slice(0, 3).map((artwork, index) => (
                      <div key={`${artwork.id}-${index}`} className="relative">
                        {artwork.thumbnailUrl ? (
                          <img
                            src={artwork.thumbnailUrl}
                            alt={artwork.title}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                        )}
                      </div>
                    ))}
                    {exhibition.artworks.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">+{exhibition.artworks.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </Link>
              
              {/* actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <Link
                    to={`/exhibitions/${exhibition.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Exhibition
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm('Are you sure you want to delete this exhibition?')) {
                        deleteExhibition(exhibition.id);
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Exhibitions;