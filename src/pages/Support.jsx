import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Support() {
  const { currentUser } = useAuth();
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would connect to a payment processor
    alert(`Thank you for your ${donationType} donation of KES ${donationAmount}!`);
    setDonationAmount('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#e8ecef] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#333]">Support Our School</h1>
          <p className="mt-2 text-md text-gray-600">
            Your contribution helps maintain excellence at Kakamega High
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Ways to Give</h2>
              <div className="space-y-4">
                <div className="bg-[#e8ecef] p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800">Endowment Fund</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Contribute to our long-term financial stability
                  </p>
                </div>
                <div className="bg-[#e8ecef] p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800">Scholarships</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Support bright but needy students
                  </p>
                </div>
                <div className="bg-[#e8ecef] p-4 rounded-xl">
                  <h3 className="font-medium text-gray-800">Infrastructure</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Help improve school facilities
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Make a Donation</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Type
                  </label>
                  <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="donationType"
                        value="one-time"
                        checked={donationType === 'one-time'}
                        onChange={() => setDonationType('one-time')}
                        className="text-[#ffc947] focus:ring-[#ffc947]"
                      />
                      <span className="ml-2 text-gray-700">One-time</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="donationType"
                        value="monthly"
                        checked={donationType === 'monthly'}
                        onChange={() => setDonationType('monthly')}
                        className="text-[#ffc947] focus:ring-[#ffc947]"
                      />
                      <span className="ml-2 text-gray-700">Monthly</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ffc947] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-gray-800 bg-[#ffc947] hover:bg-[#ffc130] focus:outline-none focus:ring-2 focus:ring-[#ffc947]"
                  >
                    {currentUser ? 'Donate Now' : 'Login to Donate'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Donors</h2>
            <div className="bg-[#e8ecef] p-4 rounded-xl">
              <div className="space-y-3">
                {[
                  { name: 'John M.', amount: '10,000', date: '2 days ago' },
                  { name: 'Susan W.', amount: '5,000', date: '1 week ago' },
                  { name: 'Alumni Group 2005', amount: '50,000', date: '2 weeks ago' },
                ].map((donor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-800">{donor.name}</span>
                    <span className="text-[#0066cc]">KES {donor.amount}</span>
                    <span className="text-gray-600 text-sm">{donor.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}