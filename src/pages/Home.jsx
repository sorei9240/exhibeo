import React from 'react';
import { Link } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import SearchBar from '../components/SearchBar';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const { 
    featuredArtworks, 
    isFeaturedLoading, 
    featuredError, 
    searchArtworks
  } = useArtworks();
  
  React.useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Explore Art Collections from Around the World
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create your own virtual exhibitions by curating artworks from the world's finest museums and galleries.
        </p>
        
        {/* Search bar */}
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={searchArtworks} />
        </div>
      </section>

      {/* Features section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Collections</h3>
              <p className="text-gray-600">Search across multiple museum collections to find the perfect artworks for your exhibitions.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curate Exhibitions</h3>
              <p className="text-gray-600">Create personalized exhibitions by saving and organizing your favorite artworks.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">View Exhibitions</h3>
              <p className="text-gray-600">Browse your curated exhibitions and explore high-quality images of historic artworks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured artworks section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Featured Artworks
        </h2>
        
        {isFeaturedLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : featuredError ? (
          <div className="text-center text-red-600 py-12">
            <p>Unable to load featured artworks. Please try again later.</p>
          </div>
        ) : featuredArtworks && featuredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredArtworks.map(artwork => (
              <ArtworkCard 
                key={`${artwork.source}-${artwork.id}`} 
                artwork={artwork} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-12">
            <p>No featured artworks available at the moment.</p>
          </div>
        )}
      </section>

      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Art Exploration</h2>
          <p className="text-xl text-gray-300 mb-8">
            Begin searching for artworks, create your first exhibition, and immerse yourself in the world of art collections.
          </p>
          <Link 
            to="/search" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;