import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, TextInput, Select, Badge, Button } from 'flowbite-react';
import { HiSearch, HiBookOpen, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
import { coursesApi, categoriesApi } from '../../api';

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
    categories?: { id: string; name: string }[];
    enrolledStudents?: { id: string }[];
}

interface Category {
    id: string;
    name: string;
}

export default function CoursesListPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, categoriesRes] = await Promise.all([
                    coursesApi.getAll(),
                    categoriesApi.getAll(),
                ]);
                setCourses(coursesRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter courses
    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            !selectedCategory ||
            course.categories?.some((cat) => cat.id === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Courses</h1>
                    <p className="text-gray-400">Browse and enroll in available courses</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TextInput
                        icon={HiSearch}
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Results count */}
            <p className="text-gray-400 text-sm">
                Showing {filteredCourses.length} of {courses.length} courses
            </p>

            {/* Course Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700 text-center py-12">
                    <HiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No courses found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                        >
                            {/* Course Image */}
                            <div className="h-44 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {course.imageUrl ? (
                                    <img
                                        src={`http://localhost:3000${course.imageUrl}`}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <HiBookOpen className="w-16 h-16 text-white/40" />
                                )}
                            </div>

                            {/* Categories */}
                            {course.categories && course.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {course.categories.slice(0, 2).map((cat) => (
                                        <Badge key={cat.id} color="purple" size="sm">
                                            {cat.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Title & Description */}
                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                                {course.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {course.description || 'No description available'}
                            </p>

                            {/* Instructor */}
                            <p className="text-gray-500 text-sm mb-4">
                                by <span className="text-indigo-400">{course.instructor?.fullName}</span>
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center text-green-400 font-bold">
                                        <HiCurrencyDollar className="w-5 h-5 mr-1" />
                                        {course.price > 0 ? `$${course.price}` : 'Free'}
                                    </span>
                                    <span className="flex items-center text-gray-400 text-sm">
                                        <HiUserGroup className="w-4 h-4 mr-1" />
                                        {course.enrolledStudents?.length || 0}
                                    </span>
                                </div>
                                <Link to={`/courses/${course.id}`}>
                                    <Button size="xs" color="purple">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
