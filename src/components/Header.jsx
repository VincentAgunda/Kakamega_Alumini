import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  const { currentUser, logout, userData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Events', path: '/events' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"> {/* Reduced shadow for a cleaner look */}
      <div className="container mx-auto px-6 py-3 md:py-4"> {/* Adjusted padding for a slightly more compact feel, increased px for better spacing on edges */}
        <div className="flex justify-between items-center">
          {/* Left Section: Logo + Nav */}
          <div className="flex items-center space-x-8"> {/* Main spacing between logo and nav */}
            <Link to="/" className="flex items-center"> {/* Removed space-x-2 as logo and text are often close or just the logo */}
              <img src="/logo.svg" alt="Logo" className="h-6 md:h-7" /> {/* Adjusted logo size for a more modern, compact look */}
              {/* Optional: If your logo is strong enough, you might remove the text here for ultimate minimalism */}
              {/* <span className="text-xl font-bold text-gray-800 dark:text-white ml-2 hidden md:inline">Kakamega Alumni</span> */}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex justify-center flex-grow"> {/* Added justify-center and flex-grow to push nav items towards center */}
              <ul className="flex space-x-8"> {/* Increased spacing between nav items */}
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium ${ // Smaller font, subtle transition
                          isActive
                            ? 'text-secondary dark:text-secondary-dark font-semibold' // Slightly more emphasis on active
                            : ''
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                {currentUser && (
                  <>
                    <li>
                      <NavLink to="/announcements" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium">
                        Announcements
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/directory" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium">
                        Directory
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/business" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium">
                        Business
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>

          {/* Right Section: Theme Toggle + Profile + Mobile Toggle */}
          <div className="flex items-center space-x-4"> {/* Spacing between right-aligned elements */}
            <ThemeToggle />
            <Menu as="div" className="relative z-10"> {/* Ensure Menu dropdown is above other content */}
              <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"> {/* Added focus styles */}
                <FaUserCircle className="text-2xl" />
                <ChevronDownIcon className="ml-1 w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1">
                {currentUser ? (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                          className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/login"
                          className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Login
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/register"
                          className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Register
                        </Link>
                      )}
                    </Menu.Item>
                  </>
                )}
              </Menu.Items>
            </Menu>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" // Added focus styles
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition"
                >
                  {link.name}
                </NavLink>
              ))}
              {currentUser && (
                <>
                  <NavLink to="/announcements" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">Announcements</NavLink>
                  <NavLink to="/directory" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">Directory</NavLink>
                  <NavLink to="/business" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">Business</NavLink>
                </>
              )}
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex flex-col space-y-3">
                {currentUser ? (
                  <>
                    <Link
                      to={userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2 px-4 hover:bg-primary-darker dark:hover:bg-primary transition-colors duration-200" // Added hover
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200" // Added text color and hover
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2 px-4 hover:bg-primary-darker dark:hover:bg-primary transition-colors duration-200">Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}