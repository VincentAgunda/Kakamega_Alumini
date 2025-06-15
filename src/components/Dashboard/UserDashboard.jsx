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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ffc947] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* RSVP Success/Error Message */}
        {rsvpSuccess && (
          <div className={`mb-6 p-4 rounded-xl ${
            rsvpSuccess.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-start">
              {rsvpSuccess.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{rsvpSuccess.type === 'success' ? 'Success!' : 'Error'}</p>
                <p>{rsvpSuccess.message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* User Header - Compact */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative mr-4">
              {userData?.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt="Profile" 
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="bg-[#e8ecef] border-2 border-dashed rounded-full w-14 h-14 flex items-center justify-center">
                  <UserCircleIcon className="h-7 w-7 text-gray-500" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#333]">
                Welcome back, {userData?.firstName || 'Member'}!
              </h1>
              <p className="text-sm text-gray-600">
                {userData?.profession ? `${userData.profession} • ` : ''}
                Class of {userData?.yearOfExit || 'unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to="/profile" 
              className="px-4 py-2 bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333] rounded-lg text-sm font-bold transition"
            >
              Profile
            </Link>
            <Link 
              to="/edit-profile" 
              className="px-4 py-2 bg-[#ffc947] hover:bg-[#ffc130] text-[#333] rounded-lg text-sm font-bold transition shadow-sm"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Stats Section - Compact Grid */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
                <UserGroupIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Network</p>
                <p className="text-xl font-bold text-[#333]">{memberCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Events</p>
                <p className="text-xl font-bold text-[#333]">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
                <LightBulbIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Connections</p>
                <p className="text-xl font-bold text-[#333]">{connections}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Quick Actions & Spotlight */}
          <div className="space-y-5">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="text-md font-bold text-[#333] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/directory"
                  className="p-4 bg-[#e8ecef] hover:bg-[#d6dde3] rounded-xl flex flex-col items-center transition"
                >
                  <UserGroupIcon className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-bold text-[#333]">Directory</span>
                </Link>

                <Link
                  to="/events"
                  className="p-4 bg-[#e8ecef] hover:bg-[#d6dde3] rounded-xl flex flex-col items-center transition"
                >
                  <CalendarIcon className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-bold text-[#333]">Events</span>
                </Link>

                <Link
                  to="/business"
                  className="p-4 bg-[#e8ecef] hover:bg-[#d6dde3] rounded-xl flex flex-col items-center transition"
                >
                  <BuildingStorefrontIcon className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-bold text-[#333]">Businesses</span>
                </Link>

                <Link
                  to="/support"
                  className="p-4 bg-[#e8ecef] hover:bg-[#d6dde3] rounded-xl flex flex-col items-center transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-[#333]">Support</span>
                </Link>
              </div>
            </div>

            {/* Hall of Fame Spotlight - Compact */}
            <div className="bg-[#e8ecef] rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <TrophyIcon className="h-5 w-5 text-gray-600" />
                  <h2 className="ml-2 text-md font-bold text-[#333]">Hall of Fame</h2>
                </div>
                <Link to="/hall-of-fame" className="text-xs text-gray-600 hover:text-[#333] font-bold">
                  View All
                </Link>
              </div>
              
              {honoreeLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full w-10 h-10"></div>
                    <div className="ml-3 flex-1 space-y-1">
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ) : hallOfFameHonoree ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {hallOfFameHonoree.photoURL ? (
                      <img 
                        src={hallOfFameHonoree.photoURL} 
                        alt={hallOfFameHonoree.name} 
                        className="h-10 w-10 rounded-full object-cover border-2 border-[#ffc947]"
                      />
                    ) : (
                      <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {hallOfFameHonoree.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#333] truncate">
                      {hallOfFameHonoree.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {hallOfFameHonoree.category}
                    </p>
                  </div>
                  <Link 
                    to="/hall-of-fame"
                    className="text-xs font-bold text-gray-600 hover:text-[#333]"
                  >
                    View
                  </Link>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-600">No honorees available</p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Announcements & Blog */}
          <div className="lg:col-span-2 space-y-5">
            {/* Announcements Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5 bg-[#e8ecef] flex items-center justify-between">
                <h2 className="text-md font-bold text-[#333]">Latest Announcements</h2>
                <Link to="/announcements" className="text-xs text-gray-600 hover:text-[#333] font-bold flex items-center">
                  View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-[#e8ecef]">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 hover:bg-[#f8f9fa] transition">
                      <h3 className="text-sm font-bold text-[#333]">{announcement.title}</h3>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>{formatDate(announcement.date, { month: 'short', day: 'numeric' })}</span>
                        <span className="mx-2">•</span>
                        <span>{announcement.authorName?.split(' ')[0] || 'Admin'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-gray-600">No announcements</p>
                  </div>
                )}
              </div>
            </div>

            {/* Blog Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5 bg-[#e8ecef] flex items-center justify-between">
                <h2 className="text-md font-bold text-[#333]">Latest Blog Post</h2>
                <Link to="/blog" className="text-xs text-gray-600 hover:text-[#333] font-bold flex items-center">
                  View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-[#e8ecef]">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-[#f8f9fa] transition flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="bg-[#e8ecef] rounded-lg w-10 h-10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#333]">
                            {post.category?.charAt(0) || 'B'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-[#333] truncate">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 100) + '...'}
                        </p>
                      </div>
                      <Link 
                        to="/blog"
                        className="text-xs font-bold text-gray-600 hover:text-[#333] whitespace-nowrap"
                      >
                        Read
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-gray-600">No blog posts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5 bg-[#e8ecef] flex items-center justify-between">
                <h2 className="text-md font-bold text-[#333]">Upcoming Events</h2>
                <Link to="/events" className="text-xs text-gray-600 hover:text-[#333] font-bold flex items-center">
                  View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-[#e8ecef]">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-[#f8f9fa] transition">
                      <h3 className="text-sm font-bold text-[#333]">{event.title}</h3>
                      <p className="mt-1 text-xs text-gray-600">
                        {formatDate(event.date, { month: 'short', day: 'numeric' })} • {event.time}
                      </p>
                      <p className="mt-1 text-xs text-gray-600 truncate">
                        {event.location}
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleRSVP(event.id)}
                          disabled={rsvpProcessing[event.id] || !isApproved}
                          className={`flex-1 text-xs px-2 py-1.5 rounded-lg font-bold ${
                            isApproved 
                              ? 'bg-[#ffc947] hover:bg-[#ffc130] text-[#333]' 
                              : 'bg-[#e8ecef] text-gray-600 cursor-not-allowed'
                          } ${rsvpProcessing[event.id] ? 'opacity-75' : ''}`}
                        >
                          {rsvpProcessing[event.id] 
                            ? 'Processing...' 
                            : isApproved 
                              ? 'RSVP' 
                              : 'Approval Needed'}
                        </button>
                        <Link 
                          to="/events" 
                          className="flex-1 text-xs px-2 py-1.5 bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333] rounded-lg font-bold text-center"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-gray-600">No upcoming events</p>
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