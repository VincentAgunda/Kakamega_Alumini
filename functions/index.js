/* eslint-disable no-undef */
/* global admin, functions, process */

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Set Gmail credentials
const gmailEmail = functions.config().gmail?.email || process.env.GMAIL_EMAIL;
const gmailPassword = functions.config().gmail?.password || process.env.GMAIL_PASSWORD;

if (!gmailEmail || !gmailPassword) {
  console.error("❌ Gmail credentials not configured!");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendRsvpConfirmation = functions.https.onRequest((req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send("");
    return;
  }

  // Handle main request
  cors(req, res, async () => {
    let uid;
    try {
      // Verify authentication
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({error: "Unauthorized"});
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      uid = decodedToken.uid;

      // Validate request body
      const {to, eventId, eventName, eventDate, eventTime, eventLocation} = req.body;
      if (!to || !eventId || !eventName) {
        return res.status(400).json({error: "Missing required fields"});
      }

      // Send email
      const mailOptions = {
        from: `Alumni Network <${gmailEmail}>`,
        to: to,
        subject: `RSVP Confirmation: ${eventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d3748;">RSVP Confirmed!</h2>
            <p>Thank you for RSVPing to our event. Here are your event details:</p>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #4a5568; margin-top: 0;">${eventName}</h3>
              ${eventDate ? `<p><strong>Date:</strong> ${eventDate}</p>` : ""}
              ${eventTime ? `<p><strong>Time:</strong> ${eventTime}</p>` : ""}
              ${eventLocation ? `<p><strong>Location:</strong> ${eventLocation}</p>` : ""}
            </div>
            
            <p style="margin-top: 30px;">We're looking forward to seeing you there!</p>
            <p>Best regards,<br>Alumni Network Team</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);

      // Log success
      await admin.firestore().collection("emailLogs").add({
        to,
        eventId,
        userId: uid,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "delivered",
        messageId: info.messageId,
      });

      res.status(200).json({success: true, messageId: info.messageId});
    } catch (error) {
      console.error("❌ Email error:", error);

      // Log error
      await admin.firestore().collection("emailLogs").add({
        to: req.body?.to,
        eventId: req.body?.eventId,
        userId: uid || null,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "failed",
        error: error.message,
      });

      res.status(500).json({
        error: "Failed to send email",
        details: error.message,
      });
    }
  });
});