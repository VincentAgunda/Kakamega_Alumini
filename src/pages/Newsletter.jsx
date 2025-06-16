import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useAuth } from "../contexts/AuthContext"; // Corrected path
import { useNavigate } from 'react-router-dom';

export default function Newsletter() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // Ensure that firstName, lastName, and yearOfExit exist before setting
      const currentName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      setEmail(currentUser.email || '');
      setName(currentName);
      setYear(currentUser.yearOfExit || ''); // Set year to empty string if null/undefined
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to subscribe. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Basic client-side validation
    if (!name || !email) {
      setError('Full Name and Email Address are required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address.');
        return;
    }

    setIsLoading(true);
    setError(null);

    // --- IMPORTANT: Console logs to inspect data before sending ---
    console.log("--- EmailJS Send Attempt ---");
    console.log("Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log("Template ID:", import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID);
    console.log("User ID (Public Key):", import.meta.env.VITE_EMAILJS_USER_ID);

    const templateParams = {
      name: name,
      email: email,
      year: year, // Will be an empty string if not set, which is usually fine
      userId: currentUser.uid // This should always exist if currentUser is not null
    };
    // !!! --- THIS IS THE CRUCIAL CHANGE --- !!!
    console.log("Template Parameters being sent:", JSON.stringify(templateParams, null, 2));
    // !!! --- END CRUCIAL CHANGE --- !!!
    console.log("--- End EmailJS Send Attempt Data ---");

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID,
      templateParams, // Using the logged templateParams
      import.meta.env.VITE_EMAILJS_USER_ID
    )
    .then((response) => {
      console.log('Email successfully sent!', response.status, response.text);
      setIsSubscribed(true);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      // EmailJS errors often have a .text or .message property
      setError(`There was an error subscribing. Please try again. Details: ${error.text || error.message || 'Unknown error'}`);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 bg-[#e8ecef] border-b border-gray-200">
            <h1 className="text-2xl font-bold text-[#333]">Alumni Newsletter</h1>
            <p className="mt-1 text-sm text-gray-600">
              Stay updated with the latest news and events
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl">
                {error}
              </div>
            )}

            {isSubscribed ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="mt-3 text-lg font-bold text-[#333]">
                  Successfully Subscribed!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Thank you for subscribing to our newsletter. You'll receive our next edition in your inbox.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsSubscribed(false)}
                    className="px-4 py-2 bg-[#ffc947] hover:bg-[#ffc130] text-[#333] font-bold rounded-xl transition"
                  >
                    Subscribe Another Email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent"
                    required
                    disabled={!!currentUser} // Disable if user is logged in and name is pre-filled
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent"
                    required
                    disabled={!!currentUser} // Disable if user is logged in and email is pre-filled
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-600">
                    Year of Exit (Optional)
                  </label>
                  <input
                    type="number"
                    id="year"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent"
                    disabled={!!currentUser} // Disable if user is logged in and year is pre-filled
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 mt-1 text-[#ffc947] focus:ring-[#ffc947] border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    I agree to receive email newsletters from Kakamega High Alumni Association
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#333] bg-[#ffc947] hover:bg-[#ffc130] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc947]"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#333]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : 'Subscribe to Newsletter'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="px-6 py-4 bg-[#e8ecef] border-t border-gray-200">
            <h3 className="text-sm font-bold text-[#333] mb-2">
              Newsletter Archive
            </h3>
            <ul className="space-y-2">
              {[
                { title: 'Fall 2023 Newsletter', date: 'October 15, 2023' },
                { title: 'Summer 2023 Newsletter', date: 'July 5, 2023' },
                { title: 'Spring 2023 Newsletter', date: 'April 1, 2023' },
              ].map((newsletter, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm text-[#333] hover:text-[#ffc130] hover:underline"
                  >
                    {newsletter.title} - {newsletter.date}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}