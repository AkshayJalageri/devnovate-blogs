import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useContext(AuthContext);

  // Debug logging removed

  // Show loading spinner or placeholder while checking authentication
  if (loading) {
    console.log('AdminRoute: Loading...');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('AdminRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    console.log('AdminRoute: Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and admin
  console.log('AdminRoute: Rendering admin dashboard');
  return children;
};

export default AdminRoute;