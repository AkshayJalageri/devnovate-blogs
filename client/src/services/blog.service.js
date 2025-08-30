import api from './api';

const BlogService = {
  getAllBlogs: async (page = 1, limit = 10, search = '', tags = []) => {
    try {
      let query = `/blogs?page=${page}&limit=${limit}`;
      if (search) query += `&search=${search}`;
      if (tags.length > 0) query += `&tags=${tags.join(',')}`;

      const response = await api.get(query);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching blogs' };
    }
  },

  getTrendingBlogs: async (limit = 5) => {
    try {
      const response = await api.get(`/blogs/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching trending blogs' };
    }
  },

  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching the blog' };
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating the blog' };
    }
  },

  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while updating the blog' };
    }
  },

  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while deleting the blog' };
    }
  },

  likeBlog: async (id) => {
    try {
      const response = await api.post(`/blogs/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while liking the blog' };
    }
  },

  addComment: async (id, content) => {
    try {
      const response = await api.post(`/blogs/${id}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while adding a comment' };
    }
  },

  getComments: async (id, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/blogs/${id}/comments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching comments' };
    }
  },

  getUserBlogs: async () => {
    try {
      const response = await api.get('/blogs/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching your blogs' };
    }
  },

  getLikedBlogs: async () => {
    try {
      const response = await api.get('/blogs/liked');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching liked blogs' };
    }
  },

  getBlogsByUser: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/users/${userId}/blogs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching user blogs' };
    }
  }
};

export default BlogService;
