import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/userDarkMode';
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
    Activity,
    PackageOpen,
    Sun,
    Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { auth, totalProducts, totalFarmers, totalCooperatives } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        router.get('/logout');
    };

    const stats = [
        {
            title: 'Total Products',
            value: totalProducts,
            change: '+12%',
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Cooperatives',
            value: totalCooperatives,
            change: '+23%',
            icon: PackageOpen,
            color: 'bg-purple-500',
        },
        {
            title: 'Connected Farmers',
            value: totalFarmers,
            change: '+18%',
            icon: Users,
            color: 'bg-orange-500',
        },
    ];

    const recentActivities = [
        { id: 1, action: 'New order received', time: '5 minutes ago', type: 'order' },
        { id: 2, action: 'Product stock updated', time: '1 hour ago', type: 'product' },
        { id: 3, action: 'New farmer registered', time: '3 hours ago', type: 'user' },
        { id: 4, action: 'Payment received', time: '5 hours ago', type: 'payment' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Sprout className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AgriConnect</h1>
                        </div>

                        {/* Desktop Navigation - Using Inertia Link */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-green-600 dark:text-green-400 transition-colors font-medium"
                            >
                                <Home className="h-4 w-4" />
                                <span>Inicio</span>
                            </Link>
                            <Link
                                href="/product"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <Package className="h-4 w-4" />
                                <span>Products</span>
                            </Link>
                            <Link
                                href="/farmers"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                <span>Farmers</span>
                            </Link>
                            <Link
                                href="/analytics"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <TrendingUp className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                            <Link
                                href="/cooperatives"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                <span>Cooperatives</span>
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">

                            {/* Dark Mode Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="text-gray-600 dark:text-gray-300"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>

                            <Button variant="ghost" size="icon" className="relative hidden md:flex">
                                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full"></span>
                            </Button>

                            <Button variant="ghost" size="icon" className="relative hidden md:flex">
                                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Button>

                            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                    {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>

                            <Button onClick={handleLogout} variant="outline" size="sm" className="hidden md:flex items-center gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden dark:text-gray-200"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu - Using Inertia Link */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Inicio</span>
                                </Link>
                                <Link
                                    href="/product"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Products</span>
                                </Link>
                                <Link
                                    href="/farmers"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Farmers</span>
                                </Link>
                                <Link
                                    href="/cooperatives"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Cooperatives</span>
                                </Link>
                                <Button onClick={handleLogout} variant="outline" className="justify-start gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Welcome back, {auth.user.name?.split(' ')[0] || 'User'}! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your agricultural platform today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md dark:hover:shadow-gray-950/50 transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{stat.change}</span>
                            </div>
                            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
                            <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-800">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => router.visit('/products/create')}
                                className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                                <Package className="h-4 w-4" />
                                Verify the Products
                            </Button>
                            <Button
                                onClick={() => router.visit('/farmers')}
                                variant="outline"
                                className="w-full justify-start gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                <Users className="h-4 w-4" />
                                Manage Farmers
                            </Button>
                            <Button
                                onClick={() => router.visit('/reports')}
                                variant="outline"
                                className="w-full justify-start gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                <TrendingUp className="h-4 w-4" />
                                View Reports
                            </Button>
                            <Button
                                onClick={() => router.visit('/settings')}
                                variant="outline"
                                className="w-full justify-start gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
