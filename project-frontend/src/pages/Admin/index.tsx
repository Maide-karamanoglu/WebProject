import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiUsers,
    HiBookOpen,
    HiTag,
    HiUserGroup,
    HiAcademicCap,
    HiArrowRight,
    HiPlus,
    HiTrendingUp,
} from 'react-icons/hi';
import { usersApi, coursesApi, categoriesApi } from '../../api';

interface Stats {
    totalUsers: number;
    totalCourses: number;
    totalCategories: number;
    totalEnrollments: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCourses: 0,
        totalCategories: 0,
        totalEnrollments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, coursesRes, categoriesRes] = await Promise.all([
                    usersApi.getAll(),
                    coursesApi.getAll(),
                    categoriesApi.getAll(),
                ]);

                const totalEnrollments = coursesRes.data.reduce(
                    (sum: number, course: any) => sum + (course.enrolledStudents?.length || 0),
                    0
                );

                setStats({
                    totalUsers: usersRes.data.length,
                    totalCourses: coursesRes.data.length,
                    totalCategories: categoriesRes.data.length,
                    totalEnrollments,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: HiUsers,
            gradient: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            link: '/admin/users',
        },
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            icon: HiBookOpen,
            gradient: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            link: '/courses',
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: HiTag,
            gradient: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
            link: '/admin/categories',
        },
        {
            title: 'Enrollments',
            value: stats.totalEnrollments,
            icon: HiUserGroup,
            gradient: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-500/10',
            link: null,
        },
    ];

    const quickActions = [
        { label: 'Manage Users', icon: HiUsers, link: '/admin/users', color: 'from-blue-500 to-indigo-500' },
        { label: 'Manage Categories', icon: HiTag, link: '/admin/categories', color: 'from-emerald-500 to-teal-500' },
        { label: 'Create Course', icon: HiPlus, link: '/courses/create', color: 'from-purple-500 to-pink-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 border-2 border-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 border-2 border-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative flex items-center gap-4">
                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                        <HiAcademicCap className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-indigo-100">Manage your platform and monitor statistics</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{ color: stat.gradient.includes('blue') ? '#60a5fa' : stat.gradient.includes('purple') ? '#c084fc' : stat.gradient.includes('emerald') ? '#34d399' : '#fb923c' }} />
                            </div>
                            {stat.link && (
                                <Link to={stat.link}>
                                    <span className="text-gray-400 hover:text-white transition">
                                        <HiArrowRight className="w-5 h-5" />
                                    </span>
                                </Link>
                            )}
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.label} to={action.link}>
                            <div className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer`}>
                                <action.icon className="w-8 h-8 text-white mb-3" />
                                <p className="text-white font-semibold text-lg">{action.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Activity Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <HiTrendingUp className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Platform Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                        <p className="text-gray-400 text-sm mb-2">Avg. Enrollments per Course</p>
                        <p className="text-2xl font-bold text-white">
                            {stats.totalCourses > 0 ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) : 0}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                        <p className="text-gray-400 text-sm mb-2">Platform Growth</p>
                        <p className="text-2xl font-bold text-green-400">+12%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
