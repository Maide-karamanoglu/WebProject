import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from 'flowbite-react';
import { HiBookOpen, HiUsers, HiAcademicCap, HiPlus } from 'react-icons/hi';
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
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await coursesApi.getAll();
                setCourses(response.data.slice(0, 6)); // Show first 6 courses
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const roleName = user?.role?.name;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.fullName}! 👋
                </h1>
                <p className="text-indigo-100 mb-4">
                    {roleName === 'instructor'
                        ? 'Manage your courses and see how your students are progressing.'
                        : roleName === 'admin'
                            ? 'Manage the platform, users, and courses.'
                            : 'Continue your learning journey today.'}
                </p>
                <Badge color="purple" size="lg" className="capitalize">
                    {roleName}
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <HiBookOpen className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Courses</p>
                            <p className="text-2xl font-bold text-white">{courses.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <HiAcademicCap className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Enrolled</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <HiUsers className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Completed</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Courses Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {roleName === 'instructor' ? 'Your Courses' : 'Available Courses'}
                    </h2>
                    {(roleName === 'instructor' || roleName === 'admin') && (
                        <Link to="/courses/create">
                            <Button color="purple" size="sm">
                                <HiPlus className="w-4 h-4 mr-2" />
                                Create Course
                            </Button>
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading courses...</div>
                ) : courses.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700 text-center py-12">
                        <p className="text-gray-400">No courses available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition-colors"
                            >
                                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                                    {course.imageUrl ? (
                                        <img
                                            src={`http://localhost:3000${course.imageUrl}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <HiBookOpen className="w-16 h-16 text-white/50" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {course.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                    {course.description || 'No description available'}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-indigo-400 font-bold">
                                        ${course.price?.toFixed(2) || 'Free'}
                                    </span>
                                    <Link to={`/courses/${course.id}`}>
                                        <Button size="xs" color="gray">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
