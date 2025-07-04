import React, { useState } from 'react';

function Filters({ onFilterChange, currentFilters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    sortBy: currentFilters.sortBy || 'relevance',
    medium: currentFilters.medium || '',
    excludeXrays: currentFilters.excludeXrays !== false // exclude x-rays by default
  });

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      sortBy: 'relevance',
      medium: '',
      excludeXrays: true
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Filters button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      {/* Dropdown for filters */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 border border-gray-200" onClick={e => e.stopPropagation()}>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters and Sorting</h3>

            {/* Sorting options */}
            <div className="mb-4">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort-by"
                value={localFilters.sortBy}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="title">Title (A-Z)</option>
                <option value="artist">Artist (A-Z)</option>
                <option value="date-newest">Date (Newest First)</option>
                <option value="date-oldest">Date (Oldest First)</option>
              </select>
            </div>

            {/* Medium filter */}
            <div className="mb-4">
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-2">
                Medium
              </label>
              <select
                id="medium"
                value={localFilters.medium}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, medium: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Media Types</option>
                <option value="paintings">Paintings</option>
                <option value="sculpture">Sculptures</option>
                <option value="prints">Prints</option>
                <option value="photographs">Photographs</option>
                <option value="drawings">Drawings</option>
                <option value="textiles">Textiles</option>
                <option value="ceramics">Ceramics</option>
                <option value="metalwork">Metalwork</option>
                <option value="glass">Glass</option>
              </select>
            </div>

            {/* X-ray exclusion toggle */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="exclude-xrays"
                  type="checkbox"
                  checked={localFilters.excludeXrays}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, excludeXrays: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="exclude-xrays" className="ml-2 block text-sm text-gray-700">
                  Exclude X-ray radiographs
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Hide technical X-ray images from search results
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close the overlay when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Filters;