import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { 
  ClockIcon, 
  CalendarIcon,
  ArrowRightIcon,  // Added import
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, 'announcements'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const announcementsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt.toDate()
        }));
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const now = new Date();
        const q = query(
          collection(db, 'events'),
          orderBy('date', 'asc'),
          where('date', '>=', now),
          limit(2)
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchAnnouncements();
    fetchEvents();
  }, []);

  // Format date using native JavaScript
  const formatDate = (date) => {
    if (!date) return 'Date unknown';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time using native JavaScript
  const formatTime = (time) => {
    if (!time) return 'All day';
    
    // Create a date object with an arbitrary date + the time string
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#f0f2f5] font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#22344C] to-[#2c4764] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                >
                  <span className="block">Kakamega High</span>
                  <span className="block text-[#ffc947]">Alumni Network</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  Connecting generations of alumni to foster lifelong relationships and support our alma mater.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                >
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-[#22344C] bg-[#ffc947] hover:bg-[#ffc130] md:py-4 md:text-lg md:px-10 transition"
                    >
                      Join Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/about"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-[#5E7B80] hover:bg-[#4c6366] md:py-4 md:text-lg md:px-10 transition"
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-[#f0f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <div className="bg-[#22344C] rounded-2xl shadow-md p-5 inline-block mb-4">
              <h2 className="text-base text-[#ffc947] font-bold tracking-wide uppercase">
                Features
              </h2>
            </div>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#22344C] sm:text-4xl">
              What We Offer
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
                      <feature.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#22344C]">
                        {feature.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {feature.description}
                      </p>
                      <p className="mt-3 text-sm">
                        <Link
                          to={feature.href}
                          className="font-bold text-[#5E7B80] hover:text-[#4c6366] transition"
                        >
                          Learn more<span aria-hidden="true"> &rarr;</span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* News & Updates */}
      <div className="py-16 bg-[#f0f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-5 bg-[#e8ecef] flex items-center justify-between">
              <h2 className="text-md font-bold text-[#333]">News & Updates</h2>
              <Link to="/announcements" className="text-xs text-gray-600 hover:text-[#333] font-bold flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                  <div className="h-6 bg-[#e8ecef] rounded w-1/4 mb-4"></div>
                  <div className="h-5 bg-[#e8ecef] rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-[#e8ecef] rounded w-full mb-3"></div>
                  <div className="h-4 bg-[#e8ecef] rounded w-5/6 mb-6"></div>
                  <div className="flex items-center mt-4">
                    <div className="h-10 w-10 bg-[#e8ecef] rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-[#e8ecef] rounded w-24 mb-2"></div>
                      <div className="h-3 bg-[#e8ecef] rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        announcement.type === 'jobs' ? 'bg-green-100 text-green-800' :
                        announcement.type === 'events' ? 'bg-blue-100 text-blue-800' :
                        'bg-[#e8ecef] text-[#22344C]'
                      }`}>
                        {announcement.type === 'jobs' ? 'Job Opportunity' : 
                         announcement.type === 'events' ? 'Event' : 'General'}
                      </span>
                      <time className="text-sm text-gray-600">
                        {formatDate(announcement.date)}
                      </time>
                    </div>
                    <h3 className="text-lg font-bold text-[#333] mb-3">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-[#e8ecef] rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="text-[#22344C] font-bold">
                              {announcement.authorName?.charAt(0) || 'A'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-bold text-[#333]">
                            {announcement.authorName || 'Alumni Admin'}
                          </p>
                        </div>
                      </div>
                      <Link 
                        to="/announcements"
                        className="text-xs font-bold text-[#5E7B80] hover:text-[#4c6366] transition"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                  <div className="bg-[#e8ecef] rounded-xl p-4 inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#333]">No announcements yet</h3>
                  <p className="mt-1 text-gray-600 text-sm">
                    Check back later for updates from the alumni community.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/announcements"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-[#5E7B80] hover:bg-[#4c6366] transition"
            >
              View all announcements
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-16 bg-[#f0f2f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-5 bg-[#e8ecef] flex items-center justify-between">
              <h2 className="text-md font-bold text-[#333]">Upcoming Events</h2>
              <Link to="/events" className="text-xs text-gray-600 hover:text-[#333] font-bold flex items-center">
                View All <ArrowRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          {eventsLoading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                  <div className="h-6 bg-[#e8ecef] rounded w-1/3 mb-4"></div>
                  <div className="h-5 bg-[#e8ecef] rounded w-4/5 mb-3"></div>
                  <div className="h-4 bg-[#e8ecef] rounded w-full mb-3"></div>
                  <div className="h-4 bg-[#e8ecef] rounded w-5/6 mb-6"></div>
                  <div className="h-10 bg-[#e8ecef] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#333]">{event.title}</h3>
                        <div className="flex items-center mt-1 text-gray-600 text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600 text-sm">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{formatTime(event.time)}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                        Event
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-sm line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location || 'Virtual Event'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <Link 
                        to="/events"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-[#5E7B80] hover:bg-[#4c6366] transition"
                      >
                        View Event Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <div className="bg-[#e8ecef] rounded-xl p-4 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-bold text-[#333]">No upcoming events</h3>
              <p className="mt-1 text-gray-600 text-sm">
                Check back later for upcoming alumni gatherings and events.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/events"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-lg text-white bg-[#5E7B80] hover:bg-[#4c6366] transition"
            >
              View all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Member Directory',
    description: 'Connect with fellow alumni across different generations and professions.',
    href: '/directory',
    icon: UserGroupIcon,
  },
  {
    name: 'Events & Reunions',
    description: 'Stay updated on upcoming events and reunions for your year group.',
    href: '/events',
    icon: CalendarIcon,
  },
  {
    name: 'Business Directory',
    description: 'Discover businesses owned and operated by fellow alumni.',
    href: '/business',
    icon: BuildingStorefrontIcon,
  },
  {
    name: 'Career Opportunities',
    description: 'Find job postings and business opportunities from fellow alumni.',
    href: '/announcements?category=jobs',
    icon: LightBulbIcon,
  },
];