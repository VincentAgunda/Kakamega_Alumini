import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Changed from "../../contexts/AuthContext"
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PendingApproval() {
  const { state } = useLocation();
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center"
      >
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Account Pending Approval
          </h2>
          <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              {state?.message || 'Your account is awaiting admin approval.'}
            </p>
            {currentUser?.email && (
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                Registered email: {currentUser.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You'll receive an email notification once your account has been approved.
          </p>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={logout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
            >
              Sign Out
            </button>
            
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary dark:text-primary-dark hover:text-secondary dark:hover:text-secondary-dark"
            >
              Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}