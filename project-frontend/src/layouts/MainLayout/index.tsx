import { Outlet } from 'react-router-dom';
import { Navbar } from '../../components';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
