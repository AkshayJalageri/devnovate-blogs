import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiHeart, FiEye, FiMessageSquare } from 'react-icons/fi';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/helpers';

const BlogCard = ({ blog, compact = false }) => {
  if (!blog) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {!compact && blog.coverImage && (
        <Link to={`/blogs/${blog._id}`} className="block relative h-48 overflow-hidden">
          <img 
            src={blog.coverImage} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/blogs/${blog._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 transition duration-200">
              {blog.title}
            </h3>
          </Link>
          
          {blog.status && (
            <Badge 
              variant={blog.status === 'published' ? 'success' : 
                      blog.status === 'pending' ? 'warning' : 
                      blog.status === 'rejected' ? 'danger' : 'default'}
              size="sm"
            >
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </Badge>
          )}
        </div>
        
        {!compact && (
          <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.slice(0, compact ? 2 : 3).map(tag => (
            <Badge 
              key={tag} 
              variant="default"
              size="sm"
            >
              {tag}
            </Badge>
          ))}
          {blog.tags?.length > (compact ? 2 : 3) && (
            <Badge variant="default" size="sm">
              +{blog.tags.length - (compact ? 2 : 3)}
            </Badge>
          )}
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
            <Link to={`/users/${blog.author?._id}`} className="hover:text-blue-600 transition duration-200">
              {blog.author?.name}
            </Link>
          </div>
          
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{formatDate(blog.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        
        {!compact && (
          <div className="flex justify-end space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FiHeart className="mr-1" />
              <span>{blog.likes?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <FiMessageSquare className="mr-1" />
              <span>{blog.comments?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <FiEye className="mr-1" />
              <span>{blog.views || 0}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{blog.readTime || 5} min read</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;