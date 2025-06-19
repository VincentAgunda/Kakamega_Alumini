import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';

export default function Announcements() {
  const [activeTab, setActiveTab] = useState('all');
  const [expanded, setExpanded] = useState({});
  const { data: announcements, loading, error } = useFirestore('announcements', 
    activeTab !== 'all' ? [['type', '==', activeTab]] : []
  );

  const toggleExpand = (id) => {
    setExpanded(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }));
  };

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

  const sortedAnnouncements = [...announcements].sort((a, b) => 
    b.createdAt.toDate() - a.createdAt.toDate()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center">
        {/* Changed border color from gold to yellow */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-2xl shadow-md border border-green-200">
          <div className="text-red-500 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium">Error loading announcements</h3>
            <p className="mt-2 text-gray-600">
              {error.message || 'Please try again later'}
            </p>
            {/* Changed button color from gold to yellow */}
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-400 text-[#0d3b22] rounded-xl hover:bg-yellow-500 transition font-bold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          {/* Changed text color from gold to yellow */}
          <p className="mt-2 text-md text-yellow-400">
            Latest updates from the alumni community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 border border-green-200">
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Changed active tab color from gold to yellow */}
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'all' 
                  ? 'bg-yellow-400 text-[#0d3b22]' 
                  : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'jobs' 
                  ? 'bg-yellow-400 text-[#0d3b22]' 
                  : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
              }`}
            >
              Job Opportunities
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'events' 
                  ? 'bg-yellow-400 text-[#0d3b22]' 
                  : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'general' 
                  ? 'bg-yellow-400 text-[#0d3b22]' 
                  : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
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
                    className="border border-green-200 rounded-xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#0d3b22]">
                            {announcement.authorName?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between">
                          <h3 className="text-lg font-medium text-[#0d3b22]">
                            {announcement.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            announcement.type === 'jobs' ? 'bg-green-100 text-green-800' :
                            announcement.type === 'events' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {announcement.type === 'jobs' ? 'Job' : 
                            announcement.type === 'events' ? 'Event' : 'General'}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Posted by {announcement.authorName || 'Admin'} • {formatDate(announcement.createdAt)}
                        </p>
                        <div className="mt-3">
                          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-24'}`}>
                            <p className="text-gray-700 whitespace-pre-line">
                              {shouldTruncate && !isExpanded 
                                ? `${announcement.content.substring(0, 200)}...` 
                                : announcement.content}
                            </p>
                          </div>
                          
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleExpand(announcement.id)}
                              className="mt-2 text-sm text-[#2a6e47] hover:text-[#1a5d38] transition"
                            >
                              {isExpanded ? 'Read less' : 'Read more'}
                            </button>
                          )}
                          
                          {announcement.link && (
                            <a 
                              href={announcement.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center text-sm text-[#2a6e47] hover:text-[#1a5d38] transition"
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
              <div className="bg-green-50 rounded-xl p-8 max-w-md mx-auto border border-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-[#0d3b22]">No announcements found</h3>
                <p className="mt-2 text-green-700">
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
  );
}