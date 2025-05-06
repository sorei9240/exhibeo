import { useContext } from 'react';
import { ExhibitionContext } from '../context/ExhibitionContext';

/**
 * hook that provides access to the exhibition state & actions from ExhibitionContext
 */
export function useExhibition() {
  const context = useContext(ExhibitionContext);
  
  if (context === undefined) {
    throw new Error('useExhibitions must be used within an ExhibitionProvider');
  }
  
  const {
    exhibitions,
    isLoading,
    error,
    createExhibition,
    addToExhibition,
    removeFromExhibition,
    deleteExhibition,
    renameExhibition,
    setLoading,
    setError
  } = context;

  /**
   * find an exhibition by its ID
   * @param {string} id 
   * @returns {Object|undefined}
   */
  const getExhibitionById = (id) => {
    return exhibitions.find(exhibition => exhibition.id === id);
  };

  /**
   * get total count of artworks across all exhibitions
   * @returns {number}
   */
  const getTotalArtworksCount = () => {
    return exhibitions.reduce((total, exhibition) => total + exhibition.artworks.length, 0);
  };

  /**
   * check if an artwork exists in any exhibition
   * @param {Object} artwork 
   * @returns {boolean} 
   */
  const isArtworkInAnyExhibition = (artwork) => {
    if (!artwork) return false;
    
    return exhibitions.some(exhibition => 
      exhibition.artworks.some(
        item => item.id === artwork.id && item.source === artwork.source
      )
    );
  };

  /**
   * get exhibitions containing a specific artwork
   * @param {Object} artwork 
   * @returns {Array} 
   */
  const getExhibitionsContainingArtwork = (artwork) => {
    if (!artwork) return [];
    
    return exhibitions.filter(exhibition => 
      exhibition.artworks.some(
        item => item.id === artwork.id && item.source === artwork.source
      )
    );
  };

  return {
    exhibitions,
    isLoading,
    error,
    createExhibition,
    addToExhibition,
    removeFromExhibition,
    deleteExhibition,
    renameExhibition,
    setLoading,
    setError,
    getExhibitionById,
    getTotalArtworksCount,
    isArtworkInAnyExhibition,
    getExhibitionsContainingArtwork
  };
}

export default useExhibition;