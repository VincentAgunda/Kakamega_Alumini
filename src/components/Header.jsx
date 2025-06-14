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
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="h-10" />
              <span className="text-xl font-bold text-primary dark:text-primary-dark">Kakamega Alumni</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-secondary dark:hover:text-secondary-dark transition ${
                      isActive
                        ? 'text-secondary dark:text-secondary-dark font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {currentUser && (
                <>
                  <NavLink to="/announcements" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">
                    Announcements
                  </NavLink>
                  <NavLink to="/directory" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">
                    Directory
                  </NavLink>
                  <NavLink to="/business" className="text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark">
                    Business
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Section: Theme Toggle + Profile */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-dark transition">
                <FaUserCircle className="text-2xl" />
                <ChevronDownIcon className="ml-1 w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50">
                {currentUser ? (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={userData?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
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
                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          Login
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/register"
                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
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
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1">
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
                  <NavLink to="/announcements" onClick={() => setMobileMenuOpen(false)}>Announcements</NavLink>
                  <NavLink to="/directory" onClick={() => setMobileMenuOpen(false)}>Directory</NavLink>
                  <NavLink to="/business" onClick={() => setMobileMenuOpen(false)}>Business</NavLink>
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
                      className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-center bg-gray-200 dark:bg-gray-700 rounded py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center bg-primary dark:bg-primary-dark text-white rounded py-2">Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-gray-200 dark:bg-gray-700 rounded py-2">Register</Link>
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
