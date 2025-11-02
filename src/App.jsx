import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load pages for faster initial load
const MenuPage = lazy(() => import('./pages/MenuPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const KitchenPage = lazy(() => import('./pages/KitchenPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Loading component
const PageLoader = () => (
  <div className="h-1 w-full bg-primary/70 animate-pulse"></div>
);

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    setIsCheckingAuth(false);
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };
  useEffect(() => {
    // Warm-up secondary routes so tab switches are instant (only if authenticated)
    if (isAuthenticated) {
      const preloadRoutes = async () => {
        await Promise.all([
          import('./pages/OrdersPage'),
          import('./pages/KitchenPage'),
          import('./pages/DashboardPage'),
        ]);
      };

      preloadRoutes();
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary font-semibold">Loading Your Bite...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Route */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginPage onLogin={handleLogin} />
                  )
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MenuPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/kitchen" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <KitchenPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer - Only show when authenticated */}
        {isAuthenticated && (
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
        )}
      </div>
    </Router>
  );
}

export default App;
