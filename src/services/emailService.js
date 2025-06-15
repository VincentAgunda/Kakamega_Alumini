import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

export const sendRsvpEmail = async (userEmail, event) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendRsvpConfirmation');
    
    const eventDate = event.date?.toDate 
      ? event.date.toDate().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      : null;

    const result = await sendEmail({
      to: userEmail,
      eventId: event.id,
      eventName: event.title,
      eventDate: eventDate,
      eventTime: event.time || null,
      eventLocation: event.location || null
    });

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('Error sending RSVP email:', error);
    
    return {
      success: false,
      error: {
        code: error.code || 'unknown',
        message: error.message || 'Failed to send RSVP email',
        details: error.details || null
      }
    };
  }
};