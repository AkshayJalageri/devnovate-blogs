import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import { FiClock, FiEye, FiHeart, FiMessageSquare, FiEdit, FiTrash, FiAlertCircle } from 'react-icons/fi';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, currentBlog, loading, likeBlog, addComment, deleteBlog } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const isMounted = useRef(true);
  const previousId = useRef(id);

  const isAuthenticated = !!user;

  // Create a memoized fetch function to prevent unnecessary re-renders
  const fetchBlog = useCallback(async () => {
    try {
      // Validate if id is a valid MongoDB ObjectId format
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        navigate('/not-found');
        return;
      }
      
      // Only proceed if component is still mounted and we haven't fetched this ID yet
      if (isMounted.current && (!hasFetched || previousId.current !== id)) {
        const blog = await getBlogById(id);
        if (isMounted.current) {
                  if (!blog) {
          // Don't navigate away, let the UI handle the error state
        }
          // Mark as fetched and update previous ID
          setHasFetched(true);
          previousId.current = id;
        }
      }
    } catch (error) {
      if (isMounted.current) {
        // Don't navigate away, let the UI handle the error state
      }
    }
  }, [id, getBlogById, navigate, hasFetched]);

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true;
    
    // Reset hasFetched when ID changes
    if (previousId.current !== id) {
      setHasFetched(false);
    }
    
    // Only fetch if we haven't fetched this ID yet
    if (!hasFetched || previousId.current !== id) {
      fetchBlog();
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [id, fetchBlog, hasFetched]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to like this blog');
      navigate('/login');
      return;
    }
    
    try {
      const result = await likeBlog(id);
      if (result) {
        toast.success(result.isLiked ? 'Blog liked successfully' : 'Blog unliked successfully');
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    await addComment(id, comment);
    setComment('');
    setCommentError('');
  };

  const handleDeleteBlog = async () => {
    const success = await deleteBlog(id);
    if (success) {
      navigate('/');
    }
    setShowDeleteModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Ensure comments are properly handled
  const blogComments = currentBlog?.comments || [];
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading blog content...</p>
        </div>
      </div>
    );
  }
  
  if (!currentBlog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={fetchBlog} 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition mr-4"
          >
            Retry Loading
          </button>
          <Link to="/blogs" className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
            Browse All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && currentBlog.author && user._id === currentBlog.author._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentBlog.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-4">
          <div className="flex items-center">
            {currentBlog.author?.profilePicture ? (
              <img 
                src={currentBlog.author.profilePicture} 
                alt={currentBlog.author.name} 
                className="h-10 w-10 rounded-full mr-2 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                {currentBlog.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <Link to={`/users/${currentBlog.author?._id}`} className="hover:text-blue-600">
              {currentBlog.author?.name}
            </Link>
          </div>
          
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{currentBlog.readTime} min read</span>
          </div>
          
          <div>
            {formatDate(currentBlog.createdAt)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {currentBlog.tags?.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Cover Image */}
      {currentBlog.coverImage && (
        <div className="mb-8">
          <img 
            src={currentBlog.coverImage} 
            alt={currentBlog.title} 
            className="w-full h-auto rounded-lg shadow-md object-cover max-h-96"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
            }}
          />
        </div>
      )}
      
      {/* Blog Content */}
      <div className="prose max-w-none mb-8">
        {currentBlog.content ? (
          <div className="blog-content">
            <ReactMarkdown>{currentBlog.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-500 italic">No content available</p>
        )}
      </div>
      
      {/* Blog Stats and Actions */}
      <div className="border-t border-b border-gray-200 py-4 my-8 flex justify-between items-center">
        <div className="flex space-x-6">
          <button 
            onClick={handleLike}
            className={`flex items-center ${currentBlog.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
          >
            <FiHeart className={`mr-1 ${currentBlog.isLiked ? 'fill-current' : ''}`} />
            <span>{currentBlog.likes?.length || 0} likes</span>
          </button>
          
          <div className="flex items-center text-gray-500">
            <FiEye className="mr-1" />
            <span>{currentBlog.views || 0} views</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <FiMessageSquare className="mr-1" />
            <span>{blogComments.length || 0} comments</span>
          </div>
        </div>
        
        {/* Author/Admin Actions */}
        {(isAuthor || isAdmin) && (
          <div className="flex space-x-4">
            {isAuthor && (
              <Link 
                to={`/edit-blog/${currentBlog._id}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiEdit className="mr-1" />
                <span>Edit</span>
              </Link>
            )}
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <FiTrash className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Leave a comment
              </label>
              <textarea
                id="comment"
                rows="4"
                className={`w-full px-3 py-2 border ${commentError ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              {commentError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" /> {commentError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <p className="text-gray-700">
              Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to leave a comment.
            </p>
          </div>
        )}
        
        {/* Comments List */}
        {blogComments && blogComments.length > 0 ? (
          <div className="space-y-6">
            {blogComments.map((comment, index) => (
              <div key={comment._id || `comment-${index}`} className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  {comment.user?.profilePicture ? (
                    <img 
                      src={comment.user.profilePicture} 
                      alt={comment.user.name || 'User'} 
                      className="h-8 w-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                      {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{comment.createdAt ? formatDate(comment.createdAt) : 'Unknown date'}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteBlog}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;