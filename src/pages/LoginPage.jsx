import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading state
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        // Store authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        onLogin();
        navigate('/');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-[#FFF4D6] to-[#FFE9A6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-primary">
          {/* Header with Logo */}
          <div className="bg-secondary py-8 px-6 text-center">
            <img
              src={logo}
              alt="Your Bite Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-primary mb-2">
              Your Bite
            </h1>
            <p className="text-gray-300 text-sm">
              Where Every Bite Feels Right 🍔💛
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-secondary mb-2 text-center">
              Welcome Back!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Sign in to manage your food stall
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-secondary mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 outline-none transition-all"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-secondary mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-secondary transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary hover:bg-accent active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Helper Text */}
            {/* <div className="mt-6 p-4 bg-background border-2 border-primary rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                <span className="font-semibold">Demo Credentials:</span>
                <br />
                Username: <span className="font-mono font-bold">admin</span> | 
                Password: <span className="font-mono font-bold">admin</span>
              </p>
            </div> */}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Your Bite | Serving Bites That Feel Right
              <br />
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
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            🔒 Secure Login System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
