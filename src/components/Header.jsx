import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useExhibition } from '../context/ExhibitionContext';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { exhibitions } = useExhibition();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Search form submission handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Close mobile menu after search
      setSearchQuery(''); // Clear search after submission
    }
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
            Exhibition Curation
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks..."
                className="w-64 py-2 px-4 pr-10 rounded-lg bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search artworks"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label="Submit search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            {/* Nav links */}
            <Link 
              to="/" 
              className={`hover:text-blue-200 ${location.pathname === '/' ? 'font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`hover:text-blue-200 ${location.pathname === '/search' ? 'font-semibold' : ''}`}
            >
              Browse
            </Link>
            <Link 
              to="/exhibitions" 
              className={`hover:text-blue-200 ${location.pathname === '/exhibitions' ? 'font-semibold' : ''}`}
            >
              My Exhibitions
              {exhibitions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-700 text-xs rounded-full">
                  {exhibitions.length}
                </span>
              )}
            </Link>
          </nav>
          
          {/* Button for mobile menu */}
          <button 
            className="md:hidden text-white focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Menu for mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks..."
                className="w-full py-2 px-4 pr-10 rounded-lg bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search artworks"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label="Submit search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 hover:text-blue-200 ${location.pathname === '/' ? 'font-semibold' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/search" 
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 hover:text-blue-200 ${location.pathname === '/search' ? 'font-semibold' : ''}`}
              >
                Browse
              </Link>
              <Link 
                to="/exhibitions" 
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 hover:text-blue-200 ${location.pathname === '/exhibitions' ? 'font-semibold' : ''}`}
              >
                My Exhibitions
                {exhibitions.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-700 text-xs rounded-full">
                    {exhibitions.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;