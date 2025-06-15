// src/pages/admin/ContentManager.jsx
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// Collection mapping for cleaner code
const COLLECTION_MAP = {
  'Announcements': 'announcements',
  'Blog Posts': 'blogPosts',
  'Events': 'events',
  'Hall of Fame': 'hallOfFame'
};

// Initial form state based on content type
const getInitialFormState = (selectedType) => ({
  title: '',
  content: '',
  link: '',
  date: '',
  time: '',
  location: '',
  locationLink: '',
  excerpt: '',
  category: '',
  ...(selectedType === 'Hall of Fame' && {
    honoreeName: '',
    honoreeYear: '',
    honoreeCategory: 'distinguished',
    honoreePhotoURL: ''
  })
});

export default function ContentManager() {
  const { userData } = useAuth();
  const [contentTypes] = useState(['Announcements', 'Blog Posts', 'Events', 'Hall of Fame']);
  const [selectedType, setSelectedType] = useState('Announcements');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState(getInitialFormState('Announcements'));

  // Reset form when content type changes
  useEffect(() => {
    setNewContent(getInitialFormState(selectedType));
  }, [selectedType]);

  // Fetch content when type changes
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const collectionName = COLLECTION_MAP[selectedType] || 'announcements';
        const querySnapshot = await getDocs(collection(db, collectionName));
        setContent(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedType]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const collectionName = COLLECTION_MAP[selectedType] || 'announcements';
      await deleteDoc(doc(db, collectionName, id));
      setContent(content.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
      alert(`Error deleting: ${error.message}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      const collectionName = COLLECTION_MAP[selectedType] || 'announcements';
      const authorName = userData ? `${userData.firstName} ${userData.lastName}` : 'Admin';
      let contentToAdd = {};

      switch(selectedType) {
        case 'Announcements':
          contentToAdd = {
            title: newContent.title,
            content: newContent.content,
            link: newContent.link || null,
            type: newContent.category,
            authorName,
            createdAt: serverTimestamp()
          };
          break;
        case 'Blog Posts':
          contentToAdd = {
            title: newContent.title,
            content: newContent.content,
            excerpt: newContent.excerpt,
            category: newContent.category,
            authorName,
            createdAt: serverTimestamp()
          };
          break;
        case 'Events':
          // Handle empty date case
          const eventDate = newContent.date ? new Date(newContent.date) : null;
          if (newContent.date && isNaN(eventDate.getTime())) {
            throw new Error("Invalid date format");
          }
          
          contentToAdd = {
            title: newContent.title,
            description: newContent.content,
            date: eventDate,
            time: newContent.time,
            location: newContent.location,
            locationLink: newContent.locationLink || null,
            authorName,
            createdAt: serverTimestamp()
          };
          break;
        case 'Hall of Fame':
          contentToAdd = {
            name: newContent.honoreeName,
            year: newContent.honoreeYear,
            category: newContent.honoreeCategory,
            achievement: newContent.content,
            photoURL: newContent.honoreePhotoURL || null,
            addedBy: authorName,
            addedAt: serverTimestamp()
          };
          break;
        default:
          contentToAdd = {
            title: newContent.title,
            content: newContent.content,
            authorName,
            createdAt: serverTimestamp()
          };
      }

      await addDoc(collection(db, collectionName), contentToAdd);
      
      // Refresh content list
      const querySnapshot = await getDocs(collection(db, collectionName));
      setContent(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      setIsAdding(false);
      setNewContent(getInitialFormState(selectedType));
      alert(`${selectedType === 'Hall of Fame' ? 'Honoree' : 'Item'} added successfully!`);
    } catch (error) {
      console.error('Error creating content:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleCreate} className="bg-[#e8ecef] p-5 rounded-2xl mb-6">
      <h3 className="text-lg font-bold text-[#333] mb-4">
        Add New {selectedType === 'Hall of Fame' ? 'Honoree' : selectedType.slice(0, -1)}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedType === 'Hall of Fame' ? (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Honoree Name
              </label>
              <input
                type="text"
                value={newContent.honoreeName}
                onChange={(e) => setNewContent({...newContent, honoreeName: e.target.value})}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
                placeholder="Full name of honoree"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Graduation Year
              </label>
              <input
                type="number"
                min="1900"
                max="2099"
                value={newContent.honoreeYear}
                onChange={(e) => setNewContent({...newContent, honoreeYear: e.target.value})}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
                placeholder="Year of graduation"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Category
              </label>
              <select
                value={newContent.honoreeCategory}
                onChange={(e) => setNewContent({...newContent, honoreeCategory: e.target.value})}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
              >
                <option value="distinguished">Distinguished Alumni</option>
                <option value="academic">Academic Achiever</option>
                <option value="donor">Golden Giver</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Achievement/Contribution
              </label>
              <textarea
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
                placeholder="Describe the honoree's achievement or contribution"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Photo URL (optional)
              </label>
              <input
                type="url"
                value={newContent.honoreePhotoURL}
                onChange={(e) => setNewContent({...newContent, honoreePhotoURL: e.target.value})}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                {selectedType === 'Events' ? 'Description' : 'Content'}
              </label>
              <textarea
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                required
              />
            </div>
            
            {selectedType === 'Announcements' && (
              <>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    value={newContent.category}
                    onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="jobs">Job Opportunities</option>
                    <option value="events">Events</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    value={newContent.link}
                    onChange={(e) => setNewContent({...newContent, link: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}
            
            {selectedType === 'Blog Posts' && (
              <>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Excerpt
                  </label>
                  <textarea
                    value={newContent.excerpt}
                    onChange={(e) => setNewContent({...newContent, excerpt: e.target.value})}
                    rows={2}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newContent.category}
                    onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                  />
                </div>
              </>
            )}
            
            {selectedType === 'Events' && (
              <>
                <div className="col-span-2 flex items-center text-sm text-gray-600">
                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  <span>Event Date & Time</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newContent.date}
                    onChange={(e) => setNewContent({...newContent, date: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newContent.time}
                    onChange={(e) => setNewContent({...newContent, time: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                  />
                </div>
                
                <div className="col-span-2 flex items-center text-sm text-gray-600">
                  <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  <span>Location Details</span>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newContent.location}
                    onChange={(e) => setNewContent({...newContent, location: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    required
                    placeholder="Virtual or physical address"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Location Link (optional)
                  </label>
                  <input
                    type="url"
                    value={newContent.locationLink}
                    onChange={(e) => setNewContent({...newContent, locationLink: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#ffc947] focus:ring-[#ffc947] p-2"
                    placeholder="https://maps.example.com"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="px-4 py-2 bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333] rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#ffc947] hover:bg-[#ffc130] text-[#333] font-bold rounded-xl transition"
        >
          Create
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc947] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex flex-wrap gap-3 mb-6">
        {contentTypes.map(type => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              setIsAdding(false);
            }}
            className={`px-4 py-2 rounded-xl transition ${
              selectedType === type 
                ? 'bg-[#ffc947] text-[#333] font-bold shadow-sm' 
                : 'bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {isAdding ? (
        renderForm()
      ) : (
        <div className="mb-6">
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#ffc947] hover:bg-[#ffc130] text-[#333] font-bold rounded-xl flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            <span>Add New {selectedType === 'Hall of Fame' ? 'Honoree' : selectedType.slice(0, -1)}</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-[#e8ecef]">
          <thead className="bg-[#e8ecef]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {selectedType === 'Hall of Fame' ? 'Name' : 'Title'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {selectedType === 'Hall of Fame' ? 'Year' : 'Date'}
              </th>
              {selectedType === 'Announcements' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
              )}
              {selectedType === 'Hall of Fame' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Author/Added By
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e8ecef]">
            {content.length > 0 ? (
              content.map((item) => {
                // Format date based on content type
                let displayDate = 'N/A';
                if (selectedType === 'Hall of Fame') {
                  displayDate = item.year;
                } else if (item.createdAt?.toDate) {
                  displayDate = item.createdAt.toDate().toLocaleDateString();
                } else if (item.date?.toDate) {
                  displayDate = item.date.toDate().toLocaleDateString();
                } else if (item.date instanceof Date) {
                  displayDate = item.date.toLocaleDateString();
                }
                
                return (
                  <tr key={item.id} className="hover:bg-[#f8f9fa] transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#333]">
                        {selectedType === 'Hall of Fame' ? item.name : item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {displayDate}
                    </td>
                    {selectedType === 'Announcements' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {item.type || 'General'}
                      </td>
                    )}
                    {selectedType === 'Hall of Fame' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {item.category}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.authorName || item.addedBy || 'Admin'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td 
                  colSpan={
                    selectedType === 'Announcements' ? 5 : 
                    selectedType === 'Hall of Fame' ? 5 : 4
                  } 
                  className="px-6 py-8 text-center text-gray-600"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-lg mb-2">No {selectedType.toLowerCase()} found</div>
                    <div className="text-sm">
                      Click "Add New" to create your first item
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}