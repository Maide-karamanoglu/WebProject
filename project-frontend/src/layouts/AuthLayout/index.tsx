import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex flex-col">
            {/* Header */}
            <header className="p-6">
                <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition">
                    OCMS
                </Link>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-gray-500 text-sm">
                © 2026 Online Course Management System. All rights reserved.
            </footer>
        </div>
    );
}
