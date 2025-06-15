import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  CheckBadgeIcon, 
  XCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { sendRsvpEmail } from '../../services/emailService';

export default function RsvpManager() {
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventRsvps, setEventRsvps] = useState([]);
  const [emailStatus, setEmailStatus] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.()
        }));
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRsvps = async () => {
      if (!selectedEvent) return;
      try {
        setLoading(true);
        const rsvpsQuery = query(
          collection(db, 'rsvps'),
          where('eventId', '==', selectedEvent)
        );
        const querySnapshot = await getDocs(rsvpsQuery);
        
        const rsvpsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const rsvpData = doc.data();
          const userRef = doc(db, 'users', rsvpData.userId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : null;
          
          return {
            id: doc.id,
            ...rsvpData,
            user: userData ? {
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              phone: userData.phone,
              yearOfExit: userData.yearOfExit
            } : null,
            createdAt: rsvpData.createdAt?.toDate?.()
          };
        }));
        
        setEventRsvps(rsvpsData);
      } catch (error) {
        console.error('Error fetching RSVPs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, [selectedEvent]);

  const resendConfirmationEmail = async (rsvp) => {
    if (!rsvp.user?.email) return;
    
    setEmailStatus(prev => ({
      ...prev,
      [rsvp.id]: { status: 'sending' }
    }));

    try {
      const eventDoc = await getDoc(doc(db, 'events', rsvp.eventId));
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const event = {
        id: eventDoc.id,
        ...eventDoc.data(),
        date: eventDoc.data().date?.toDate?.()
      };

      const result = await sendRsvpEmail(rsvp.user.email, event);
      
      setEmailStatus(prev => ({
        ...prev,
        [rsvp.id]: { 
          status: result.success ? 'success' : 'error',
          message: result.success 
            ? 'Email resent successfully' 
            : result.error?.message || 'Failed to resend email'
        }
      }));

      setTimeout(() => {
        setEmailStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[rsvp.id];
          return newStatus;
        });
      }, 5000);

    } catch (error) {
      setEmailStatus(prev => ({
        ...prev,
        [rsvp.id]: { 
          status: 'error',
          message: error.message || 'Failed to resend email'
        }
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">RSVP Management</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Event
        </label>
        <select
          value={selectedEvent || ''}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
        >
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} - {event.date?.toLocaleDateString() || 'No date'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : eventRsvps.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No RSVPs found for this event
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  RSVP Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {eventRsvps.map(rsvp => (
                <tr key={rsvp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {rsvp.user?.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Class of {rsvp.user?.yearOfExit || 'unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {rsvp.user?.email || 'No email'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {rsvp.user?.phone || 'No phone'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rsvp.status === 'confirmed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckBadgeIcon className="h-4 w-4 mr-1" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {rsvp.createdAt?.toLocaleDateString() || 'Unknown date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {emailStatus[rsvp.id]?.status === 'sending' ? (
                        <div className="text-yellow-600 flex items-center">
                          <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                          Sending...
                        </div>
                      ) : emailStatus[rsvp.id]?.status === 'success' ? (
                        <div className="text-green-600 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Sent
                        </div>
                      ) : emailStatus[rsvp.id]?.status === 'error' ? (
                        <div className="text-red-600 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          Failed
                        </div>
                      ) : (
                        <button
                          onClick={() => resendConfirmationEmail(rsvp)}
                          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                          disabled={!rsvp.user?.email}
                        >
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Resend
                        </button>
                      )}
                    </div>
                    {emailStatus[rsvp.id]?.message && (
                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {emailStatus[rsvp.id].message}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}