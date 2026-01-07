import { Link } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';
import { HiShieldExclamation, HiHome, HiArrowLeft } from 'react-icons/hi';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="bg-gray-800 border-gray-700 max-w-md text-center">
                <div className="p-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <HiShieldExclamation className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-400 mb-6">
                        You don't have permission to access this page. Please contact an
                        administrator if you believe this is a mistake.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/">
                            <Button color="gray">
                                <HiHome className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button color="purple">
                                <HiArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
