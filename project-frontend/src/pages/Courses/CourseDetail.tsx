import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert } from 'flowbite-react';
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
            <div className="text-center text-gray-400 py-20">Loading course...</div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
                <Link to="/courses">
                    <Button color="purple">Back to Courses</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Alerts */}
            {error && (
                <Alert color="failure" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert color="success" onDismiss={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Header Card */}
            <Card className="bg-gray-800 border-gray-700">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Course Image */}
                    <div className="lg:w-1/3">
                        <div className="h-56 lg:h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                            {course.imageUrl ? (
                                <img
                                    src={`http://localhost:3000${course.imageUrl}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <HiBookOpen className="w-20 h-20 text-white/40" />
                            )}
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="lg:w-2/3 flex flex-col">
                        {/* Categories */}
                        {course.categories && course.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {course.categories.map((cat) => (
                                    <Badge key={cat.id} color="purple">
                                        {cat.name}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>

                        <p className="text-gray-400 mb-4 flex-1">
                            {course.description || 'No description provided.'}
                        </p>

                        {/* Instructor */}
                        <div className="flex items-center gap-2 text-gray-300 mb-4">
                            <HiUser className="w-5 h-5 text-indigo-400" />
                            <span>Instructor: <strong>{course.instructor?.fullName}</strong></span>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <HiCurrencyDollar className="w-6 h-6 text-green-400" />
                                <span className="text-2xl font-bold text-white">
                                    {course.price > 0 ? `$${course.price}` : 'Free'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <HiUserGroup className="w-5 h-5" />
                                <span>{course.enrolledStudents?.length || 0} enrolled</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <HiCalendar className="w-5 h-5" />
                                <span>{lessons.length} lessons</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            {user && !isOwner && (
                                <Button
                                    color={isEnrolled ? 'gray' : 'purple'}
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                >
                                    {enrolling ? (
                                        'Processing...'
                                    ) : isEnrolled ? (
                                        <>
                                            <HiX className="w-4 h-4 mr-2" />
                                            Unenroll
                                        </>
                                    ) : (
                                        <>
                                            <HiCheck className="w-4 h-4 mr-2" />
                                            Enroll Now
                                        </>
                                    )}
                                </Button>
                            )}

                            {canEdit && (
                                <>
                                    <Link to={`/courses/${course.id}/edit`}>
                                        <Button color="gray">
                                            <HiPencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button color="failure" onClick={handleDelete}>
                                        <HiTrash className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Lessons Section */}
            <Card className="bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Lesson Schedule</h2>
                    {canEdit && (
                        <Link to={`/courses/${course.id}/lessons/create`}>
                            <Button size="sm" color="purple">
                                Add Lesson
                            </Button>
                        </Link>
                    )}
                </div>

                {lessons.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                        No lessons scheduled yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition"
                                >
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{lesson.title}</h3>
                                        {lesson.content && (
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <HiLocationMarker className="w-4 h-4" />
                                                {lesson.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </Card>

            {/* Enrolled Students (for instructor/admin) */}
            {canEdit && course.enrolledStudents && course.enrolledStudents.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Enrolled Students ({course.enrolledStudents.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {course.enrolledStudents.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                            >
                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <HiUser className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-white">{student.fullName}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
