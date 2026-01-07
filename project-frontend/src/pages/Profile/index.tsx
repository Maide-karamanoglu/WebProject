import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Label, TextInput, Button, Alert, Badge } from 'flowbite-react';
import { HiUser, HiMail, HiLockClosed, HiCheck, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';
import { useAuth } from '../../context';
import { usersApi } from '../../api';

interface ProfileFormData {
    fullName: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'info' | 'password'>('info');

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        defaultValues: {
            fullName: user?.fullName || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>();

    const newPassword = watch('newPassword');

    const onProfileSubmit = async (data: ProfileFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await usersApi.updateProfile({ fullName: data.fullName });
            // Update local storage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.fullName = data.fullName;
                localStorage.setItem('user', JSON.stringify(userData));
            }
            setSuccess('Profile updated successfully!');
            // Reload to reflect changes
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await usersApi.updateProfile({ password: data.newPassword });
            setSuccess('Password changed successfully!');
            resetPassword();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">{user?.fullName}</h1>
                <p className="text-gray-400">{user?.email}</p>
                <Badge color="purple" size="lg" className="mt-2 capitalize">
                    <HiShieldCheck className="w-4 h-4 mr-1" />
                    {user?.role?.name}
                </Badge>
            </div>

            {/* Alerts */}
            {success && (
                <Alert color="success" icon={HiCheck} onDismiss={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert color="failure" icon={HiExclamationCircle} onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-gray-700 pb-2">
                <button
                    onClick={() => setActiveSection('info')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition ${activeSection === 'info'
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <HiUser className="w-4 h-4 inline mr-2" />
                    Profile Info
                </button>
                <button
                    onClick={() => setActiveSection('password')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition ${activeSection === 'password'
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <HiLockClosed className="w-4 h-4 inline mr-2" />
                    Change Password
                </button>
            </div>

            {/* Profile Info Section */}
            {activeSection === 'info' && (
                <Card className="bg-gray-800 border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-300 mb-2 block">
                                Email
                            </Label>
                            <TextInput
                                id="email"
                                type="email"
                                value={user?.email}
                                disabled
                                icon={HiMail}
                            />
                            <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <Label htmlFor="fullName" className="text-gray-300 mb-2 block">
                                Full Name
                            </Label>
                            <TextInput
                                id="fullName"
                                type="text"
                                icon={HiUser}
                                color={profileErrors.fullName ? 'failure' : 'gray'}
                                {...registerProfile('fullName', {
                                    required: 'Full name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                            {profileErrors.fullName && (
                                <p className="mt-1 text-sm text-red-500">
                                    {profileErrors.fullName.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" color="purple" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Password Section */}
            {activeSection === 'password' && (
                <Card className="bg-gray-800 border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">
                                New Password
                            </Label>
                            <TextInput
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                icon={HiLockClosed}
                                color={passwordErrors.newPassword ? 'failure' : 'gray'}
                                {...registerPassword('newPassword', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {passwordErrors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordErrors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">
                                Confirm New Password
                            </Label>
                            <TextInput
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                icon={HiLockClosed}
                                color={passwordErrors.confirmPassword ? 'failure' : 'gray'}
                                {...registerPassword('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === newPassword || 'Passwords do not match',
                                })}
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordErrors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" color="purple" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Account Info */}
            <Card className="bg-gray-800 border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">User ID</span>
                        <span className="text-white font-mono text-sm">{user?.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-gray-400">Role</span>
                        <span className="text-indigo-400 capitalize">{user?.role?.name}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-400">Email Verified</span>
                        <Badge color="success" size="sm">Verified</Badge>
                    </div>
                </div>
            </Card>
        </div>
    );
}
