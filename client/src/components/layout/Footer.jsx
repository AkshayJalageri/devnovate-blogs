import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="text-2xl font-bold text-blue-400">Devnovate</Link>
            <p className="mt-2 text-gray-300">
              A platform for developers to share knowledge, experiences, and insights with the community.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400">Home</Link>
              </li>
              <li>
                <Link to="/create-blog" className="text-gray-300 hover:text-blue-400">Write Blog</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blue-400">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-blue-400">Register</Link>
              </li>
            </ul>
          </div>
          
          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
              >
                <FiGithub className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {currentYear} Devnovate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;