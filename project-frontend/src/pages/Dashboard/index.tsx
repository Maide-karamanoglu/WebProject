import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiBookOpen,
    HiAcademicCap,
    HiPlus,
    HiArrowRight,
    HiUserGroup,
    HiTrendingUp,
    HiClock,
    HiCog,
} from 'react-icons/hi';
import { useAuth } from '../../context';
import { coursesApi } from '../../api';

interface Course {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    instructor: {
        fullName: string;
    };
    enrolledStudents?: { id: string }[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await coursesApi.getAll();
                setCourses(response.data.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const roleName = user?.role?.name;
    const isInstructorOrAdmin = roleName === 'instructor' || roleName === 'admin';

    const quickActions = [
        { label: 'Browse Courses', icon: HiBookOpen, link: '/courses', color: 'from-indigo-500 to-purple-500' },
        { label: 'My Courses', icon: HiAcademicCap, link: '/my-courses', color: 'from-emerald-500 to-teal-500' },
        { label: 'Profile', icon: HiCog, link: '/profile', color: 'from-orange-500 to-red-500' },
    ];

    if (isInstructorOrAdmin) {
        quickActions.unshift({ label: 'Create Course', icon: HiPlus, link: '/courses/create', color: 'from-pink-500 to-rose-500' });
    }

    const stats = [
        { label: 'Courses Available', value: courses.length, icon: HiBookOpen, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
        { label: 'Active Learners', value: '1.2K', icon: HiUserGroup, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { label: 'Hours of Content', value: '500+', icon: HiClock, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
        { label: 'Completion Rate', value: '94%', icon: HiTrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 lg:p-12">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 border-2 border-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 border-2 border-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
                            {roleName?.charAt(0).toUpperCase()}{roleName?.slice(1)}
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Welcome back, {user?.fullName?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-2xl mb-6">
                        {roleName === 'instructor'
                            ? 'Ready to inspire? Manage your courses and track student progress.'
                            : roleName === 'admin'
                                ? 'Your command center for managing the platform, users, and courses.'
                                : 'Continue your learning journey. Pick up where you left off.'}
                    </p>
                    <Link to="/courses">
                        <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                            <HiBookOpen className="w-5 h-5" />
                            Explore Courses
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link key={action.label} to={action.link}>
                        <div className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} hover:scale-105 transition-all duration-300 shadow-lg`}>
                            <action.icon className="w-8 h-8 text-white mb-3" />
                            <p className="text-white font-semibold">{action.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Featured Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Featured Courses</h2>
                        <p className="text-gray-400">Handpicked courses to get you started</p>
                    </div>
                    <Link to="/courses">
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition">
                            View All <HiArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                        <HiBookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No courses available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link key={course.id} to={`/courses/${course.id}`}>
                                <div className="group h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative h-40 overflow-hidden">
                                        {course.imageUrl ? (
                                            <img
                                                src={`http://localhost:3000${course.imageUrl}`}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                                <HiBookOpen className="w-12 h-12 text-white/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${course.price > 0 ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
                                                }`}>
                                                {course.price > 0 ? `$${course.price}` : 'Free'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {course.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500 text-sm">
                                                by {course.instructor?.fullName}
                                            </span>
                                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                                <HiUserGroup className="w-4 h-4" />
                                                {course.enrolledStudents?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
