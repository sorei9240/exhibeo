import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ExhibitionProvider } from '../context/ExhibitionContext.jsx';
import Home from '../pages/Home';
import Search from '../pages/Search';
import ArtworkView from '../pages/ArtworkView';
import Exhibitions from '../pages/Exhibitions';
import ExhibitionView from '../pages/ExhibitionView';
import NotFound from '../pages/NotFound';
import Header from './Header';

// query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExhibitionProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/artwork/:source/:id" element={<ArtworkView />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/exhibitions/:id" element={<ExhibitionView />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <footer className="bg-gray-800 text-white py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-center md:text-left mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} Exhibition Curation Platform
                  </p>
                  <div className="flex space-x-4">
                    <a href="#accessibility" className="hover:text-gray-300">Accessibility</a>
                    <a href="#privacy" className="hover:text-gray-300">Privacy Policy</a>
                    <a href="#terms" className="hover:text-gray-300">Terms of Use</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          
          {/* notifications container */}
          <ToastContainer position="bottom-right" />
        </BrowserRouter>
      </ExhibitionProvider>
      
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;