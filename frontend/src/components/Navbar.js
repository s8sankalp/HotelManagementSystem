import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on component mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    ...(isLoggedIn ? [
      { name: 'Dashboard', path: '/dashboard', icon: UserIcon },
      { name: 'My Bookings', path: '/my-bookings', icon: BuildingOfficeIcon },
    ] : []),
    ...(userRole === 'ROLE_ADMIN' ? [
      { name: 'Admin', path: '/admin', icon: CogIcon },
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-hotel-600 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HotelMS</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'border-hotel-500 text-hotel-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                Sign out
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hotel-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-hotel-50 text-hotel-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            ))}
            
            {!isLoggedIn ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-hotel-600 text-white hover:bg-hotel-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 