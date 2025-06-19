import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Import the icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setError('');
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const user = await login(email, password, isAdminLogin);

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';

      if (err.message.includes('No account found')) {
        errorMessage = 'No account found with this email.';
      } else if (err.message.includes('Incorrect password')) {
        errorMessage = 'Incorrect password.';
      } else if (err.message.includes('locked')) {
        errorMessage = 'Account temporarily locked. Please try again later.';
      } else if (err.message.includes('privileges')) {
        errorMessage = 'Admin privileges required for this login mode.';
      } else if (err.message.includes('invalid-credential')) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (err.message.includes('user-disabled')) {
        errorMessage = 'Your account has been disabled. Please contact support.';
      } else if (err.message.includes('network-request-failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }


      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Changed overall background to match theme
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Removed dark mode classes, added green border
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border border-green-200"
      >
        <div className="text-center">
          {/* Heading color changed */}
          <h2 className="mt-6 text-3xl font-extrabold text-[#0d3b22]">
            {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
          </h2>
          {/* Text color changed */}
          <p className="mt-2 text-sm text-gray-700">
            {isAdminLogin ? 'Access the administration dashboard' : 'Sign in to your alumni account'}
          </p>
        </div>

        {error && (
          // Error message styles adjusted to fit theme, removed dark mode
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              {/* Label color changed */}
              <label htmlFor="email" className="block text-sm font-medium text-[#0d3b22] mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-4 py-3 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition duration-150"
                disabled={loading}
              />
            </div>
            <div>
              {/* Label color changed */}
              <label htmlFor="password" className="block text-sm font-medium text-[#0d3b22] mb-1">
                Password
              </label>
              {/* Password Input with Toggle Icon */}
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} // Dynamically set type
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Input styles changed, removed dark mode
                  className="block w-full px-4 py-3 pr-10 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition duration-150"
                  disabled={loading}
                />
                <button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none" // Kept text-gray-500
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {!isAdminLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  // Checkbox styles changed, removed dark mode
                  className="h-4 w-4 text-[#2a6e47] focus:ring-[#2a6e47] border-gray-300 rounded"
                  disabled={loading}
                />
                {/* Label color changed */}
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  // Link styles changed, removed dark mode
                  className="font-medium text-[#2a6e47] hover:text-[#0d3b22]"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              // Button styles changed, removed dark mode, added gradient
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition duration-150 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isAdminLogin ? 'Authenticating...' : 'Signing in...'}
                </>
              ) : isAdminLogin ? 'Admin Login' : 'Sign In'}
            </button>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={toggleLoginMode}
              // Link styles changed, removed dark mode
              className="font-medium text-[#2a6e47] hover:text-[#0d3b22]"
            >
              {isAdminLogin ? '← Return to user login' : 'Admin access? Click here →'}
            </button>
          </div>
        </form>

        {!isAdminLogin && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                {/* Border color changed, removed dark mode */}
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* Text color changed, removed dark mode */}
                <span className="px-2 bg-white text-gray-700">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                // Button styles changed, removed dark mode
                className="w-full flex justify-center py-2 px-4 border border-[#2a6e47] rounded-md shadow-sm text-sm font-medium text-[#0d3b22] bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition duration-150"
              >
                Create new account
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}