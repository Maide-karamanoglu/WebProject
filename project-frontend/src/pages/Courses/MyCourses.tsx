import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'flowbite-react';
import { HiBookOpen, HiPlus, HiPencil, HiUserGroup } from 'react-icons/hi';
import { coursesApi } from '../../api';
import { useAuth } from '../../context';

interface Course {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    instructor: {
        id: string;
        fullName: string;
    };
    enrolledStudents?: { id: string }[];
}

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'created' | 'enrolled'>('enrolled');

    const isInstructor = user?.role?.name === 'instructor' || user?.role?.name === 'admin';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await coursesApi.getAll();
                setCourses(res.data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Filter courses based on user role
    const enrolledCourses = courses.filter((course) =>
        course.enrolledStudents?.some((s) => s.id === user?.id)
    );
    const createdCourses = courses.filter(
        (course) => course.instructor?.id === user?.id
    );

    const CourseCard = ({ course, showEdit = false }: { course: Course; showEdit?: boolean }) => (
        <Card className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition">
            <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {course.imageUrl ? (
                    <img
                        src={`http://localhost:3000${course.imageUrl}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <HiBookOpen className="w-12 h-12 text-white/40" />
                )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                {course.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {course.description || 'No description'}
            </p>
            <div className="flex items-center justify-between">
                {showEdit && (
                    <Badge color="purple" size="sm">
                        <HiUserGroup className="w-3 h-3 mr-1" />
                        {course.enrolledStudents?.length || 0} students
                    </Badge>
                )}
                <div className="flex gap-2 ml-auto">
                    {showEdit && (
                        <Link to={`/courses/${course.id}/edit`}>
                            <Button size="xs" color="gray">
                                <HiPencil className="w-3 h-3" />
                            </Button>
                        </Link>
                    )}
                    <Link to={`/courses/${course.id}`}>
                        <Button size="xs" color="purple">
                            View
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return (
            <div className="text-center text-gray-400 py-20">Loading...</div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Courses</h1>
                {isInstructor && (
                    <Link to="/courses/create">
                        <Button color="purple">
                            <HiPlus className="w-4 h-4 mr-2" />
                            Create Course
                        </Button>
                    </Link>
                )}
            </div>

            {/* Custom Tabs */}
            {isInstructor && (
                <div className="flex gap-2 border-b border-gray-700 pb-2">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'created'
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <HiBookOpen className="w-4 h-4 inline mr-2" />
                        My Created Courses ({createdCourses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('enrolled')}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'enrolled'
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <HiUserGroup className="w-4 h-4 inline mr-2" />
                        Enrolled Courses ({enrolledCourses.length})
                    </button>
                </div>
            )}

            {/* Content */}
            {isInstructor && activeTab === 'created' && (
                createdCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <HiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">You haven't created any courses yet</p>
                        <Link to="/courses/create">
                            <Button color="purple">Create Your First Course</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {createdCourses.map((course) => (
                            <CourseCard key={course.id} course={course} showEdit />
                        ))}
                    </div>
                )
            )}

            {((!isInstructor) || activeTab === 'enrolled') && (
                enrolledCourses.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700 text-center py-12">
                        <HiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
                        <Link to="/courses">
                            <Button color="purple">Browse Courses</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrolledCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
