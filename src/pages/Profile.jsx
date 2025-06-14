// src/pages/Profile.jsx
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { userData, currentUser } = useAuth();
  
  if (!userData || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {userData.profession || 'Profession not specified'}
              </p>
            </div>
            <Link 
              to="/edit-profile" 
              className="mt-4 sm:mt-0 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Edit Profile
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-center">
                  {userData.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt="Profile" 
                      className="h-48 w-48 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-full w-48 h-48 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                        {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{currentUser.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{userData.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <p className={`mt-1 inline-flex px-2 text-xs font-semibold rounded-full ${userData.isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {userData.isApproved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">School Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Index Number</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{userData.indexNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year of Exit</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{userData.yearOfExit || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">House</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{userData.house || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              {userData.bio && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About Me</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {userData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}