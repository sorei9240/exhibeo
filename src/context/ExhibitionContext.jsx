import { createContext, useContext, useReducer, useEffect } from 'react';

// exhibition context
export const ExhibitionContext = createContext();

// local storage key
const STORAGE_KEY = 'exhibition_curation_data';

const initialState = {
  exhibitions: [],
  isLoading: false,
  error: null
};

// actions
const ActionTypes = {
  CREATE_EXHIBITION: 'CREATE_EXHIBITION',
  ADD_TO_EXHIBITION: 'ADD_TO_EXHIBITION',
  REMOVE_FROM_EXHIBITION: 'REMOVE_FROM_EXHIBITION',
  DELETE_EXHIBITION: 'DELETE_EXHIBITION',
  RENAME_EXHIBITION: 'RENAME_EXHIBITION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

function exhibitionReducer(state, action) {
  switch (action.type) {
    case ActionTypes.CREATE_EXHIBITION: {
      const newExhibition = {
        id: `exhibition_${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description || '',
        createdAt: new Date().toISOString(),
        artworks: []
      };
      
      return {
        ...state,
        exhibitions: [...state.exhibitions, newExhibition],
        error: null
      };
    }
    
    case ActionTypes.ADD_TO_EXHIBITION: {
      const { exhibitionId, artwork } = action.payload;
      
      // find the exhibition to add to
      const updatedExhibitions = state.exhibitions.map(exhibition => {
        if (exhibition.id === exhibitionId) {
          // check if artwork is already in exhibition
          const artworkExists = exhibition.artworks.some(
            item => item.id === artwork.id && item.source === artwork.source
          );
          
          if (artworkExists) {
            return exhibition; // skip if exists
          }
          
          // add to exhibition
          return {
            ...exhibition,
            artworks: [...exhibition.artworks, artwork]
          };
        }
        return exhibition;
      });
      
      return {
        ...state,
        exhibitions: updatedExhibitions,
        error: null
      };
    }
    
    case ActionTypes.REMOVE_FROM_EXHIBITION: {
      const { exhibitionId, artworkId, source } = action.payload;
      
      // find the exhibition & remove the artwork
      const updatedExhibitions = state.exhibitions.map(exhibition => {
        if (exhibition.id === exhibitionId) {
          return {
            ...exhibition,
            artworks: exhibition.artworks.filter(
              artwork => !(artwork.id === artworkId && artwork.source === source)
            )
          };
        }
        return exhibition;
      });
      
      return {
        ...state,
        exhibitions: updatedExhibitions,
        error: null
      };
    }
    
    case ActionTypes.DELETE_EXHIBITION: {
      return {
        ...state,
        exhibitions: state.exhibitions.filter(
          exhibition => exhibition.id !== action.payload.exhibitionId
        ),
        error: null
      };
    }
    
    case ActionTypes.RENAME_EXHIBITION: {
      const { exhibitionId, name, description } = action.payload;
      
      const updatedExhibitions = state.exhibitions.map(exhibition => {
        if (exhibition.id === exhibitionId) {
          return {
            ...exhibition,
            name: name || exhibition.name,
            description: description !== undefined ? description : exhibition.description
          };
        }
        return exhibition;
      });
      
      return {
        ...state,
        exhibitions: updatedExhibitions,
        error: null
      };
    }
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    default:
      return state;
  }
}

export function ExhibitionProvider({ children }) {
  // load from local storage if exists
  const loadInitialState = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading exhibitions from localStorage:', error);
    }
    return initialState;
  };
  
  const [state, dispatch] = useReducer(exhibitionReducer, loadInitialState());
  
  // save to localstorage on stage change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving exhibitions to localStorage:', error);
    }
  }, [state]);
  
  // action creators
  const createExhibition = (name, description) => {
    dispatch({
      type: ActionTypes.CREATE_EXHIBITION,
      payload: { name, description }
    });
  };
  
  const addToExhibition = (exhibitionId, artwork) => {
    dispatch({
      type: ActionTypes.ADD_TO_EXHIBITION,
      payload: { exhibitionId, artwork }
    });
  };
  
  const removeFromExhibition = (exhibitionId, artworkId, source) => {
    dispatch({
      type: ActionTypes.REMOVE_FROM_EXHIBITION,
      payload: { exhibitionId, artworkId, source }
    });
  };
  
  const deleteExhibition = (exhibitionId) => {
    dispatch({
      type: ActionTypes.DELETE_EXHIBITION,
      payload: { exhibitionId }
    });
  };
  
  const renameExhibition = (exhibitionId, name, description) => {
    dispatch({
      type: ActionTypes.RENAME_EXHIBITION,
      payload: { exhibitionId, name, description }
    });
  };
  
  const setLoading = (isLoading) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: isLoading
    });
  };
  
  const setError = (error) => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: error
    });
  };
  
  // val object for context provider
  const value = {
    exhibitions: state.exhibitions,
    isLoading: state.isLoading,
    error: state.error,
    createExhibition,
    addToExhibition,
    removeFromExhibition,
    deleteExhibition,
    renameExhibition,
    setLoading,
    setError
  };
  
  return (
    <ExhibitionContext.Provider value={value}>
      {children}
    </ExhibitionContext.Provider>
  );
}

// hook to use exhibition context
export function useExhibition() {
  const context = useContext(ExhibitionContext);
  
  if (context === undefined) {
    throw new Error('useExhibition must be used within an ExhibitionProvider');
  }
  
  return context;
}