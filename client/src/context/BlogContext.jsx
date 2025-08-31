import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBlogs: 0
  });

  const { user } = useContext(AuthContext);

  // Fetch blogs with search and filter
  const getBlogs = useCallback(async (page = 1, limit = 6, search = '', tag = '') => {
    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) params.append('search', search);
      if (tag) params.append('tag', tag);

      const response = await api.get(`/blogs?${params}`);
      const { blogs, pagination: paginationData } = response.data.data;

      setBlogs(blogs);
      setPagination(paginationData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Fetch trending blogs
  const getTrendingBlogs = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }

    try {
      const response = await api.get('/blogs/trending');
      setTrendingBlogs(response.data.data);
    } catch (err) {
      // Don't set error for trending blogs as it's not critical
    }
  }, [loading]);

  // Fetch a single blog
  const getBlog = useCallback(async (blogId) => {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch blog');
    }
  }, []);

  // Create a new blog
  const createBlog = useCallback(async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create blog' 
      };
    }
  }, []);

  // Update a blog
  const updateBlog = useCallback(async (blogId, blogData) => {
    try {
      const response = await api.put(`/blogs/${blogId}`, blogData);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update blog' 
      };
    }
  }, []);

  // Delete a blog
  const deleteBlog = useCallback(async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete blog' 
      };
    }
  }, []);

  // Like/unlike a blog
  const likeBlog = useCallback(async (blogId) => {
    try {
      const response = await api.post(`/blogs/${blogId}/like`);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to like blog' 
      };
    }
  }, []);

  // Add comment to a blog
  const addComment = useCallback(async (blogId, commentData) => {
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, commentData);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to add comment' 
      };
    }
  }, []);

  // Get user's blogs
  const getUserBlogs = useCallback(async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/blogs`);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to fetch user blogs' 
      };
    }
  }, []);

  // Get user's liked blogs
  const getLikedBlogs = useCallback(async () => {
    try {
      const response = await api.get('/blogs/liked');
      return { success: true, data: response.data.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to fetch liked blogs' 
      };
    }
  }, []);

  const value = {
    blogs,
    trendingBlogs,
    loading,
    error,
    pagination,
    getBlogs,
    getTrendingBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment,
    getUserBlogs,
    getLikedBlogs
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export { BlogContext };
export default BlogProvider;