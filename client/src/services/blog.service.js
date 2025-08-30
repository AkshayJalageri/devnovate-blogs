import api from './api';

const BlogService = {
  // Get all blogs with optional pagination and filters
  getAllBlogs: async (page = 1, limit = 10, search = '', tags = []) => {
    try {
      let query = `/blogs?page=${page}&limit=${limit}`;
      if (search) query += `&search=${search}`;
      if (tags && tags.length > 0) query += `&tags=${tags.join(',')}`;
      
      const response = await api.get(query);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching blogs' };
    }
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 5) => {
    try {
      const response = await api.get(`/blogs/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching trending blogs' };
    }
  },

  // Get a single blog by ID
  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching the blog' };
    }
  },

  // Create a new blog
  createBlog: async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating the blog' };
    }
  },

  // Update a blog
  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating the blog' };
    }
  },

  // Delete a blog
  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while deleting the blog' };
    }
  },

  // Like a blog
  likeBlog: async (id) => {
    try {
      const response = await api.post(`/blogs/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while liking the blog' };
    }
  },

  // Add a comment to a blog
  addComment: async (id, content) => {
    try {
      const response = await api.post(`/blogs/${id}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while adding a comment' };
    }
  },

  // Get comments for a blog
  getComments: async (id, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/blogs/${id}/comments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching comments' };
    }
  },

  // Get user's blogs
  getUserBlogs: async () => {
    try {
      const response = await api.get('/blogs/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching your blogs' };
    }
  },

  // Get user's liked blogs
  getLikedBlogs: async () => {
    try {
      const response = await api.get('/blogs/liked');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching liked blogs' };
    }
  },

  // Get blogs by a specific user (public profile)
  getBlogsByUser: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/users/${userId}/blogs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching user blogs' };
    }
  },
};

export default BlogService;