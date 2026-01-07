import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Avatar } from 'flowbite-react';
import { useAuth } from '../../context';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-gray-700 border-b">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center">
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                        OCMS
                    </span>
                </Link>

                <div className="flex md:order-2 gap-2">
                    {user ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="User settings"
                                    img={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=fff`}
                                    rounded
                                />
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm font-medium">{user.fullName}</span>
                                <span className="block truncate text-sm text-gray-500">
                                    {user.email}
                                </span>
                                <span className="block text-xs text-indigo-500 capitalize">
                                    {user.role?.name}
                                </span>
                            </DropdownHeader>
                            <Link to="/dashboard">
                                <DropdownItem>Dashboard</DropdownItem>
                            </Link>
                            <Link to="/profile">
                                <DropdownItem>Profile</DropdownItem>
                            </Link>
                            <DropdownDivider />
                            <DropdownItem onClick={handleLogout}>
                                Sign out
                            </DropdownItem>
                        </Dropdown>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button color="gray" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button color="purple" size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        {isOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
                    </button>
                </div>

                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                        <li>
                            <Link to="/" className="block py-2 px-3 text-white hover:text-indigo-400 rounded md:p-0">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/courses" className="block py-2 px-3 text-white hover:text-indigo-400 rounded md:p-0">
                                Courses
                            </Link>
                        </li>
                        {user && (
                            <li>
                                <Link to="/my-courses" className="block py-2 px-3 text-white hover:text-indigo-400 rounded md:p-0">
                                    My Courses
                                </Link>
                            </li>
                        )}
                        {user?.role?.name === 'admin' && (
                            <li>
                                <Link to="/admin" className="block py-2 px-3 text-white hover:text-indigo-400 rounded md:p-0">
                                    Admin
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
