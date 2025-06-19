import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Register() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || localStorage.getItem('registerEmail') || '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    indexNumber: '',
    yearOfExit: '',
    house: '',
    profession: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Clear stored email when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('registerEmail');
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = [
      'email', 'password', 'confirmPassword', 
      'firstName', 'lastName', 'indexNumber',
      'yearOfExit', 'house', 'profession', 'phone'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      return setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }

    // Specific validations
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError('Please enter a valid email address');
    }

    if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      return setError('Phone number must be 10-15 digits');
    }

    if (formData.yearOfExit < 1900 || formData.yearOfExit > new Date().getFullYear()) {
      return setError('Please enter a valid year of exit');
    }

    try {
      setError('');
      setLoading(true);
      
      // Store email in case of failure
      localStorage.setItem('registerEmail', formData.email);
      
      // Register user with metadata
      await register(formData.email, formData.password, formData);
      
      // Redirect with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Your account is pending approval.',
          email: formData.email,
          isNewRegistration: true
        },
        replace: true
      });
    } catch (err) {
      console.error('Registration error:', err);
      
      // Enhanced error messages
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (err.message.includes('email-already-in-use')) {
        errorMessage = (
          <span>
            This email is already registered.{' '}
            <Link 
              to="/login" 
              state={{ email: formData.email }}
              className="text-[#2a6e47] underline hover:text-[#0d3b22]" // Green link
            >
              Please login here
            </Link>.
          </span>
        );
      } else if (err.message.includes('weak-password')) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (err.message.includes('invalid-email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('network-error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message.includes('system configuration')) {
        errorMessage = 'Registration is currently unavailable. Please contact support.';
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
        className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg border border-green-200"
      >
        <div className="text-center">
          {/* Heading color changed */}
          <h2 className="text-3xl font-extrabold text-[#0d3b22]">
            Create your alumni account
          </h2>
          {/* Text color changed */}
          <p className="mt-2 text-sm text-gray-700">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ email: formData.email }}
              className="font-medium text-[#2a6e47] hover:text-[#0d3b22]" // Green link
            >
              Sign in
            </Link>
          </p>
        </div>
        
        {error && (
          // Error message styles adjusted to fit theme, removed dark mode
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              {/* Label color changed */}
              <label htmlFor="firstName" className="block text-sm font-medium text-[#0d3b22]">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                minLength="2"
                value={formData.firstName}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="lastName" className="block text-sm font-medium text-[#0d3b22]">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                minLength="2"
                value={formData.lastName}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="Enter your last name"
              />
            </div>
            
            {/* Contact Information */}
            <div>
              {/* Label color changed */}
              <label htmlFor="email" className="block text-sm font-medium text-[#0d3b22]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="phone" className="block text-sm font-medium text-[#0d3b22]">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="[0-9]{10,15}"
                title="10-15 digit phone number"
                value={formData.phone}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="0712345678"
              />
            </div>
            
            {/* School Information */}
            <div>
              {/* Label color changed */}
              <label htmlFor="indexNumber" className="block text-sm font-medium text-[#0d3b22]">
                Index Number <span className="text-red-500">*</span>
              </label>
              <input
                id="indexNumber"
                name="indexNumber"
                type="text"
                required
                pattern="[A-Za-z0-9]+"
                title="Alphanumeric characters only"
                value={formData.indexNumber}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="e.g. 12345"
              />
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="yearOfExit" className="block text-sm font-medium text-[#0d3b22]">
                Year of Exit <span className="text-red-500">*</span>
              </label>
              <input
                id="yearOfExit"
                name="yearOfExit"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                required
                value={formData.yearOfExit}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="e.g. 2010"
              />
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="house" className="block text-sm font-medium text-[#0d3b22]">
                House <span className="text-red-500">*</span>
              </label>
              <select
                id="house"
                name="house"
                required
                value={formData.house}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
              >
                <option value="">Select House</option>
                <option value="Chapman">Chapman</option>
                <option value="Garnet">Garnet</option>
                <option value="Gold">Gold</option>
                <option value="Ruby">Ruby</option>
                <option value="Sapphire">Sapphire</option>
                <option value="Emerald">Emerald</option>
              </select>
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="profession" className="block text-sm font-medium text-[#0d3b22]">
                Profession <span className="text-red-500">*</span>
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                required
                minLength="3"
                value={formData.profession}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="e.g. Software Engineer"
              />
            </div>
            
            {/* Password Fields */}
            <div>
              {/* Label color changed */}
              <label htmlFor="password" className="block text-sm font-medium text-[#0d3b22]">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="At least 6 characters"
              />
              {/* Text color changed */}
              <p className="mt-1 text-xs text-gray-600">
                Minimum 6 characters
              </p>
            </div>
            
            <div>
              {/* Label color changed */}
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0d3b22]">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength="6"
                value={formData.confirmPassword}
                onChange={handleChange}
                // Input styles changed, removed dark mode
                className="mt-1 block w-full px-3 py-2 border border-[#2a6e47] rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 bg-[#f0f2f5] transition"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                // Checkbox styles changed, removed dark mode
                className="h-4 w-4 text-[#2a6e47] focus:ring-[#2a6e47] border-gray-300 rounded transition"
              />
            </div>
            <div className="ml-3 text-sm">
              {/* Label and link colors changed, removed dark mode */}
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2a6e47] hover:underline" // Green link
                >
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link 
                  to="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2a6e47] hover:underline" // Green link
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              // Button styles changed, removed dark mode, added gradient
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : 'Register'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}