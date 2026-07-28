import { Navigate, useLocation } from 'react-router-dom';

/**
 * PrivateRoute — wraps dashboard routes and redirects unauthenticated
 * users to /login. The `from` state allows post-login redirect back.
 */
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
