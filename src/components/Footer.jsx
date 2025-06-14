import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { currentUser } = useAuth(); // Get currentUser from AuthContext

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kakamega Alumni</h3>
            <p className="text-gray-400">
              Connecting alumni from Kakamega High School across generations.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              {/* 'Join Now' (Register) and 'Login' are typically always visible or change to 'Dashboard' */}
              {!currentUser && (
                <li><Link to="/login" className="text-gray-400 hover:text-white transition">Join Now</Link></li>
              )}
              {currentUser && (
                  <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
              )}
              <li><Link to="/events" className="text-gray-400 hover:text-white transition">Events</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              {/* Conditional rendering for Announcements and Business Directory */}
              {currentUser && (
                <>
                  <li><Link to="/announcements" className="text-gray-400 hover:text-white transition">Announcements</Link></li>
                  <li><Link to="/business" className="text-gray-400 hover:text-white transition">Business Directory</Link></li>
                </>
              )}
              <li><Link to="/newsletter" className="text-gray-400 hover:text-white transition">Newsletter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedin size={20} /></a>
            </div>
            <p className="text-gray-400">contact@kakamega-alumni.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Kakamega High School Alumni Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}