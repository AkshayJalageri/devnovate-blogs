import api from './api';

const UserService = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching user profile' };
    }
  },

  // Admin: Get all users
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching users' };
    }
  },

  // Admin: Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating user role' };
    }
  },

  // Admin: Get pending blogs
  getPendingBlogs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/blogs/pending?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching pending blogs' };
    }
  },

  // Admin: Approve blog
  approveBlog: async (blogId) => {
    try {
      const response = await api.put(`/admin/blogs/${blogId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while approving the blog' };
    }
  },

  // Admin: Reject blog
  rejectBlog: async (blogId) => {
    try {
      const response = await api.put(`/admin/blogs/${blogId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while rejecting the blog' };
    }
  },

  // Admin: Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching dashboard statistics' };
    }
  },
};

export default UserService;