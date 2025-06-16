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

  const authLinks = [
    { name: 'Announcements', path: '/announcements' },
    { name: 'Directory', path: '/directory' },
    { name: 'Business', path: '/business' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Left Section: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <svg
                className="h-6 md:h-7 text-gray-900 dark:text-white"
                viewBox="0 0 1000 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <style>
                  {`
                    .tesla-text {
                      font-family: 'Orbitron', sans-serif;
                      font-size: 40px;
                      font-weight: bold;
                    }
                  `}
                </style>
                <text x="0" y="50" className="tesla-text">KAKAMEGA ALUMNI</text>
              </svg>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex justify-center flex-grow">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium ${
                          isActive ? 'text-secondary dark:text-secondary-dark font-semibold' : ''
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                {currentUser &&
                  authLinks.map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 text-sm font-medium ${
                            isActive ? 'text-secondary dark:text-secondary-dark font-semibold' : ''
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>

          {/* Right Section: Theme Toggle + Profile + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Menu as="div" className="relative z-10">
              <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
              {currentUser &&
                authLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-800 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition"
                  >
                    {link.name}
                  </NavLink>
                ))}
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex flex-col space-y-3">
                {currentUser ? (
                  <>
                    <Link
                      to={userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2 px-4 hover:bg-primary-darker dark:hover:bg-primary transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2 px-4 hover:bg-primary-darker dark:hover:bg-primary transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Register
                    </Link>
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
