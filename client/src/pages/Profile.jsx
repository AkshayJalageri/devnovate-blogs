import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BlogContext } from '../context/BlogContext';
import { Link } from 'react-router-dom';
import { FiEdit, FiUser, FiMail, FiAlertCircle, FiEye, FiHeart, FiClock } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
  const { userBlogs, likedBlogs, getUserBlogs, getLikedBlogs, loading: blogLoading } = useContext(BlogContext);
  
  const [activeTab, setActiveTab] = useState('blogs');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server and get a URL back
      // For now, we'll create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profilePicture: imageUrl
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await updateProfile(formData);
      if (success) {
        setEditMode(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {!editMode ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-blue-600 mt-1 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-6 flex justify-center">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p className="text-gray-700">{user.bio || 'No bio provided yet.'}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-2xl font-bold text-blue-600">{userBlogs.length}</p>
                      <p className="text-gray-600">Blogs</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-2xl font-bold text-blue-600">{likedBlogs.length}</p>
                      <p className="text-gray-600">Liked</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                
                <div className="mb-4">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex justify-center mb-2">
                    {formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile preview" 
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {authLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'blogs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('blogs')}
            >
              My Blogs
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'liked' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('liked')}
            >
              Liked Blogs
            </button>
          </div>
          
          {/* Tab Content */}
          {blogLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'blogs' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Blogs</h2>
                <Link 
                  to="/create-blog" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create New Blog
                </Link>
              </div>
              
              {userBlogs.length > 0 ? (
                <div className="space-y-6">
                  {userBlogs.map(blog => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <Link to={`/blogs/${blog._id}`}>
                            <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{blog.title}</h3>
                          </Link>
                          <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : blog.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : blog.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'}`}
                          >
                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          <div className="flex space-x-4">
                            <div className="flex items-center">
                              <FiHeart className="mr-1" />
                              <span>{blog.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <FiEye className="mr-1" />
                              <span>{blog.views || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">You haven't created any blogs yet.</p>
                  <Link 
                    to="/create-blog" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Create Your First Blog
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6">Liked Blogs</h2>
              
              {likedBlogs.length > 0 ? (
                <div className="space-y-6">
                  {likedBlogs.map(blog => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                      <div className="p-6">
                        <Link to={`/blogs/${blog._id}`}>
                          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{blog.title}</h3>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            {blog.author?.profilePicture ? (
                              <img 
                                src={blog.author.profilePicture} 
                                alt={blog.author.name} 
                                className="h-6 w-6 rounded-full mr-2 object-cover"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                                {blog.author?.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span>{blog.author?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{blog.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600">You haven't liked any blogs yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;