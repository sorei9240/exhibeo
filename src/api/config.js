
// Metropolitan Museum of Art API
export const MET_API = {
  baseUrl: 'https://collectionapi.metmuseum.org/public/collection/v1',
  searchEndpoint: '/search',
  objectEndpoint: '/objects'
};

// Harvard Art Museums API
export const HARVARD_API = {
  baseUrl: 'https://api.harvardartmuseums.org',
  objectEndpoint: '/object',
  apiKey: import.meta.env.VITE_HARVARD_API_KEY || 'YOUR_HARVARD_API_KEY'
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