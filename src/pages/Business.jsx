import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  MapPinIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function Business() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { data: businesses, loading } = useFirestore('businesses');

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      category === 'all' || 
      business.category?.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Alumni Business Directory
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Support businesses owned by fellow alumni
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="food">Food & Beverage</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <div key={business.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {business.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {business.category}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {business.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                      {business.location || 'Nairobi, Kenya'}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="mr-1.5">Owner:</span>
                      {business.ownerName} (Class of {business.ownerYear})
                    </div>
                    {business.website && (
                      <div className="mt-4">
                        <a
                          href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary dark:text-primary-dark hover:underline"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No businesses found matching your search
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Your Business</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you an alumni with a business? List it in our directory to connect with potential customers from our community.
            </p>
            <Link 
              to="/add-business"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
            >
              Submit Business Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}