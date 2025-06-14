import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: events, loading } = useFirestore('events');

  const formatDate = (date) => {
    if (!date) return 'Date unknown';
    if (date.toDate) date = date.toDate();
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const now = new Date();
  const filteredEvents = events.filter(event => {
    const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
    if (!eventDate) return false;

    if (activeTab === 'upcoming') {
      return eventDate >= now;
    } else {
      return eventDate < now;
    }
  }).sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return activeTab === 'upcoming'
      ? dateA - dateB
      : dateB - dateA;
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Connect with fellow alumni at our upcoming events
            </p>
          </div>

          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'upcoming'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'past'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Past Events
              </button>
            </div>

            <div className="space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
                  return (
                    <div key={event.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="flex items-center justify-center h-32 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-12 w-12" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {formatDate(eventDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {event.time || 'All day'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {event.locationLink ? (
                                <a 
                                  href={event.locationLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary dark:text-primary-dark hover:underline"
                                >
                                  {event.location || 'Virtual'}
                                </a>
                              ) : (
                                <span>{event.location || 'Virtual'}</span>
                              )}
                            </div>
                          </div>
                          <p className="mt-3 text-gray-600 dark:text-gray-300">
                            {event.description}
                          </p>
                          <div className="mt-4">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800">
                              {activeTab === 'upcoming' ? 'RSVP' : 'View Photos'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeTab === 'upcoming'
                      ? 'No upcoming events scheduled. Check back later!'
                      : 'No past events to display.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}