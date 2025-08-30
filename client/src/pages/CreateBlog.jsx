import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { FiAlertCircle } from 'react-icons/fi';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const { createBlog, loading } = useContext(BlogContext);
  const navigate = useNavigate();

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
        coverImage: imageUrl
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const { title, content, excerpt } = formData;
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (excerpt.length > 200) {
      errors.excerpt = 'Excerpt should be less than 200 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process tags into an array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const blogData = {
        ...formData,
        tags: tagsArray
      };
      
      const newBlog = await createBlog(blogData);
      if (newBlog) {
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${!previewMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setPreviewMode(false)}
        >
          Write
        </button>
        <button
          className={`py-2 px-4 font-medium ${previewMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setPreviewMode(true)}
        >
          Preview
        </button>
      </div>
      
      {!previewMode ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter a catchy title"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {formErrors.title}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt * (Brief summary of your blog)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="2"
              value={formData.excerpt}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.excerpt ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Write a brief summary (max 200 characters)"
              maxLength="200"
            ></textarea>
            {formErrors.excerpt && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {formErrors.excerpt}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.excerpt.length}/200 characters
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              id="content"
              name="content"
              rows="15"
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono`}
              placeholder="Write your blog content here (Markdown is supported)"
            ></textarea>
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {formErrors.content}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.coverImage && (
              <div className="mt-2">
                <img 
                  src={formData.coverImage} 
                  alt="Cover preview" 
                  className="h-40 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional, comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. JavaScript, React, Web Development"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {formData.coverImage && (
            <img 
              src={formData.coverImage} 
              alt="Cover preview" 
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{formData.title || 'Your Blog Title'}</h1>
            <p className="text-gray-600 mb-6">{formData.excerpt || 'Your blog excerpt will appear here...'}</p>
            
            {formData.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
            
            <div className="prose max-w-none">
              {formData.content ? (
                <div className="whitespace-pre-wrap">{formData.content}</div>
              ) : (
                <p className="text-gray-400">Your blog content will appear here...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;