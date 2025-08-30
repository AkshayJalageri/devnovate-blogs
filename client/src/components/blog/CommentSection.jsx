import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { BlogContext } from '../../context/BlogContext';
import { formatDate } from '../../utils/helpers';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const CommentSection = ({ blogId, comments: initialComments = [] }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { addComment } = useContext(BlogContext);
  
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
    if (error) setError('');
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await addComment(blogId, newComment);
      setComments([result, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <FiMessageSquare className="mr-2" />
        Comments ({comments.length})
      </h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="h-10 w-10 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <TextArea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                rows={3}
                error={error}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  icon={<FiSend />}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8 text-center">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-600 hover:underline">login</a> to add a comment.</p>
        </div>
      )}
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex">
              {comment.author?.profilePicture ? (
                <img 
                  src={comment.author.profilePicture} 
                  alt={comment.author.name} 
                  className="h-10 w-10 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                  {comment.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{comment.author?.name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiMessageSquare className="mx-auto h-8 w-8 mb-2" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;