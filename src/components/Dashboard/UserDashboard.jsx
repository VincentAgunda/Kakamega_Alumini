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
  getDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  TrophyIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BuildingStorefrontIcon,
  LightBulbIcon,
  ArrowRightIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { sendRsvpEmail } from '../../services/emailService';

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
  const [rsvpSuccess, setRsvpSuccess] = useState(null);
  const [rsvpProcessing, setRsvpProcessing] = useState({});
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
    fetchHallOfFameHonoree();
  }, []);

  useEffect(() => {
    if (userData) {
      setIsApproved(userData.isApproved);
    }
  }, [userData]);

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
      const honoreesRef = collection(db, 'hallOfFame');
      const honoreesSnapshot = await getDocs(honoreesRef);
      
      if (!honoreesSnapshot.empty) {
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

  const handleRSVP = async (eventId) => {
    if (!isApproved) {
      setRsvpSuccess({
        type: 'error',
        message: 'Only approved members can RSVP to events'
      });
      return;
    }

    setRsvpProcessing(prev => ({ ...prev, [eventId]: true }));

    try {
      // Create RSVP record
      await addDoc(collection(db, 'rsvps'), {
        eventId,
        userId: currentUser.uid,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      // Send email notification
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        await sendRsvpEmail(userData.email, eventData);
      }

      setRsvpSuccess({
        type: 'success',
        message: 'RSVP successful! You will receive a confirmation email shortly.'
      });

      // Reset success message after 5 seconds
      setTimeout(() => setRsvpSuccess(null), 5000);
    } catch (error) {
      console.error('Error creating RSVP:', error);
      setRsvpSuccess({
        type: 'error',
        message: 'Failed to RSVP. Please try again.'
      });
    } finally {
      setRsvpProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  };

  if (loading || !isClient || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* RSVP Success/Error Message */}
        {rsvpSuccess && (
          <div className={`mb-6 p-4 rounded-lg ${
            rsvpSuccess.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
              : 'bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            <div className="flex items-start">
              {rsvpSuccess.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{rsvpSuccess.type === 'success' ? 'Success!' : 'Error'}</p>
                <p>{rsvpSuccess.message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* User Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative mr-4">
                {userData?.photoURL ? (
                  <img 
                    src={userData.photoURL} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                    <UserCircleIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-4 w-4 border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userData?.firstName || 'Member'}!
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {userData?.profession ? `${userData.profession} • ` : ''}
                  Class of {userData?.yearOfExit || 'unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex space-x-4">
                <Link 
                  to="/profile" 
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    View Profile
                  </span>
                </Link>
                <Link 
                  to="/edit-profile" 
                  className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition shadow-sm"
                >
                  <span className="text-sm font-medium">
                    Edit Profile
                  </span>
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Member since {userData?.createdAt ? formatDate(userData.createdAt, { month: 'short', year: 'numeric' }) : 'unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 mr-4">
                <UserGroupIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Alumni Network</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{memberCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 mr-4">
                <CalendarIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Events</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 mr-4">
                <LightBulbIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Your Connections</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{connections}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Links */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/directory"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 mr-3">
                    <UserGroupIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Member Directory</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Connect with fellow alumni
                    </p>
                  </div>
                </Link>

                <Link
                  to="/events"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 mr-3">
                    <CalendarIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Upcoming Events</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      View and RSVP to alumni events
                    </p>
                  </div>
                </Link>

                <Link
                  to="/business"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 mr-3">
                    <BuildingStorefrontIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Business Directory</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Support alumni-owned businesses
                    </p>
                  </div>
                </Link>

                <Link
                  to="/support"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Support Our School</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Contribute to our endowment fund
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Hall of Fame Spotlight */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrophyIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Hall of Fame Spotlight</h2>
                </div>
                <Link to="/hall-of-fame" className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                  View All
                </Link>
              </div>
              
              {honoreeLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-14 h-14"></div>
                    <div className="ml-4 flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ) : hallOfFameHonoree ? (
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {hallOfFameHonoree.photoURL ? (
                        <img 
                          src={hallOfFameHonoree.photoURL} 
                          alt={hallOfFameHonoree.name} 
                          className="h-14 w-14 rounded-full object-cover border-2 border-amber-400"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full w-14 h-14 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {hallOfFameHonoree.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {hallOfFameHonoree.name}
                      </h3>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Class of {hallOfFameHonoree.year} • {hallOfFameHonoree.category}
                      </p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {hallOfFameHonoree.achievement}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <Link 
                      to={`/hall-of-fame/${hallOfFameHonoree.id}`} 
                      className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Read full story
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No Hall of Fame honorees available
                  </p>
                  <Link 
                    to="/hall-of-fame" 
                    className="mt-2 inline-flex items-center text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    View Hall of Fame
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Announcements, Events & Blog Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Announcements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Announcements</h2>
                <Link to="/announcements" className="text-sm text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
                <Link to="/events" className="text-sm text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mr-4 mb-4 sm:mb-0">
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-16 h-16 flex items-center justify-center">
                            <CalendarIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                            {event.location}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Link 
                            to="/events"
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleRSVP(event.id)}
                            disabled={rsvpProcessing[event.id] || !isApproved}
                            className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg ${
                              isApproved 
                                ? 'bg-primary hover:bg-primary-dark text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            } ${rsvpProcessing[event.id] ? 'opacity-75' : ''}`}
                          >
                            {rsvpProcessing[event.id] 
                              ? 'Processing...' 
                              : isApproved 
                                ? 'RSVP Now' 
                                : 'Approval Required'}
                          </button>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Blog Post</h2>
                <Link to="/blog" className="text-sm text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post) => (
                    <div key={post.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg w-16 h-16 flex items-center justify-center">
                            <span className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                              {post.category?.charAt(0) || 'B'}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {post.excerpt || post.content.substring(0, 120) + '...'}
                          </p>
                          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="mx-2">•</span>
                            <span>{post.authorName || 'Admin'}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link 
                            to="/blog" 
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                          >
                            Read
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
          </div>
        </div>
      </div>
    </div>
  );
}