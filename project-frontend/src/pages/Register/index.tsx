import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed, HiUser, HiExclamationCircle } from 'react-icons/hi';
import { useAuth } from '../../context';

interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null);
            await registerUser({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
            });
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Registration failed');
        }
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-gray-400">Join OCMS and start learning today</p>
            </div>

            {error && (
                <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name</Label>
                    <TextInput
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        icon={HiUser}
                        color={errors.fullName ? 'failure' : 'gray'}
                        {...register('fullName', {
                            required: 'Full name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters',
                            },
                        })}
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

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

                <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
                    <TextInput
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={HiLockClosed}
                        color={errors.confirmPassword ? 'failure' : 'gray'}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) =>
                                value === password || 'Passwords do not match',
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    color="purple"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="mt-4 text-center text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:underline">
                    Sign in
                </Link>
            </div>
        </Card>
    );
}
