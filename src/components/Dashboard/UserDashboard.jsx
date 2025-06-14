import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { TrophyIcon } from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { userData, loading, currentUser } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [connections, setConnections] = useState(0);
  const [error, setError] = useState(null);
  const [hallOfFameHonoree, setHallOfFameHonoree] = useState(null);
  const [honoreeLoading, setHonoreeLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
    fetchHallOfFameHonoree();
  }, []);

  const formatDate = (date, options) => {
    if (!date) return 'Date unknown';
    if (date.toDate) date = date.toDate();
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      setError(null);
      
      // Fetch latest announcements
      const announcementsQuery = query(
        collection(db, 'announcements'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const announcementsSnapshot = await getDocs(announcementsQuery);
      const announcementsData = announcementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt
      }));
      setAnnouncements(announcementsData);

      // Fetch upcoming events
      const now = new Date();
      const eventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', now),
        orderBy('date', 'asc'),
        limit(3)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date
      }));
      setEvents(eventsData);
      
      // Fetch latest blog posts
      const blogQuery = query(
        collection(db, 'blogPosts'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const blogSnapshot = await getDocs(blogQuery);
      const blogData = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt
      }));
      setBlogPosts(blogData);
      
      // Fetch approved member count
      const usersQuery = query(
        collection(db, 'users'),
        where('isApproved', '==', true)
      );
      const usersSnapshot = await getDocs(usersQuery);
      setMemberCount(usersSnapshot.size);
      
      // Fetch actual connections count from user document
      if (currentUser?.uid) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setConnections(userData.connections?.length || 0);
        }
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchHallOfFameHonoree = async () => {
    try {
      setHonoreeLoading(true);
      const honoreesRef = collection(db, 'honorees');
      const honoreesSnapshot = await getDocs(honoreesRef);
      
      if (!honoreesSnapshot.empty) {
        // Get all honorees and pick a random one
        const honoreesData = honoreesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const randomIndex = Math.floor(Math.random() * honoreesData.length);
        setHallOfFameHonoree(honoreesData[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching Hall of Fame honoree:', error);
    } finally {
      setHonoreeLoading(false);
    }
  };

  if (loading || !isClient || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 text-center">
              {error}
            </div>
          )}
          
          {/* User Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {userData?.firstName || 'Member'}!
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {userData?.profession ? `${userData.profession} • ` : ''}
                Class of {userData?.yearOfExit || 'unknown'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex-shrink-0 mr-4">
                {userData?.photoURL ? (
                  <img 
                    src={userData.photoURL} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                      {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex space-x-3">
                  <Link 
                    to="/profile" 
                    className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to="/edit-profile" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Edit Profile
                  </Link>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Member since {userData?.createdAt ? formatDate(userData.createdAt, { month: 'short', year: 'numeric' }) : 'unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Alumni Network</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300 mt-2">{memberCount}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Active members</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Upcoming Events</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300 mt-2">{events.length}</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">This month</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200">Your Connections</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mt-2">{connections}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Fellow alumni</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Quick Links */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <Link
                  to="/directory"
                  className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-600 flex items-start"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Member Directory</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Connect with fellow alumni
                    </p>
                  </div>
                </Link>

                <Link
                  to="/events"
                  className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-600 flex items-start"
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      View and RSVP to alumni events
                    </p>
                  </div>
                </Link>

                <Link
                  to="/business"
                  className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-600 flex items-start"
                >
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Directory</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Support alumni-owned businesses
                    </p>
                  </div>
                </Link>

                <Link
                  to="/support"
                  className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-600 flex items-start"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Support Our School</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Contribute to our endowment fund
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Column - Announcements, Events & Blog Posts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Announcements */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Latest Announcements</h2>
                  <Link to="/announcements" className="text-sm text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {announcement.content}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(announcement.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="mx-2">•</span>
                          <span>{announcement.authorName || 'Admin'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No announcements available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Events */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events</h2>
                  <Link to="/events" className="text-sm text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <div className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-16 h-16" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white">{event.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {event.location}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link 
                              to={`/events/${event.id}`} 
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-primary bg-primary/10 hover:bg-primary/20 dark:text-primary-300 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Blog Posts */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Latest Blog Post</h2>
                  <Link to="/blog" className="text-sm text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <div className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-md w-16 h-16 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 font-bold">
                                {post.category?.charAt(0) || 'B'}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {post.excerpt || post.content.substring(0, 100) + '...'}
                            </p>
                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span className="mx-2">•</span>
                              <span>{post.authorName || 'Admin'}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link 
                              to={`/blog/${post.id}`} 
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-primary bg-primary/10 hover:bg-primary/20 dark:text-primary-300 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No blog posts available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hall of Fame Spotlight */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-yellow-200 dark:border-amber-800/30 flex items-center justify-between">
                  <div className="flex items-center">
                    <TrophyIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    <h2 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Hall of Fame Spotlight</h2>
                  </div>
                  <Link to="/hall-of-fame" className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                    View All
                  </Link>
                </div>
                
                {honoreeLoading ? (
                  <div className="p-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                ) : hallOfFameHonoree ? (
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        {hallOfFameHonoree.photoURL ? (
                          <img 
                            src={hallOfFameHonoree.photoURL} 
                            alt={hallOfFameHonoree.name} 
                            className="h-16 w-16 rounded-full object-cover border-2 border-yellow-400"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">
                              {hallOfFameHonoree.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {hallOfFameHonoree.name}
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Class of {hallOfFameHonoree.year} • {hallOfFameHonoree.category}
                        </p>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {hallOfFameHonoree.achievement}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <Link 
                        to={`/hall-of-fame/${hallOfFameHonoree.id}`} 
                        className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                      >
                        Read full story →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No Hall of Fame honorees available
                    </p>
                    <Link 
                      to="/hall-of-fame" 
                      className="mt-2 inline-block text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      View Hall of Fame
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}