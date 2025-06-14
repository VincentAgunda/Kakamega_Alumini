import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';

export default function Announcements() {
  const [activeTab, setActiveTab] = useState('all');
  const [expanded, setExpanded] = useState({});
  const { data: announcements, loading, error } = useFirestore('announcements', 
    activeTab !== 'all' ? [['type', '==', activeTab]] : []
  );

  // Toggle expanded state for announcements
  const toggleExpand = (id) => {
    setExpanded(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }));
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Date unknown';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    b.createdAt.toDate() - a.createdAt.toDate()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-red-500 dark:text-red-400 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium">Error loading announcements</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {error.message || 'Please try again later'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Latest updates from the alumni community
                </p>
              </div>
              {/* Submit button removed here */}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'jobs' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Job Opportunities
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'events' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'general' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                General
              </button>
            </div>

            {sortedAnnouncements.length > 0 ? (
              <div className="space-y-6">
                {sortedAnnouncements.map((announcement) => {
                  const isExpanded = expanded[announcement.id];
                  const shouldTruncate = announcement.content.length > 200;
                  
                  return (
                    <div 
                      key={announcement.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                              {announcement.authorName?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {announcement.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              announcement.type === 'jobs' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              announcement.type === 'events' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {announcement.type === 'jobs' ? 'Job' : 
                              announcement.type === 'events' ? 'Event' : 'General'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Posted by {announcement.authorName || 'Admin'} • {formatDate(announcement.createdAt)}
                          </p>
                          <div className="mt-3">
                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-24'}`}>
                              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                {shouldTruncate && !isExpanded 
                                  ? `${announcement.content.substring(0, 200)}...` 
                                  : announcement.content}
                              </p>
                            </div>
                            
                            {shouldTruncate && (
                              <button
                                onClick={() => toggleExpand(announcement.id)}
                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                              >
                                {isExpanded ? 'Read less' : 'Read more'}
                              </button>
                            )}
                            
                            {announcement.link && (
                              <a 
                                href={announcement.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                              >
                                Learn more
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No announcements found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {activeTab === 'all' 
                      ? "There are currently no announcements." 
                      : `There are no ${activeTab} announcements at this time.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}