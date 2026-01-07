import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiExclamationCircle } from 'react-icons/hi';
import { useAuth } from '../../context';

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Login failed');
        }
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to continue to OCMS</p>
            </div>

            {error && (
                <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="email" className="text-gray-300 mb-2 block">Email</Label>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        icon={HiMail}
                        color={errors.email ? 'failure' : 'gray'}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        icon={HiLockClosed}
                        color={errors.password ? 'failure' : 'gray'}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    color="purple"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-4 text-center text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-400 hover:underline">
                    Sign up
                </Link>
            </div>
        </Card>
    );
}
