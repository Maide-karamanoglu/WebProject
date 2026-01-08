import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, TextInput, Button, Alert, Label } from 'flowbite-react';
import { HiTag, HiPlus, HiPencil, HiTrash, HiCheck, HiExclamationCircle, HiArrowLeft } from 'react-icons/hi';
import { categoriesApi } from '../../api';

interface Category {
    id: string;
    name: string;
}

interface CategoryFormData {
    name: string;
}

export default function AdminCategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoriesApi.getAll();
            setCategories(res.data);
        } catch {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        reset({ name: '' });
        setModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setValue('name', category.name);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        reset();
    };

    const onSubmit = async (data: CategoryFormData) => {
        try {
            setError(null);
            if (editingCategory) {
                await categoriesApi.update(editingCategory.id, { name: data.name });
                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.id === editingCategory.id ? { ...cat, name: data.name } : cat
                    )
                );
                setSuccess('Category updated successfully!');
            } else {
                const res = await categoriesApi.create({ name: data.name });
                setCategories((prev) => [...prev, res.data]);
                setSuccess('Category created successfully!');
            }
            closeModal();
            setTimeout(() => setSuccess(null), 3000);
        } catch {
            setError('Failed to save category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesApi.delete(id);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            setSuccess('Category deleted successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch {
            setError('Failed to delete category. It may be in use.');
        }
    };

    if (loading) {
        return <div className="text-center text-gray-400 py-20">Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button color="gray" size="sm" onClick={() => navigate(-1)}>
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                        <HiTag className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Category Management</h1>
                        <p className="text-gray-400">{categories.length} categories</p>
                    </div>
                </div>
                <Button color="purple" onClick={openCreateModal}>
                    <HiPlus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
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

            {/* Categories Table */}
            <Card className="bg-gray-800 border-gray-700">
                {categories.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <HiTag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No categories yet</p>
                        <Button color="purple" size="sm" className="mt-4" onClick={openCreateModal}>
                            Create First Category
                        </Button>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Category Name</th>
                                <th className="px-6 py-3 w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                size="xs"
                                                color="gray"
                                                onClick={() => openEditModal(category)}
                                            >
                                                <HiPencil className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="xs"
                                                color="failure"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <HiTrash className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-xl font-semibold text-white">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-gray-300 mb-2 block">
                                        Category Name
                                    </Label>
                                    <TextInput
                                        id="name"
                                        placeholder="e.g., Programming"
                                        color={errors.name ? 'failure' : 'gray'}
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" color="purple" className="flex-1">
                                        {editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                    <Button type="button" color="gray" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
