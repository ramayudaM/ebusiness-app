import useAuthStore from '@/features/auth/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook to protect specific actions.
 * If the user is authenticated, the action is executed.
 * If the user is a guest, they are redirected to the login page.
 */
export const useRequireAuth = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const withAuth = useCallback((action) => {
        return (...args) => {
            if (isAuthenticated) {
                return action(...args);
            } else {
                // Redirect to login and save the current path to return after login
                navigate('/login', { state: { from: location.pathname } });
            }
        };
    }, [isAuthenticated, navigate, location]);

    return { withAuth };
};
