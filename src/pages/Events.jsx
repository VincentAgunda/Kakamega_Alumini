import { useState, useEffect } from 'react';
import useFirestore from '../hooks/useFirestore';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { db } from '../config/firebase';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { sendRsvpEmail } from '../services/emailService';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: events, loading } = useFirestore('events');
  const { userData } = useAuth();
  const [rsvpSuccess, setRsvpSuccess] = useState(null);
  const [rsvpProcessing, setRsvpProcessing] = useState({});
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsApproved(userData.isApproved);
    }
  }, [userData]);

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
      await addDoc(collection(db, 'rsvps'), {
        eventId,
        userId: userData.uid,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        await sendRsvpEmail(userData.email, eventData);
      }

      setRsvpSuccess({
        type: 'success',
        message: 'RSVP successful! You will receive a confirmation email shortly.'
      });

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
      <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center">
        {/* Changed border color from gold to yellow */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Alumni Events
          </h1>
          {/* Changed text color from gold to yellow */}
          <p className="mt-2 text-md text-yellow-400">
            Connect with fellow alumni at our upcoming events
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-200">
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'upcoming'
                    ? 'bg-yellow-400 text-[#0d3b22]' // Changed from gold
                    : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'past'
                    ? 'bg-yellow-400 text-[#0d3b22]' // Changed from gold
                    : 'bg-green-100 text-[#0d3b22] hover:bg-green-200'
                }`}
              >
                Past Events
              </button>
            </div>

            {rsvpSuccess && (
              <div className={`mb-6 p-4 rounded-xl ${
                rsvpSuccess.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-800' 
                  : 'bg-red-50 border-l-4 border-red-500 text-red-800'
              }`}>
                <div className="flex items-start">
                  {rsvpSuccess.type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{rsvpSuccess.type === 'success' ? 'Success!' : 'Error'}</p>
                    <p>{rsvpSuccess.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
                  return (
                    <div key={event.id} className="border-b border-green-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="flex items-center justify-center h-32 w-32 rounded-lg bg-green-50 text-green-700">
                            <CalendarIcon className="h-12 w-12" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[#0d3b22]">
                            {event.title}
                          </h3>
                          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="flex items-center text-sm text-green-700">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {formatDate(eventDate)}
                            </div>
                            <div className="flex items-center text-sm text-green-700">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {event.time || 'All day'}
                            </div>
                            <div className="flex items-center text-sm text-green-700">
                              <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                              {event.locationLink ? (
                                <a 
                                  href={event.locationLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#2a6e47] hover:underline"
                                >
                                  {event.location || 'Virtual'}
                                </a>
                              ) : (
                                <span>{event.location || 'Virtual'}</span>
                              )}
                            </div>
                          </div>
                          <p className="mt-3 text-gray-700">
                            {event.description}
                          </p>
                          <div className="mt-4">
                            {activeTab === 'upcoming' ? (
                              <button
                                onClick={() => handleRSVP(event.id)}
                                disabled={rsvpProcessing[event.id] || !isApproved}
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${
                                  isApproved 
                                    ? 'text-[#0d3b22] bg-yellow-400 hover:bg-yellow-500' // Changed from gold
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                } ${rsvpProcessing[event.id] ? 'opacity-75' : ''}`}
                              >
                                {rsvpProcessing[event.id] 
                                  ? 'Processing...' 
                                  : isApproved 
                                    ? 'RSVP Now' 
                                    : 'Approval Required'}
                              </button>
                            ) : (
                              <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold text-[#0d3b22] bg-yellow-400 hover:bg-yellow-500">
                                View Photos
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-white rounded-2xl border border-green-200">
                  <p className="text-green-700">
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