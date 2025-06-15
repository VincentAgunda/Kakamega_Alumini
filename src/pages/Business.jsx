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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc947]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#4a5568] text-white rounded-2xl shadow-md overflow-hidden p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Alumni Business Directory
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
            Support businesses owned and operated by fellow alumni.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search businesses, owners, or descriptions..."
            className="w-full sm:flex-grow px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent transition"
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

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-[#e8ecef] flex items-center justify-center">
                      <BriefcaseIcon className="h-8 w-8 text-[#4a5568]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {business.name}
                      </h3>
                      <p className="text-sm text-white bg-[#4a5568] px-2 py-0.5 rounded-full inline-block capitalize">
                        {business.category}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 text-sm line-clamp-3 flex-grow">
                    {business.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="flex-shrink-0 mr-2 h-5 w-5" />
                      {business.location || 'Nairobi, Kenya'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-semibold mr-1.5">Owner:</span>
                      {business.ownerName} (Class of {business.ownerYear})
                    </div>
                  </div>
                </div>
                {business.website && (
                  <div className="bg-gray-50 p-4 rounded-b-2xl">
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full text-sm font-bold text-gray-800 bg-[#ffc947] hover:bg-[#ffc130] px-4 py-2 rounded-lg transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-md">
              <p className="text-gray-500">
                No businesses found matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Add Your Business CTA */}
        <div className="mt-12 bg-[#e8ecef] rounded-2xl shadow-md overflow-hidden p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Feature Your Business</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Are you an alumni with a business? List it in our directory to connect with potential customers from our community.
          </p>
          <Link 
            to="/add-business"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-sm text-gray-800 bg-[#ffc947] hover:bg-[#ffc130] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc947] transition-colors"
          >
            Submit Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}