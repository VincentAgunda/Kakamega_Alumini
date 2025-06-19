import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddBusiness() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'technology',
    location: '',
    website: '',
    ownerName: userData ? `${userData.firstName} ${userData.lastName}` : '',
    ownerYear: userData?.yearOfExit || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'businesses'), {
        ...formData,
        ownerId: currentUser.uid,
        createdAt: new Date(),
      });
      navigate('/business');
    } catch (error) {
      console.error('Error adding business:', error);
      setError('Failed to add business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section background changed to a green gradient */}
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Add Your Business</h1>
          <p className="mt-2 text-md text-yellow-400">
            List your business in our alumni directory
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 border border-green-200">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                  Business Name *
                </label>
                {/* Changed background and focus ring */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                  Business Description *
                </label>
                {/* Changed background and focus ring */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                    Category *
                  </label>
                  {/* Changed background and focus ring */}
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  >
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

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                    Location *
                  </label>
                  {/* Changed background and focus ring */}
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                  Website (optional)
                </label>
                {/* Changed background and focus ring */}
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                    Owner Name *
                  </label>
                  {/* Changed background and focus ring */}
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-sm font-medium text-[#0d3b22] mb-1">
                    Graduation Year *
                  </label>
                  {/* Changed background and focus ring */}
                  <input
                    type="number"
                    name="ownerYear"
                    value={formData.ownerYear}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-[#f0f2f5] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/business')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>

                {/* Changed button colors */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2a6e47] text-white rounded-lg hover:bg-[#1a5d38] transition flex items-center justify-center font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      {/* Changed spinner text color */}
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Submit Business'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
