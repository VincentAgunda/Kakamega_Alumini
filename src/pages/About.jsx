import { motion } from 'framer-motion';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function About() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
        { name, email, phone, message },
        import.meta.env.VITE_EMAILJS_USER_ID
      );

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] font-sans">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-lg overflow-hidden p-8 mb-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Kakamega High School Alumni Association
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-lg text-yellow-400 max-w-3xl mx-auto"
            >
              Connecting generations of alumni to foster lifelong relationships and support our alma mater.
            </motion.p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="relative py-16 bg-[#f0f2f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Changed border color to vibrant green */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-[#2a6e47]"
              >
                <div className="flex items-start mb-6">
                  <div className="bg-[#0d3b22] p-3 rounded-lg">
                    {/* Icon color changed to yellow-400 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    {/* Heading color changed */}
                    <h2 className="text-2xl font-bold text-[#0d3b22]">
                      Our Mission
                    </h2>
                    <p className="mt-3 text-gray-700">
                      To unite alumni from all generations of Kakamega High School, fostering a strong network that supports
                      personal and professional growth while giving back to our alma mater and the wider community.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#0d3b22] p-3 rounded-lg">
                    {/* Icon color changed to yellow-400 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    {/* Heading color changed */}
                    <h2 className="text-2xl font-bold text-[#0d3b22]">
                      Our Vision
                    </h2>
                    <p className="mt-3 text-gray-700">
                      To be the most vibrant and impactful alumni network in Kenya, known for our unity, professional
                      excellence, and commitment to supporting education and community development.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Changed border color to vibrant green */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-[#2a6e47]"
              >
                <div className="flex items-start mb-6">
                  <div className="bg-[#0d3b22] p-3 rounded-lg">
                    {/* Icon color changed to yellow-400 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    {/* Heading color changed */}
                    <h2 className="text-2xl font-bold text-[#0d3b22]">
                      Our History
                    </h2>
                    <p className="mt-3 text-gray-700">
                      Founded in 1932, the Kakamega High School Alumni Association has grown from a small group of former
                      students to a thriving network of thousands across Kenya and the world. Our association was formally
                      registered in 1992 and has since been instrumental in various school development projects.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#0d3b22] p-3 rounded-lg">
                    {/* Icon color changed to yellow-400 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    {/* Heading color changed */}
                    <h2 className="text-2xl font-bold text-[#0d3b22]">
                      Our Values
                    </h2>
                    <ul className="mt-3 space-y-3 text-gray-700">
                      <li className="flex items-start">
                        {/* Bullet color changed */}
                        <span className="text-yellow-400 font-bold mr-2">•</span>
                        <span>Unity: Bringing together alumni across generations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 font-bold mr-2">•</span>
                        <span>Excellence: Upholding the school's tradition of high standards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 font-bold mr-2">•</span>
                        <span>Service: Giving back to our school and community</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 font-bold mr-2">•</span>
                        <span>Integrity: Conducting ourselves with honesty and transparency</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f0f2f5]">
          <div className="max-w-7xl mx-auto">
            {/* Heading section background changed to green gradient */}
            <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-lg overflow-hidden p-8 mb-8">
              <h2 className="text-3xl font-bold text-white">
                Get in Touch
              </h2>
              {/* Text color changed to yellow-400 */}
              <p className="mt-2 text-md text-yellow-400">
                We'd love to hear from you. Reach out with any questions or suggestions.
              </p>
            </div>

            {/* Changed border color to vibrant green */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#2a6e47]">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 bg-[#f0f2f5]">
                  {/* Contact Information header with green gradient */}
                  <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] p-5 rounded-xl text-white mb-8">
                    <h3 className="text-lg font-bold">
                      Contact Information
                    </h3>
                    {/* Text color changed to yellow-400 */}
                    <p className="mt-2 text-sm text-yellow-400">
                      We're here to answer any questions you may have
                    </p>
                  </div>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-start">
                      {/* Icon background color */}
                      <div className="bg-[#0d3b22] p-2 rounded-lg">
                        {/* Icon color changed to yellow-400 */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        {/* Label color changed */}
                        <dt className="text-sm font-medium text-[#0d3b22]">Email</dt>
                        <dd className="mt-1">
                          {/* Link color changed */}
                          <a href="mailto:info@kakamega-alumni.com" className="hover:underline text-[#2a6e47] hover:text-[#0d3b22]">
                            info@kakamega-alumni.com
                          </a>
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0d3b22] p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <dt className="text-sm font-medium text-[#0d3b22]">Phone</dt>
                        <dd className="mt-1">
                          <a href="tel:+254 704 143990" className="hover:underline text-[#2a6e47] hover:text-[#0d3b22]">
                            +254 704 143990
                          </a>
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0d3b22] p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <dt className="text-sm font-medium text-[#0d3b22]">Address</dt>
                        <dd className="mt-1 text-[#0d3b22]">
                          P.O. Box 90-50100, Kakamega, Kenya
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="mt-8">
                    {/* Heading color changed */}
                    <h3 className="text-lg font-bold text-[#0d3b22]">
                      Follow Us
                    </h3>
                    <div className="mt-4 flex space-x-6">
                      {/* Icon color changed */}
                      <a href="#" className="text-[#0d3b22] hover:text-yellow-400">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-[#0d3b22] hover:text-yellow-400">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-[#0d3b22] hover:text-yellow-400">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.058.975.045 1.504.207 1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-[#0d3b22] hover:text-yellow-400">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Heading color changed */}
                  <h3 className="text-lg font-bold text-[#0d3b22]">
                    Send us a message
                  </h3>

                  {success ? (
                    <div className="mt-6 p-4 bg-green-50 border border-[#2a6e47] text-green-800 rounded-xl">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Your message has been sent successfully!</span>
                      </div>
                      <button
                        onClick={() => setSuccess(false)}
                        className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-[#0d3b22] font-bold rounded-xl transition"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      {error && (
                        <div className="p-4 bg-red-100 text-red-800 rounded-xl">
                          {error}
                        </div>
                      )}
                      <div>
                        {/* Label color changed */}
                        <label htmlFor="name" className="block text-sm font-bold text-[#0d3b22]">Name</label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full px-4 py-3 border-2 border-[#2a6e47] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-[#0d3b22]">Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full px-4 py-3 border-2 border-[#2a6e47] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-[#0d3b22]">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 block w-full px-4 py-3 border-2 border-[#2a6e47] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-bold text-[#0d3b22]">Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="mt-1 block w-full px-4 py-3 border-2 border-[#2a6e47] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isSending}
                          className="w-full px-4 py-3 bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] text-white rounded-xl hover:opacity-90 transition font-bold flex justify-center items-center"
                        >
                          {isSending ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : 'Send Message'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}