// Metropolitan Museum of Art API
export const MET_API = {
  baseUrl: 'https://collectionapi.metmuseum.org/public/collection/v1',
  searchEndpoint: '/search',
  objectEndpoint: '/objects'
};

// Harvard Art Museums API
const harvardApiKey = import.meta.env.VITE_HARVARD_API_KEY;

export const HARVARD_API = {
  baseUrl: 'https://api.harvardartmuseums.org',
  objectEndpoint: '/object',
  apiKey: harvardApiKey || 'missing_api_key' 
};

// encode URI components
export const encodeSearchParams = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join('&');
};