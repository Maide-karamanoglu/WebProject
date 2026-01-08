import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiBookOpen, HiCurrencyDollar, HiUserGroup, HiStar, HiArrowRight } from 'react-icons/hi';
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
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Explore Our <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Discover a world of knowledge with our expertly crafted courses
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === ''
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <span className="text-gray-400 text-sm">
                        Showing <span className="text-white font-medium">{filteredCourses.length}</span> of{' '}
                        <span className="text-white font-medium">{courses.length}</span> courses
                    </span>
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <HiBookOpen className="w-12 h-12 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="group"
                        >
                            <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10">
                                {/* Course Image */}
                                <div className="relative h-48 overflow-hidden">
                                    {course.imageUrl ? (
                                        <img
                                            src={`http://localhost:3000${course.imageUrl}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                            <HiBookOpen className="w-16 h-16 text-white/30" />
                                        </div>
                                    )}
                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${course.price > 0
                                                ? 'bg-green-500/90 text-white'
                                                : 'bg-indigo-500/90 text-white'
                                            }`}>
                                            {course.price > 0 ? `$${course.price}` : 'Free'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Categories */}
                                    {course.categories && course.categories.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {course.categories.slice(0, 2).map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-md"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {course.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {course.description || 'No description available'}
                                    </p>

                                    {/* Instructor */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {course.instructor?.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-300 text-sm">
                                            {course.instructor?.fullName}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                <HiUserGroup className="w-4 h-4" />
                                                {course.enrolledStudents?.length || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                                <HiStar className="w-4 h-4" />
                                                4.8
                                            </span>
                                        </div>
                                        <span className="text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View <HiArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
