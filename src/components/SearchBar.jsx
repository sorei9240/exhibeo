import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function SearchBar({ onSearch, initialSearchTerm = '' }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('q') !== null ? searchParams.get('q') : initialSearchTerm || ''
  );
  const [source, setSource] = useState(searchParams.get('source') || 'all');

  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    const sourceFromUrl = searchParams.get('source');

    let newSearchTermValue;
    if (queryFromUrl !== null) { 
      newSearchTermValue = queryFromUrl;
    } else { 
      newSearchTermValue = initialSearchTerm || ''; // if q param not in URL fallback to initial term
    }

    if (newSearchTermValue !== searchTerm) {
      setSearchTerm(newSearchTermValue);
    }

    const newSourceValue = sourceFromUrl || 'all';
    if (newSourceValue !== source) {
      setSource(newSourceValue);
    }
  }, [searchParams, initialSearchTerm]);

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // navigate to search page with proper parameters
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&source=${source}`);
      
      // call search handler 
      if (onSearch) {
        onSearch({
          searchTerm: searchTerm.trim(),
          sources: source === 'all' ? ['all'] : [source]
        });
      }
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        {/* Input bar for search */}
        <div className="flex-grow">
          <label htmlFor="search-input" className="sr-only">Search artworks</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for artworks, artists, cultures..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search term"
          />
        </div>

        {/* Source selection */}
        <div className="md:w-48">
          <label htmlFor="source-selector" className="sr-only">Select source</label>
          <select
            id="source-selector"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Collection source"
          >
            <option value="all">All Collections</option>
            <option value="metropolitan">Metropolitan Museum</option>
            <option value="harvard">Harvard Art Museums</option>
          </select>
        </div>
        
        {/* Search button */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Search"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;