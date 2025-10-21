import { Link, router, usePage } from '@inertiajs/react';
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

export default function Dashboard() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.get('/logout');
    };

    const stats = [
        {
            title: 'Total Products',
            value: '248',
            change: '+12%',
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Orders',
            value: '32',
            change: '+5%',
            icon: ShoppingCart,
            color: 'bg-green-500',
        },
        {
            title: 'Revenue',
            value: '$12,450',
            change: '+23%',
            icon: DollarSign,
            color: 'bg-purple-500',
        },
        {
            title: 'Connected Farmers',
            value: '156',
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

                        {/* Desktop Navigation - Using Inertia Link */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-green-600 transition-colors font-medium"
                            >
                                <Home className="h-4 w-4" />
                                <span>Inicio</span>
                            </Link>
                            <Link
                                href="/product"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Package className="h-4 w-4" />
                                <span>Products</span>
                            </Link>
                            <Link
                                href="/farmers"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                <span>Farmers</span>
                            </Link>
                            <Link
                                href="/analytics"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <TrendingUp className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="relative hidden md:flex">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Button>

                            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                    {auth.user.name?.charAt(0).toUpperCase() || 'U'}
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

                    {/* Mobile Menu - Using Inertia Link */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Inicio</span>
                                </Link>
                                <Link
                                    href="/product"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Products</span>
                                </Link>
                                <Link
                                    href="/farmers"
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Farmers</span>
                                </Link>
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {auth.user.name?.split(' ')[0] || 'User'}! 👋
                    </h2>
                    <p className="text-gray-600">Here's what's happening with your agricultural platform today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => router.visit('/products/create')}
                                className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <Package className="h-4 w-4" />
                                Add New Product
                            </Button>
                            <Button
                                onClick={() => router.visit('/farmers')}
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <Users className="h-4 w-4" />
                                Manage Farmers
                            </Button>
                            <Button
                                onClick={() => router.visit('/reports')}
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <TrendingUp className="h-4 w-4" />
                                View Reports
                            </Button>
                            <Button
                                onClick={() => router.visit('/settings')}
                                variant="outline"
                                className="w-full justify-start gap-2"
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
