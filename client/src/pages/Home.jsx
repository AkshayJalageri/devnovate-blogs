import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { FiClock, FiEye, FiHeart, FiSearch, FiTag } from 'react-icons/fi';

const Home = () => {
  const { blogs, trendingBlogs, loading, pagination, getBlogs, error } = useContext(BlogContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Popular tags (in a real app, these might come from an API)
  const popularTags = ['JavaScript', 'React', 'Node.js', 'Python', 'Web Development', 'DevOps', 'AI'];

  useEffect(() => {
    let isMounted = true;
    
    const loadBlogs = async () => {
      if (isMounted) {
        await getBlogs(1, 6);
      }
    };
    
    loadBlogs();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    getBlogs(1, 6, searchTerm, selectedTag);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    getBlogs(1, 6, searchTerm, tag === selectedTag ? '' : tag);
  };

  const handlePageChange = (page) => {
    getBlogs(page, 6, searchTerm, selectedTag);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl p-8 mb-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Devnovate Blogs</h1>
        <p className="text-xl mb-6">Discover insights, tutorials, and stories from developers around the world.</p>
        <Link 
          to="/create-blog" 
          className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
        >
          Start Writing
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
        </form>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <FiTag className="mr-2" /> Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags && popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading blogs</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                                 <button 
                   onClick={() => getBlogs(1, 6)}
                   className="mt-2 text-red-800 underline hover:text-red-900"
                 >
                   Try again
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending Blogs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Blogs</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingBlogs && trendingBlogs.slice(0, 3).map(blog => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                {blog.coverImage && (
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <Link to={`/blogs/${blog._id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{blog.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      {blog.author?.profilePicture ? (
                        <img 
                          src={blog.author.profilePicture} 
                          alt={blog.author.name} 
                          className="h-8 w-8 rounded-full mr-2 object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                          {blog.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{blog.author?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiHeart className="mr-1" />
                      <span>{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FiEye className="mr-1" />
                      <span>{blog.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Blogs */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Blogs</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs && blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs && blogs.map(blog => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  {blog.coverImage && (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <Link to={`/blogs/${blog._id}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{blog.title}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.slice(0, 3)?.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        {blog.author?.profilePicture ? (
                          <img 
                            src={blog.author.profilePicture} 
                            alt={blog.author.name} 
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                            {blog.author?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{blog.author?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{blog.readTime} min read</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiHeart className="mr-1" />
                        <span>{blog.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <FiEye className="mr-1" />
                        <span>{blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 border border-gray-300 rounded-l-md ${pagination.page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  
                  {pagination.totalPages && [...Array(pagination.totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-4 py-2 border-t border-b border-gray-300 ${pagination.page === page + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-4 py-2 border border-gray-300 rounded-r-md ${pagination.page === pagination.totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500 mb-4">
              {error ? 'There was an error loading blogs.' : 'Be the first to create a blog post!'}
            </p>
            {!error && (
              <Link 
                to="/create-blog" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Create Your First Blog
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;