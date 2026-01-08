import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import {
    HiSearch,
    HiUsers,
    HiCheck,
    HiExclamationCircle,
    HiArrowLeft,
    HiTrash,
    HiShieldCheck,
    HiMail,
} from 'react-icons/hi';
import { usersApi, rolesApi } from '../../api';
import { useAuth } from '../../context';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: {
        id: number;
        name: string;
    };
    createdAt: string;
}

interface Role {
    id: number;
    name: string;
}

export default function AdminUsersPage() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    usersApi.getAll(),
                    rolesApi.getAll(),
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRoleChange = async (userId: string, newRoleId: number) => {
        try {
            setError(null);
            await usersApi.updateRole(userId, newRoleId);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, role: roles.find((r) => r.id === newRoleId) || user.role }
                        : user
                )
            );
            setSuccess('Role updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch {
            setError('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            setError(null);
            await usersApi.delete(userId);
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            setSuccess('User deleted successfully!');
            setDeleteConfirm(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch {
            setError('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (roleName: string) => {
        switch (roleName) {
            case 'admin':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'instructor':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
                <HiArrowLeft className="w-5 h-5" />
                Back
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                        <HiUsers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">User Management</h1>
                        <p className="text-gray-400">{users.length} total users</p>
                    </div>
                </div>
                <div className="relative w-full lg:w-80">
                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
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

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition"
                    >
                        {/* User Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{user.fullName}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                        <HiMail className="w-3 h-3" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-md border capitalize ${getRoleColor(user.role?.name)}`}>
                                {user.role?.name}
                            </span>
                        </div>

                        {/* Role Change */}
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">Change Role</label>
                            <select
                                value={user.role?.id}
                                onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                                disabled={user.id === currentUser?.id}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-700">
                            {deleteConfirm === user.id ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400 text-sm">Delete?</span>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition"
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setDeleteConfirm(user.id)}
                                    disabled={user.id === currentUser?.id}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <HiTrash className="w-4 h-4" />
                                    Delete User
                                </button>
                            )}
                            {user.id === currentUser?.id && (
                                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                                    <HiShieldCheck className="w-3 h-3" />
                                    This is your account
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50 rounded-2xl">
                    <HiUsers className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No users found</p>
                </div>
            )}
        </div>
    );
}
