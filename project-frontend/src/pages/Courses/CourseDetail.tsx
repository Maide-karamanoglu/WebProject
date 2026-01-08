import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Badge, Alert } from 'flowbite-react';
import {
    HiBookOpen,
    HiUser,
    HiCurrencyDollar,
    HiUserGroup,
    HiCheck,
    HiX,
    HiPencil,
    HiTrash,
    HiCalendar,
    HiLocationMarker,
    HiArrowLeft,
    HiAcademicCap,
    HiClock,
    HiStar,
} from 'react-icons/hi';
import { coursesApi, lessonsApi } from '../../api';
import { useAuth } from '../../context';

interface Lesson {
    id: string;
    title: string;
    content?: string;
    order: number;
}

interface Course {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    instructor: {
        id: string;
        fullName: string;
        email: string;
    };
    categories?: { id: string; name: string }[];
    enrolledStudents?: { id: string; fullName: string }[];
    createdAt: string;
}

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isEnrolled = course?.enrolledStudents?.some((s) => s.id === user?.id);
    const isOwner = course?.instructor?.id === user?.id;
    const isAdmin = user?.role?.name === 'admin';
    const canEdit = isOwner || isAdmin;

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const [courseRes, lessonsRes] = await Promise.all([
                    coursesApi.getOne(id),
                    lessonsApi.getAll(id),
                ]);
                setCourse(courseRes.data);
                setLessons(lessonsRes.data);
            } catch {
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!id || !user) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        setError(null);
        try {
            if (isEnrolled) {
                await coursesApi.unenroll(id);
                setCourse((prev) =>
                    prev
                        ? {
                            ...prev,
                            enrolledStudents: prev.enrolledStudents?.filter((s) => s.id !== user.id),
                        }
                        : null
                );
                setSuccess('Successfully unenrolled from course');
            } else {
                await coursesApi.enroll(id);
                setCourse((prev) =>
                    prev
                        ? {
                            ...prev,
                            enrolledStudents: [...(prev.enrolledStudents || []), { id: user.id, fullName: user.fullName }],
                        }
                        : null
                );
                setSuccess('Successfully enrolled in course!');
            }
        } catch {
            setError(isEnrolled ? 'Failed to unenroll' : 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm('Are you sure you want to delete this course?')) return;
        try {
            await coursesApi.delete(id);
            navigate('/courses');
        } catch {
            setError('Failed to delete course');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                    <HiBookOpen className="w-12 h-12 text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
                <p className="text-gray-400 mb-6">The course you're looking for doesn't exist.</p>
                <Link to="/courses">
                    <Button color="purple">Browse Courses</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button color="gray" size="sm" onClick={() => navigate(-1)} className="mb-6">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Alerts */}
            {error && (
                <Alert color="failure" onDismiss={() => setError(null)} className="mb-6">
                    {error}
                </Alert>
            )}
            {success && (
                <Alert color="success" onDismiss={() => setSuccess(null)} className="mb-6">
                    {success}
                </Alert>
            )}

            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden mb-8">
                {/* Background Image/Gradient */}
                <div className="absolute inset-0">
                    {course.imageUrl ? (
                        <img
                            src={`http://localhost:3000${course.imageUrl}`}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-8 pt-32 lg:pt-40">
                    {/* Categories */}
                    {course.categories && course.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {course.categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {course.title}
                    </h1>

                    <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                        {course.description || 'No description provided.'}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {course.instructor?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-medium">{course.instructor?.fullName}</p>
                            <p className="text-gray-400 text-sm">Instructor</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            <HiCurrencyDollar className="w-5 h-5 text-green-400" />
                            <span className="text-xl font-bold text-white">
                                {course.price > 0 ? `$${course.price}` : 'Free'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <HiUserGroup className="w-5 h-5 text-indigo-400" />
                            <span>{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <HiBookOpen className="w-5 h-5 text-purple-400" />
                            <span>{lessons.length} lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <HiStar className="w-5 h-5 text-yellow-400" />
                            <span>4.8 rating</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {user && !isOwner && (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${isEnrolled
                                        ? 'bg-gray-600 hover:bg-gray-500'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25'
                                    }`}
                            >
                                {enrolling ? (
                                    'Processing...'
                                ) : isEnrolled ? (
                                    <span className="flex items-center gap-2">
                                        <HiX className="w-5 h-5" />
                                        Unenroll
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <HiCheck className="w-5 h-5" />
                                        Enroll Now
                                    </span>
                                )}
                            </button>
                        )}

                        {canEdit && (
                            <>
                                <Link to={`/courses/${course.id}/edit`}>
                                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition flex items-center gap-2">
                                        <HiPencil className="w-5 h-5" />
                                        Edit Course
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium border border-red-500/30 hover:bg-red-500/30 transition flex items-center gap-2"
                                >
                                    <HiTrash className="w-5 h-5" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lessons Column */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <HiAcademicCap className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Course Curriculum</h2>
                            </div>
                            {canEdit && (
                                <Link to={`/courses/${course.id}/lessons/create`}>
                                    <Button size="sm" gradientDuoTone="purpleToBlue">
                                        + Add Lesson
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {lessons.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                                    <HiBookOpen className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-400">No lessons scheduled yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lessons
                                    .sort((a, b) => a.order - b.order)
                                    .map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="group flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all border border-transparent hover:border-gray-600/50"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium group-hover:text-indigo-300 transition">
                                                    {lesson.title}
                                                </h3>
                                                {lesson.content && (
                                                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                                        <HiLocationMarker className="w-4 h-4 text-gray-500" />
                                                        {lesson.content}
                                                    </p>
                                                )}
                                            </div>
                                            {canEdit && (
                                                <Link to={`/courses/${course.id}/lessons/${lesson.id}/edit`}>
                                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition">
                                                        <HiPencil className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Info Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg">
                                    <HiClock className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Duration</p>
                                    <p className="text-white">{lessons.length} lessons</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg">
                                    <HiUserGroup className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Enrolled</p>
                                    <p className="text-white">{course.enrolledStudents?.length || 0} students</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="p-2 bg-gray-700/50 rounded-lg">
                                    <HiCalendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Created</p>
                                    <p className="text-white">
                                        {new Date(course.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Students (for instructor/admin) */}
                    {canEdit && course.enrolledStudents && course.enrolledStudents.length > 0 && (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <HiUserGroup className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">
                                    Students ({course.enrolledStudents.length})
                                </h3>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {course.enrolledStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {student.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-300 text-sm">{student.fullName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
