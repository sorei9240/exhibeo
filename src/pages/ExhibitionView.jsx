import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExhibition } from '../context/ExhibitionContext';
import ArtworkCard from '../components/ArtworkCard';

function ExhibitionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exhibitions, removeFromExhibition, renameExhibition } = useExhibition();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const exhibition = exhibitions.find(ex => ex.id === id);

  React.useEffect(() => {
    if (exhibition) {
      setEditForm({
        name: exhibition.name,
        description: exhibition.description || ''
      });
    }
  }, [exhibition]);

  if (!exhibition) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Exhibition Not Found</h1>
        <p className="text-gray-600 mb-6">The exhibition you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/exhibitions')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Exhibitions
        </button>
      </div>
    );
  }

  const handleRemoveArtwork = (artwork) => {
    if (window.confirm('Are you sure you want to remove this artwork from the exhibition?')) {
      removeFromExhibition(exhibition.id, artwork.id, artwork.source);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editForm.name.trim()) {
      renameExhibition(exhibition.id, editForm.name.trim(), editForm.description.trim());
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* back button */}
      <button
        onClick={() => navigate('/exhibitions')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        aria-label="Back to exhibitions"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Exhibitions
      </button>

      {/* exhibition header */}
      <div className="mb-8">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 text-2xl font-bold border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
              autoFocus
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter exhibition description"
              rows="3"
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{exhibition.name}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Edit exhibition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            {exhibition.description && (
              <p className="text-lg text-gray-600 mt-2">{exhibition.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exhibition.artworks.length} artwork{exhibition.artworks.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {formatDate(exhibition.createdAt)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* artworks grid */}
      {exhibition.artworks.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Artworks in Exhibition</h2>
          <p className="text-gray-600">Add artworks to your exhibition to start curating your collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exhibition.artworks.map(artwork => (
            <div key={`${artwork.source}-${artwork.id}`} className="relative">
              <button
                onClick={() => handleRemoveArtwork(artwork)}
                className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-red-100 transition-colors"
                aria-label="Remove artwork"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ArtworkCard 
                artwork={artwork} 
                showAddToExhibition={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExhibitionView;