import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { authApi } from '../api';

// Types
interface Role {
    id: number;
    name: string;
    description?: string;
}

interface User {
    id: string;
    email: string;
    fullName: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('access_token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Optionally validate token by fetching profile
                try {
                    const response = await authApi.getProfile();
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch {
                    // Token invalid, clear storage
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.login(email, password);
            const { access_token, user: userData } = response.data;

            // Save to state
            setToken(access_token);
            setUser(userData);

            // Save to localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const message =
                error.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.register(data);
            const { access_token, user: userData } = response.data;

            // Save to state
            setToken(access_token);
            setUser(userData);

            // Save to localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const message =
                error.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                register,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
