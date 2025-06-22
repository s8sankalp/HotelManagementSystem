import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  StarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Luxury Accommodations',
      description: 'Experience world-class comfort with our premium rooms and suites designed for your ultimate relaxation.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Easy Booking',
      description: 'Book your stay in just a few clicks with our streamlined reservation system.'
    },
    {
      icon: StarIcon,
      title: 'Premium Service',
      description: 'Enjoy exceptional service with our dedicated staff committed to making your stay memorable.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Safe',
      description: 'Your security and privacy are our top priorities with advanced safety measures.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Happy Guests' },
    { number: '50+', label: 'Luxury Rooms' },
    { number: '24/7', label: 'Support' },
    { number: '4.8', label: 'Rating' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-hotel-600 via-hotel-700 to-hotel-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="text-hotel-200">Luxury Hotel</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-hotel-100 max-w-3xl mx-auto">
              Experience unparalleled luxury and comfort in the heart of the city. 
              Your perfect stay awaits with our world-class amenities and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-hotel-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Book Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-hotel-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-hotel-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Hotel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for discerning travelers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover text-center group">
                <div className="w-16 h-16 bg-hotel-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-hotel-200 transition-colors duration-200">
                  <feature.icon className="w-8 h-8 text-hotel-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hotel-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-hotel-100 mb-8">
            Join thousands of satisfied guests who have chosen us for their perfect stay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-hotel-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Get Started Today
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-hotel-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-hotel-600 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HotelMS</span>
              </div>
              <p className="text-gray-400">
                Experience luxury redefined with our world-class accommodations and exceptional service.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Room Booking</li>
                <li>24/7 Support</li>
                <li>Premium Amenities</li>
                <li>Concierge Service</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+1 (555) 123-4567</li>
                <li>info@hotelms.com</li>
                <li>123 Luxury Ave, City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hotel Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 