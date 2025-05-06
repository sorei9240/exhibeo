import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useExhibition } from '../hooks/useExhibition.js';
import { useArtworks } from '../hooks/useArtworks';

function ArtworkView() {
  const { source, id } = useParams();
  const navigate = useNavigate();
  const { fetchArtworkById } = useArtworks();
  const { exhibitions, addToExhibition } = useExhibition();
  
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadArtwork = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArtworkById(id, source);
        if (!data) {
          throw new Error('Artwork not found');
        }
        setArtwork(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtwork();
  }, [id, source, fetchArtworkById]);

  const handleAddToExhibition = (exhibitionId) => {
    addToExhibition(exhibitionId, artwork);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artwork Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The requested artwork could not be found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* image section */}
        <div className="aspect-square lg:aspect-auto relative">
          {artwork.imageUrl ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-contain rounded-lg shadow-lg bg-gray-100"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* details section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
            <p className="text-xl text-gray-700">{artwork.artist}</p>
            <p className="text-lg text-gray-600">{artwork.date}</p>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Exhibition
            </button>
            {artwork.objectUrl && (
              <a
                href={artwork.objectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View on Museum Website
              </a>
            )}
          </div>

          {/* metadata */}
          <div className="space-y-4">
            {artwork.medium && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Medium</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.medium}</p>
              </div>
            )}

            {artwork.dimensions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Dimensions</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.dimensions}</p>
              </div>
            )}

            {artwork.culture && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Culture</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.culture}</p>
              </div>
            )}

            {artwork.department && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Department</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.department}</p>
              </div>
            )}

            {artwork.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.description}</p>
              </div>
            )}

            {artwork.provenance && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Provenance</h3>
                <p className="mt-1 text-lg text-gray-900">{artwork.provenance}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Source</h3>
              <p className="mt-1 text-lg text-gray-900">
                {source === 'metropolitan' ? 'The Metropolitan Museum of Art' : 'Harvard Art Museums'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* exhibition selection modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add to Exhibition</h3>
            <p className="text-gray-600 mb-6">Select an exhibition to add "{artwork.title}" to:</p>
            
            {exhibitions.length === 0 ? (
              <p className="text-gray-600 mb-6">You don't have any exhibitions yet. Create one from the Exhibitions page.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {exhibitions.map(exhibition => (
                  <button
                    key={exhibition.id}
                    onClick={() => handleAddToExhibition(exhibition.id)}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium block">{exhibition.name}</span>
                    <span className="text-sm text-gray-500">
                      {exhibition.artworks.length} item{exhibition.artworks.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/exhibitions')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Manage Exhibitions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtworkView;