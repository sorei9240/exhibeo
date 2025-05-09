# Exhibeo - Digital Art Gallery Explorer

![Exhibeo](https://exhibeo.netlify.app/images/logo.png)

Exhibeo is a web application for exploring art collections from the Metropolitan Museum of Art and Harvard Art Museums. Users can search, filter, and curate their own virtual exhibitions from thousands of artworks.

**Link to the Live Site:** [https://exhibeo.netlify.app](https://exhibeo.netlify.app)

## Features

- **Multi-Museum Search**: Discover artworks from the Met Museum and Harvard Art Museums collections
- **Filtering**: Filter by medium, artist, date, and more
- **Exhibition Curation**: Create and share your own virtual art exhibitions
- **Responsive Design**: Designed to work on both desktop and mobile
- **Museum Integration**: Links to the original museum pages for each artwork

## Technology Stack

- **Frontend**: React with React Router for navigation
- **Data Management**: TanStack Query (React Query) for server-state management and API caching
- **Styling**: Tailwind CSS
- **API Integration**: API clients for Met Museum and Harvard Art Museums
- **Deployment**: Netlify for hosting and serverless functions

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Harvard Art Museums API key ([Get one here](https://harvardartmuseums.org/collections/api))

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sorei9240/exhibeo.git
   cd exhibeo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your API key
   ```
   VITE_HARVARD_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Hold ctrl and click to follow the localhost link and view the project in your browser.


## API Integrations

Exhibeo uses two museum APIs:

- **Metropolitan Museum of Art**: Public API, no authentication required
- **Harvard Art Museums**: Requires an API key

The application uses a Netlify function to securely proxy requests to the Harvard Art Museums API, keeping your API key secure.

## Acknowledgments

- [Metropolitan Museum of Art](https://metmuseum.org/) for their open access API
- [Harvard Art Museums](https://harvardartmuseums.org/) for their free API with very generous usage rates

---

Made with ❤️ by sorei9240