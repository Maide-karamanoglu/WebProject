import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context';
import {
    HiMenu,
    HiX,
    HiBookOpen,
    HiHome,
    HiAcademicCap,
    HiCog,
    HiLogout,
    HiChartBar,
} from 'react-icons/hi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: HiHome },
        { path: '/courses', label: 'Courses', icon: HiBookOpen },
    ];

    if (user) {
        navLinks.push({ path: '/my-courses', label: 'My Courses', icon: HiAcademicCap });
    }

    if (user?.role?.name === 'admin') {
        navLinks.push({ path: '/admin', label: 'Admin', icon: HiChartBar });
    }

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <HiAcademicCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            OCMS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-indigo-500/10 text-indigo-400'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-3 p-1 pr-3 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {user.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block text-sm text-gray-300">
                                        {user.fullName?.split(' ')[0]}
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden z-20">
                                            <div className="p-4 border-b border-gray-700">
                                                <p className="text-white font-medium">{user.fullName}</p>
                                                <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-md capitalize">
                                                    {user.role?.name}
                                                </span>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <HiChartBar className="w-5 h-5" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <HiCog className="w-5 h-5" />
                                                    Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                                                >
                                                    <HiLogout className="w-5 h-5" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <button className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm transition">
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                        >
                            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-800">
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive(link.path)
                                            ? 'bg-indigo-500/10 text-indigo-400'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
