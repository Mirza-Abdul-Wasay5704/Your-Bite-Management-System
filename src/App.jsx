import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load pages for faster initial load
const MenuPage = lazy(() => import('./pages/MenuPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const KitchenPage = lazy(() => import('./pages/KitchenPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Loading component
const PageLoader = () => (
  <div className="h-1 w-full bg-primary/70 animate-pulse"></div>
);

function App() {
  useEffect(() => {
    // Warm-up secondary routes so tab switches are instant
    const preloadRoutes = async () => {
      await Promise.all([
        import('./pages/OrdersPage'),
        import('./pages/KitchenPage'),
        import('./pages/DashboardPage'),
      ]);
    };

    preloadRoutes();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/kitchen" element={<KitchenPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer */}
        <footer className="bg-secondary text-white py-4 sm:py-6 mt-auto border-t-2 border-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs sm:text-base mb-1 sm:mb-2">
              © 2025 Your Bite | Where Every Bite Feels Right 🍔💛
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Follow us{' '}
              <a 
                href="https://instagram.com/your_bite_official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-accent font-semibold transition-colors"
              >
                @your_bite_official
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
