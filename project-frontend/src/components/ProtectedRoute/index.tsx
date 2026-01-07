import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { Spinner } from 'flowbite-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login, save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.name;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}
