import { Button } from '@/components/ui/button';
import {
    Home,
    Users,
    Package,
    TrendingUp,
    Bell,
    Settings,
    LogOut,
    Menu,
    Sprout,
    ShoppingCart,
    DollarSign,
    Activity
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ auth }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        window.location.href = '/logout';
    };

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Sprout className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">AgriConnect</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => handleNavigation('/dashboard')}
                                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                <span className="font-medium">Inicio</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/product')}
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Package className="h-4 w-4" />
                                <span>Products</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/farmers')}
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                <span>Farmers</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/analytics')}
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <TrendingUp className="h-4 w-4" />
                                <span>Analytics</span>
                            </button>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="relative hidden md:flex">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Button>

                            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{auth?.user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">{auth?.user?.email || 'user@example.com'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                    {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>

                            <Button onClick={handleLogout} variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleNavigation('/dashboard')}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Inicio</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/products')}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Products</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/farmers')}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Farmers</span>
                                </button>
                                <Button onClick={handleLogout} variant="outline" className="justify-start gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">


            </main>
        </div>
    );
}
