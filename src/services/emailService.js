import { getAuth } from 'firebase/auth';

export const sendRsvpEmail = async (userEmail, event) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user ID token
    const idToken = await user.getIdToken();
    
    // Format event date
    const eventDate = event.date?.toDate 
      ? event.date.toDate().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      : null;

    // Use your actual project ID here
    const projectId = 'kakamega-high';
    const url = `https://us-central1-${projectId}.cloudfunctions.net/sendRsvpConfirmation`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        to: userEmail,
        eventId: event.id,
        eventName: event.title,
        eventDate: eventDate,
        eventTime: event.time || null,
        eventLocation: event.location || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Email server error');
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Email error:', {
      message: error.message,
      code: error.code
    });
    
    return {
      success: false,
      error: {
        code: error.code || 'internal',
        message: error.message || 'Failed to send RSVP email'
      }
    };
  }
};