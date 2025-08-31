import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiEdit, FiHome, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">Devnovate</Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/create-blog" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-blue-600">
                  Write Blog
                </Link>
              )}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="ml-2">{user?.name}</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 flex items-center"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              <FiHome className="inline mr-2" /> Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/create-blog" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  <FiEdit className="inline mr-2" /> Write Blog
                </Link>
                
                <Link 
                  to="/profile" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="inline mr-2" /> Profile
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiSettings className="inline mr-2" /> Admin
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;