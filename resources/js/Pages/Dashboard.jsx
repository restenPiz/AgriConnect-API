import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Dashboard({ auth }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold">AgriConnect</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {auth.user?.name || auth.user?.email}
                            </span>
                            <Button onClick={handleLogout} variant="outline">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your dashboard!</p>
                </div>
            </main>
        </div>
    );
}
