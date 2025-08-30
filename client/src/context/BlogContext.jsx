import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const { user } = useContext(AuthContext);

  // Get all published blogs with pagination, search, and filtering
  const getBlogs = useCallback(async (page = 1, limit = 10, search = '', tag = '', author = '') => {
    // Prevent multiple simultaneous calls
    if (loading) {
      console.log('Blog fetch already in progress, skipping...');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await api.get('/blogs', {
        params: { page, limit, search, tag, author }
      });
      
      // Add isLiked property to each blog - get user from context at call time
      const currentUser = user; // Get current user at call time
      const userId = currentUser?._id;
      const blogsWithLikeStatus = res.data.data.map(blog => ({
        ...blog,
        isLiked: userId ? blog.likes.includes(userId) : false
      }));
      
      setBlogs(blogsWithLikeStatus);
      setPagination({
        page: page,
        limit: limit,
        total: res.data.count,
        totalPages: Math.ceil(res.data.count / limit)
      });
      
      return res.data;
    } catch (err) {
      console.error('Error fetching blogs:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch blogs';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies to prevent infinite loops

  // Get trending blogs
  const getTrendingBlogs = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loading) {
      console.log('Trending blogs fetch already in progress, skipping...');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const res = await api.get('/blogs/trending');
      
      // Add isLiked property to each trending blog - get user from context at call time
      const currentUser = user; // Get current user at call time
      const userId = currentUser?._id;
      const trendingBlogsWithLikeStatus = res.data.data.map(blog => ({
        ...blog,
        isLiked: userId ? blog.likes.includes(userId) : false
      }));
      
      setTrendingBlogs(trendingBlogsWithLikeStatus);
      return trendingBlogsWithLikeStatus;
    } catch (err) {
      console.error('Error fetching trending blogs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies to prevent infinite loops

  // Get single blog by ID
  const getBlogById = async (id) => {
    try {
      // Only set loading if we don't already have the blog or it's a different blog
      if (!currentBlog || currentBlog._id !== id) {
        setLoading(true);
      }
      
      // Validate if id is a valid MongoDB ObjectId format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        setError('Invalid blog ID format');
        toast.error('Invalid blog ID format');
        return null;
      }
      
      // If we already have this blog loaded, return it immediately
      if (currentBlog && currentBlog._id === id) {
        setLoading(false);
        return currentBlog;
      }
      
      const res = await api.get(`/blogs/${id}`);
      const blogData = res.data.data;
      
      // Ensure blog data is valid before setting
      if (blogData) {
        // Check if the user's ID is in the likes array to determine isLiked status
        const userId = user?._id;
        const isLiked = userId ? blogData.likes.includes(userId) : false;
        
        // Ensure comments are properly formatted
        const formattedBlog = {
          ...blogData,
          comments: Array.isArray(blogData.comments) ? blogData.comments : [],
          isLiked: isLiked
        };
        
        setCurrentBlog(formattedBlog);
        return formattedBlog;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.response?.data?.message || 'Failed to fetch blog');
      toast.error(err.response?.data?.message || 'Failed to fetch blog');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new blog
  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      const res = await api.post('/blogs', blogData);
      toast.success('Blog submitted for review');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
      toast.error(err.response?.data?.message || 'Failed to create blog');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      const res = await api.put(`/blogs/${id}`, blogData);
      toast.success('Blog updated successfully');
      
      // Update current blog if it's the one being viewed
      if (currentBlog && currentBlog._id === id) {
        setCurrentBlog(res.data.data);
      }
      
      // Update blogs list if it contains the updated blog
      setBlogs(blogs.map(blog => blog._id === id ? res.data.data : blog));
      
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
      toast.error(err.response?.data?.message || 'Failed to update blog');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/blogs/${id}`);
      
      // Remove from blogs list
      setBlogs(blogs.filter(blog => blog._id !== id));
      
      // Remove from user blogs if present
      setUserBlogs(userBlogs.filter(blog => blog._id !== id));
      
      toast.success('Blog deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      toast.error(err.response?.data?.message || 'Failed to delete blog');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Like/unlike blog
  const likeBlog = async (id) => {
    try {
      const res = await api.put(`/blogs/${id}/like`);
      
      // Check if the user's ID is in the likes array to determine isLiked status
      const userId = user?._id;
      const isLiked = userId ? res.data.data.likes.includes(userId) : false;
      
      // Update current blog if it's the one being viewed
      if (currentBlog && currentBlog._id === id) {
        setCurrentBlog({
          ...currentBlog,
          likes: res.data.data.likes,
          isLiked: isLiked
        });
      }
      
      // Update blogs list if it contains the liked blog
      setBlogs(blogs.map(blog => {
        if (blog._id === id) {
          return {
            ...blog,
            likes: res.data.data.likes,
            isLiked: isLiked
          };
        }
        return blog;
      }));
      
      // Return the updated blog with isLiked property
      return {
        ...res.data.data,
        isLiked: isLiked
      };
    } catch (err) {
      console.error('Error liking blog:', err);
      const errorMessage = err.response?.data?.message || 'Failed to like blog';
      toast.error(errorMessage);
      return null;
    }
  };

  // Add comment to blog
  const addComment = async (blogId, content, parentId = null) => {
    try {
      const res = await api.post(`/blogs/${blogId}/comments`, {
        content,
        parentId
      });
      
      // Update current blog if it's the one being viewed
      if (currentBlog && currentBlog._id === blogId) {
        setCurrentBlog({
          ...currentBlog,
          comments: [...currentBlog.comments, res.data.data]
        });
      }
      
      toast.success('Comment added successfully');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
      return null;
    }
  };

  // Get user's blogs
  const getUserBlogs = useCallback(async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const res = await api.get('/users/blogs');
      
      // Add isLiked property to each user blog
      const userId = user?._id;
      const userBlogsWithLikeStatus = res.data.data.map(blog => ({
        ...blog,
        isLiked: userId ? blog.likes.includes(userId) : false
      }));
      
      setUserBlogs(userBlogsWithLikeStatus);
      return userBlogsWithLikeStatus;
    } catch (err) {
      console.error('Error fetching user blogs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Remove user dependency to prevent infinite loops

  // Get user's liked blogs
  const getLikedBlogs = useCallback(async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const res = await api.get('/users/liked-blogs');
      
      // These blogs are already liked by the user
      const likedBlogsWithStatus = res.data.data.map(blog => ({
        ...blog,
        isLiked: true
      }));
      
      setLikedBlogs(likedBlogsWithStatus);
      return likedBlogsWithStatus;
    } catch (err) {
      console.error('Error fetching liked blogs:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Remove user dependency to prevent infinite loops

  // Load trending blogs on initial render only
  useEffect(() => {
    let isMounted = true;
    
    const loadTrendingBlogs = async () => {
      if (isMounted) {
        await getTrendingBlogs();
      }
    };
    
    loadTrendingBlogs();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Load user blogs when user changes
  useEffect(() => {
    if (user) {
      getUserBlogs();
      getLikedBlogs();
    } else {
      setUserBlogs([]);
      setLikedBlogs([]);
    }
  }, [user]); // Only depend on user, not the functions

  // Update like status of existing blogs when user changes
  useEffect(() => {
    if (user) {
      // Update like status for blogs
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => ({
          ...blog,
          isLiked: blog.likes.includes(user._id)
        }))
      );
      
      // Update like status for trending blogs
      setTrendingBlogs(prevTrendingBlogs => 
        prevTrendingBlogs.map(blog => ({
          ...blog,
          isLiked: blog.likes.includes(user._id)
        }))
      );
    } else {
      // Clear like status when user logs out
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => ({
          ...blog,
          isLiked: false
        }))
      );
      
      setTrendingBlogs(prevTrendingBlogs => 
        prevTrendingBlogs.map(blog => ({
          ...blog,
          isLiked: false
        }))
      );
    }
  }, [user?._id]); // Only depend on user ID

  return (
    <BlogContext.Provider
      value={{
        blogs,
        trendingBlogs,
        currentBlog,
        userBlogs,
        likedBlogs,
        loading,
        error,
        pagination,
        getBlogs,
        getTrendingBlogs,
        getBlogById,
        createBlog,
        updateBlog,
        deleteBlog,
        likeBlog,
        addComment,
        getUserBlogs,
        getLikedBlogs
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};