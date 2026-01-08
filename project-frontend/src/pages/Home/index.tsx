import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import {
    HiBookOpen,
    HiArrowRight,
    HiAcademicCap,
    HiUserGroup,
    HiLightningBolt,
    HiShieldCheck,
    HiStar,
    HiPlay,
} from 'react-icons/hi';

export default function HomePage() {
    const { user } = useAuth();

    const features = [
        {
            icon: HiAcademicCap,
            title: 'Expert Instructors',
            description: 'Learn from industry professionals with years of real-world experience.',
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-500/10',
        },
        {
            icon: HiLightningBolt,
            title: 'Learn at Your Pace',
            description: 'Flexible scheduling that fits your busy lifestyle. Study anytime, anywhere.',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            icon: HiShieldCheck,
            title: 'Certified Courses',
            description: 'Earn recognized certificates to boost your career and professional profile.',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
        },
    ];

    const stats = [
        { value: '10K+', label: 'Students' },
        { value: '500+', label: 'Courses' },
        { value: '50+', label: 'Instructors' },
        { value: '4.9', label: 'Rating' },
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="text-center max-w-5xl mx-auto px-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm mb-8">
                        <HiStar className="w-4 h-4" />
                        <span>Trusted by over 10,000 learners worldwide</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Unlock Your{' '}
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Potential
                        </span>
                        <br />
                        Learn Without Limits
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Start, switch, or advance your career with courses from world-class
                        instructors. Join thousands of learners on their journey to success.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {user ? (
                            <Link to="/dashboard">
                                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                                    Go to Dashboard
                                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                                        Get Started Free
                                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link to="/courses">
                                    <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                                        <HiPlay className="w-5 h-5" />
                                        Browse Courses
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Why Choose OCMS?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We provide everything you need to succeed in your learning journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:-translate-y-2"
                            >
                                <div
                                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                                >
                                    <feature.icon
                                        className={`w-8 h-8 bg-gradient-to-r ${feature.color} bg-clip-text`}
                                        style={{ color: feature.color.includes('indigo') ? '#818cf8' : feature.color.includes('amber') ? '#fbbf24' : '#34d399' }}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-40 h-40 border border-white rounded-full" />
                            <div className="absolute bottom-0 right-0 w-60 h-60 border border-white rounded-full" />
                            <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-white rounded-full" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ready to Start Learning?
                            </h2>
                            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                                Join thousands of students already learning on OCMS.
                                Your journey to success starts here.
                            </p>
                            <Link to={user ? '/courses' : '/register'}>
                                <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto">
                                    <HiBookOpen className="w-5 h-5" />
                                    {user ? 'Explore Courses' : 'Create Free Account'}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
