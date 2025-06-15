const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

exports.sendRsvpConfirmation = functions.https.onCall(async (data, context) => {
  // Verify the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Only authenticated users can send RSVPs'
    );
  }

  try {
    // Validate required fields
    if (!data.to || !data.eventName) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Missing required email fields'
      );
    }

    const mailOptions = {
      from: `Alumni Network <${functions.config().gmail.email}>`,
      to: data.to,
      subject: `RSVP Confirmation: ${data.eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">RSVP Confirmed!</h2>
          <p>Thank you for RSVPing to our event. Here are your event details:</p>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #4a5568; margin-top: 0;">${data.eventName}</h3>
            ${data.eventDate ? `<p><strong>Date:</strong> ${data.eventDate}</p>` : ''}
            ${data.eventTime ? `<p><strong>Time:</strong> ${data.eventTime}</p>` : ''}
            ${data.eventLocation ? `<p><strong>Location:</strong> ${data.eventLocation}</p>` : ''}
          </div>
          
          <p style="margin-top: 30px;">We're looking forward to seeing you there!</p>
          <p>Best regards,<br>Alumni Network Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // Log the email in Firestore
    await admin.firestore().collection('emailLogs').add({
      to: data.to,
      eventId: data.eventId,
      userId: context.auth.uid,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'delivered'
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log the error in Firestore
    await admin.firestore().collection('emailLogs').add({
      to: data.to,
      eventId: data.eventId,
      userId: context.auth?.uid || null,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error.message
    });

    throw new functions.https.HttpsError(
      'internal', 
      'Failed to send confirmation email'
    );
  }
});