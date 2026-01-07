import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiBookOpen, HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../../context';

export default function HomePage() {
    const { user } = useAuth();

    return (
        <div className="text-center py-20">
            {/* Hero Section */}
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-white mb-6">
                    Learn Without <span className="text-indigo-400">Limits</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                    Start, switch, or advance your career with more than 10,000 courses,
                    Professional Certificates, and degrees from world-class instructors.
                </p>
                <div className="flex gap-4 justify-center">
                    {user ? (
                        <Link to="/dashboard">
                            <Button color="purple" size="lg">
                                Go to Dashboard
                                <HiArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button color="purple" size="lg">
                                    Get Started Free
                                    <HiArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button color="gray" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <HiBookOpen className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Learn Anything</h3>
                    <p className="text-gray-400 text-sm">
                        Explore thousands of courses across technology, business, design, and more.
                    </p>
                </div>
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                    <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <HiBookOpen className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Expert Instructors</h3>
                    <p className="text-gray-400 text-sm">
                        Learn from industry experts and passionate educators who care about your success.
                    </p>
                </div>
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <HiBookOpen className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Learn at Your Pace</h3>
                    <p className="text-gray-400 text-sm">
                        Study whenever, wherever. Access courses on any device, anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
