import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Label, TextInput, Textarea, Button, Alert } from 'flowbite-react';
import { HiExclamationCircle, HiBookOpen } from 'react-icons/hi';
import { lessonsApi, coursesApi } from '../../api';

interface LessonFormData {
    title: string;
    content: string;
    order: string;
}

interface LessonFormProps {
    mode: 'create' | 'edit';
}

export default function LessonForm({ mode }: LessonFormProps) {
    const navigate = useNavigate();
    const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courseTitle, setCourseTitle] = useState<string>('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LessonFormData>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get course title
                if (courseId) {
                    const courseRes = await coursesApi.getOne(courseId);
                    setCourseTitle(courseRes.data.title);
                }

                // Get lesson data if editing
                if (mode === 'edit' && lessonId) {
                    const lessonRes = await lessonsApi.getOne(lessonId);
                    const lesson = lessonRes.data;
                    setValue('title', lesson.title);
                    setValue('content', lesson.content || '');
                    setValue('order', lesson.order?.toString() || '1');
                }
            } catch {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [courseId, lessonId, mode, setValue]);

    const onSubmit = async (data: LessonFormData) => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const lessonData = {
                title: data.title,
                content: data.content,
                order: parseInt(data.order) || 1,
                courseId,
            };

            if (mode === 'edit' && lessonId) {
                await lessonsApi.update(lessonId, lessonData);
            } else {
                await lessonsApi.create(lessonData);
            }

            navigate(`/courses/${courseId}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to save lesson');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!lessonId || !confirm('Are you sure you want to delete this lesson?')) return;

        try {
            await lessonsApi.delete(lessonId);
            navigate(`/courses/${courseId}`);
        } catch {
            setError('Failed to delete lesson');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <HiBookOpen className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {mode === 'edit' ? 'Edit Lesson' : 'Add New Lesson'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Course: <span className="text-indigo-400">{courseTitle}</span>
                        </p>
                    </div>
                </div>

                {error && (
                    <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-gray-300 mb-2 block">
                            Lesson Title *
                        </Label>
                        <TextInput
                            id="title"
                            placeholder="e.g., Introduction to Variables"
                            color={errors.title ? 'failure' : 'gray'}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Content (Location/Time for physical courses) */}
                    <div>
                        <Label htmlFor="content" className="text-gray-300 mb-2 block">
                            Location / Schedule
                        </Label>
                        <Textarea
                            id="content"
                            placeholder="e.g., Room 101, Building A - Monday 10:00-12:00"
                            rows={3}
                            {...register('content')}
                        />
                        <p className="text-gray-500 text-xs mt-1">
                            Enter the location and schedule information for this lesson
                        </p>
                    </div>

                    {/* Order */}
                    <div>
                        <Label htmlFor="order" className="text-gray-300 mb-2 block">
                            Order
                        </Label>
                        <TextInput
                            id="order"
                            type="number"
                            min="1"
                            placeholder="1"
                            {...register('order')}
                        />
                        <p className="text-gray-500 text-xs mt-1">
                            Lesson display order (1 = first)
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                        <Button type="submit" color="purple" disabled={loading} className="flex-1">
                            {loading ? 'Saving...' : mode === 'edit' ? 'Update Lesson' : 'Add Lesson'}
                        </Button>
                        {mode === 'edit' && (
                            <Button type="button" color="failure" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <Button
                            type="button"
                            color="gray"
                            onClick={() => navigate(`/courses/${courseId}`)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
