import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExhibition } from '../context/ExhibitionContext';

function ArtworkCard({ artwork, showAddToExhibition = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { exhibitions, addToExhibition } = useExhibition();
  
  // handle any missing data
  const {
    id,
    title = 'Untitled',
    artist = 'Unknown Artist',
    date = 'Unknown Date',
    thumbnailUrl,
    source
  } = artwork || {};
  
  if (!artwork || !id) {
    return null;
  }
  
  // add artwork to exhibit handler
  const handleAddToExhibition = (exhibitionId) => {
    addToExhibition(exhibitionId, artwork);
    setIsModalOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {/* image */}
      <Link to={`/artwork/${source}/${id}`} className="block overflow-hidden h-48 relative">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2">
          <span className="text-xs font-medium uppercase tracking-wider">
            {source === 'metropolitan' ? 'The Met' : 'Harvard'}
          </span>
        </div>
      </Link>
      
      {/* info */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
          <Link to={`/artwork/${source}/${id}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h3>
        
        <div className="mt-1 text-sm text-gray-600 line-clamp-1">{artist}</div>
        <div className="mt-1 text-xs text-gray-500">{date}</div>
        
        {/* buttons */}
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/artwork/${source}/${id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
          
          {showAddToExhibition && exhibitions.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded transition-colors"
              aria-label="Add to exhibition"
            >
              Add to Exhibition
            </button>
          )}
        </div>
      </div>
      
      {/* exhibition selection modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add to Exhibition</h3>
            
            {exhibitions.length === 0 ? (
              <p className="text-gray-600">No exhibitions to show yet. Create one from the Exhibitions page!</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {exhibitions.map(exhibition => (
                  <button
                    key={exhibition.id}
                    onClick={() => handleAddToExhibition(exhibition.id)}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium">{exhibition.name}</span>
                    <span className="text-xs text-gray-500">
                      {exhibition.artworks.length} item{exhibition.artworks.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <Link
                to="/exhibitions"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Manage Exhibitions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtworkCard;