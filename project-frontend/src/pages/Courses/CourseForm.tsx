import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Label, TextInput, Textarea, Button, Alert } from 'flowbite-react';
import { HiExclamationCircle, HiPhotograph } from 'react-icons/hi';
import { coursesApi, categoriesApi } from '../../api';

interface CourseFormData {
    title: string;
    description: string;
    price: string;
}

interface Category {
    id: string;
    name: string;
}

interface CourseFormProps {
    mode: 'create' | 'edit';
}

export default function CourseForm({ mode }: CourseFormProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CourseFormData>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await categoriesApi.getAll();
                setCategories(catRes.data);

                if (mode === 'edit' && id) {
                    const courseRes = await coursesApi.getOne(id);
                    const course = courseRes.data;
                    setValue('title', course.title);
                    setValue('description', course.description || '');
                    setValue('price', course.price?.toString() || '0');
                    setSelectedCategories(course.categories?.map((c: Category) => c.id) || []);
                    if (course.imageUrl) {
                        setImagePreview(`http://localhost:3000${course.imageUrl}`);
                    }
                }
            } catch {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [id, mode, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleCategory = (catId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(catId)
                ? prev.filter((id) => id !== catId)
                : [...prev, catId]
        );
    };

    const onSubmit = async (data: CourseFormData) => {
        setLoading(true);
        setError(null);

        try {
            const courseData = {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price) || 0,
                categoryIds: selectedCategories,
            };

            let courseId: string;

            if (mode === 'edit' && id) {
                await coursesApi.update(id, courseData);
                courseId = id;
            } else {
                const res = await coursesApi.create(courseData);
                courseId = res.data.id;
            }

            // Upload image if selected
            if (imageFile) {
                await coursesApi.uploadImage(courseId, imageFile);
            }

            navigate(`/courses/${courseId}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-6">
                    {mode === 'edit' ? 'Edit Course' : 'Create New Course'}
                </h1>

                {error && (
                    <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-gray-300 mb-2 block">
                            Course Title
                        </Label>
                        <TextInput
                            id="title"
                            placeholder="e.g., Introduction to Programming"
                            color={errors.title ? 'failure' : 'gray'}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="text-gray-300 mb-2 block">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your course..."
                            rows={4}
                            {...register('description')}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price" className="text-gray-300 mb-2 block">
                            Price ($)
                        </Label>
                        <TextInput
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...register('price')}
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <Label className="text-gray-300 mb-2 block">Categories</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition ${selectedCategories.includes(cat.id)
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-gray-500 text-sm">No categories available</p>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <Label htmlFor="image" className="text-gray-300 mb-2 block">
                            Course Image
                        </Label>
                        {imagePreview && (
                            <div className="mb-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                                <HiPhotograph className="w-5 h-5" />
                                <span>Choose Image</span>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imageFile && (
                                <span className="text-gray-400 text-sm">{imageFile.name}</span>
                            )}
                        </div>
                        <p className="text-gray-500 text-xs mt-2">JPG, PNG, GIF, WEBP (max 5MB)</p>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <Button type="submit" color="purple" disabled={loading} className="flex-1">
                            {loading ? 'Saving...' : mode === 'edit' ? 'Update Course' : 'Create Course'}
                        </Button>
                        <Button type="button" color="gray" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
