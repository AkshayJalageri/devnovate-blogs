import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiFileText, FiCheckCircle, FiXCircle, FiEye, FiAlertTriangle, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (activeTab === 'dashboard') {
          const response = await api.get('/admin/stats');
          console.log('Stats response:', response.data);
          setStats(response.data.data);
        } else if (activeTab === 'pending-blogs') {
          const response = await api.get('/admin/blogs/pending');
          console.log('Pending blogs response:', response.data);
          setPendingBlogs(response.data.data);
        } else if (activeTab === 'all-blogs') {
          const response = await api.get('/admin/blogs');
          console.log('All blogs response:', response.data);
          setAllBlogs(response.data.data);
        } else if (activeTab === 'users') {
          const response = await api.get('/admin/users');
          console.log('Users response:', response.data);
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, user]);

  const handleBlogAction = async (blogId, action) => {
    try {
      setError(null);
      
      if (action === 'delete') {
        await api.delete(`/admin/blogs/${blogId}`);
        // Update both lists after deletion
        setAllBlogs(allBlogs.filter(blog => blog._id !== blogId));
        setPendingBlogs(pendingBlogs.filter(blog => blog._id !== blogId));
        toast.success('Blog deleted successfully');
      } else {
        await api.put(
          `/admin/blogs/${blogId}/${action}`,
          {}
        );
        // For approve/reject actions
        const updatedBlog = {...allBlogs.find(blog => blog._id === blogId), status: action === 'approve' ? 'published' : 'rejected'};
        setAllBlogs(allBlogs.map(blog => blog._id === blogId ? updatedBlog : blog));
        setPendingBlogs(pendingBlogs.filter(blog => blog._id !== blogId));
        toast.success(`Blog ${action}d successfully`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      setError(null);
      
      await api.put(
        `/admin/users/${userId}/role`,
        { role: newRole }
      );
      
      // Update the users list
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      }));
      
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-lg text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('pending-blogs')}
              className={`${activeTab === 'pending-blogs' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Blogs
            </button>
            <button
              onClick={() => setActiveTab('all-blogs')}
              className={`${activeTab === 'all-blogs' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Blogs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Users
            </button>
          </nav>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              // This will trigger the useEffect to refetch data
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === 'dashboard' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <FiFileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Blogs</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats?.totalBlogs || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <FiCheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Pending Blogs</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats?.pendingBlogs || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <FiEye className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats?.totalViews || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.recentUsers?.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.profilePicture ? (
                              <img className="h-8 w-8 rounded-full" src={user.profilePicture} alt="" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Blogs</h3>
              <div className="space-y-4">
                {stats?.recentBlogs?.map(blog => (
                  <div key={blog._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-md font-medium text-gray-900">{blog.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{blog.author?.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : blog.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'}`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'all-blogs' ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Blogs</h2>
          
          {allBlogs.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">No blogs found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allBlogs.map(blog => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>By {blog.author?.name}</span>
                        <span>•</span>
                        <span>{blog.status}</span>
                      </div>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                      {blog.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleBlogAction(blog._id, 'reject')}
                            className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                          >
                            <FiX className="mr-2" /> Reject
                          </button>
                          <button
                            onClick={() => handleBlogAction(blog._id, 'approve')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <FiCheck className="mr-2" /> Approve
                          </button>
                        </>
                      )}
                      {blog.status === 'published' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
                              handleBlogAction(blog._id, 'delete');
                            }
                          }}
                          className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'pending-blogs' ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Blog Approvals</h2>
          
          {pendingBlogs.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">No pending blogs to review.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingBlogs.map(blog => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        {blog.author?.profilePicture ? (
                          <img 
                            src={blog.author.profilePicture} 
                            alt={blog.author.name} 
                            className="h-6 w-6 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                            {blog.author?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{blog.author?.name}</span>
                      </div>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                      <button
                        onClick={() => handleBlogAction(blog._id, 'reject')}
                        className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                      >
                        <FiX className="mr-2" /> Reject
                      </button>
                      <button
                        onClick={() => handleBlogAction(blog._id, 'approve')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <FiCheck className="mr-2" /> Approve
                      </button>
                      {blog.status === 'published' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
                              handleBlogAction(blog._id, 'delete');
                            }
                          }}
                          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Users</h2>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(userItem => (
                    <tr key={userItem._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {userItem.profilePicture ? (
                            <img className="h-10 w-10 rounded-full" src={userItem.profilePicture} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              {userItem.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userItem.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(userItem.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {userItem._id !== user._id && (
                          <select
                            value={userItem.role}
                            onChange={(e) => handleUserRoleUpdate(userItem._id, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;