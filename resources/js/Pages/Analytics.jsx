import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Home,
    Users,
    Package,
    TrendingUp,
    Bell,
    LogOut,
    Menu,
    Sprout,
    Settings,
    DollarSign,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Badge } from "@/components/ui/badge"

export default function Analytics() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');

    const handleLogout = () => {
        router.get('/logout');
    };

    // Sample data for charts - replace with your actual data
    const salesData = [
        { month: 'Jan', sales: 4000, revenue: 2400, orders: 120 },
        { month: 'Feb', sales: 3000, revenue: 1398, orders: 98 },
        { month: 'Mar', sales: 5000, revenue: 3800, orders: 150 },
        { month: 'Apr', sales: 4500, revenue: 3908, orders: 140 },
        { month: 'May', sales: 6000, revenue: 4800, orders: 180 },
        { month: 'Jun', sales: 5500, revenue: 3800, orders: 165 },
        { month: 'Jul', sales: 7000, revenue: 5300, orders: 210 }
    ];

    const productCategoryData = [
        { name: 'Vegetables', value: 400, color: '#10b981' },
        { name: 'Fruits', value: 300, color: '#f59e0b' },
        { name: 'Grains', value: 200, color: '#3b82f6' },
        { name: 'Tubers', value: 150, color: '#8b5cf6' },
        { name: 'Others', value: 100, color: '#6b7280' }
    ];

    const topProducts = [
        { name: 'Organic Tomatoes', sales: 245, revenue: 11025, trend: 'up', change: 12 },
        { name: 'Fresh Corn', sales: 189, revenue: 5670, trend: 'up', change: 8 },
        { name: 'Sweet Potatoes', sales: 156, revenue: 5460, trend: 'down', change: -3 },
        { name: 'Green Lettuce', sales: 142, revenue: 3550, trend: 'up', change: 15 },
        { name: 'Fresh Carrots', sales: 128, revenue: 3584, trend: 'up', change: 5 }
    ];

    const farmerPerformance = [
        { name: 'João Silva', products: 15, sales: 3200, rating: 4.8 },
        { name: 'Maria Santos', products: 23, sales: 5100, rating: 4.9 },
        { name: 'Ana Costa', products: 31, sales: 6800, rating: 5.0 },
        { name: 'Pedro Mendes', products: 8, sales: 1200, rating: 4.5 },
        { name: 'Carlos Rodrigues', products: 12, sales: 2400, rating: 4.6 }
    ];

    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231',
            change: '+20.1%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Total Orders',
            value: '1,063',
            change: '+15.3%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Total Products',
            value: '248',
            change: '+12.5%',
            trend: 'up',
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Active Farmers',
            value: '156',
            change: '-2.4%',
            trend: 'down',
            icon: Users,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Sprout className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">AgriConnect</h1>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
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
                                className="flex items-center gap-2 text-green-600 transition-colors font-medium"
                            >
                                <TrendingUp className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">

                            <Button variant="ghost" size="icon" className="relative hidden md:flex">
                                <Settings className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full"></span>
                            </Button>

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

                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-3">
                                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Home className="h-4 w-4" />
                                    <span>Inicio</span>
                                </Link>
                                <Link href="/product" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Package className="h-4 w-4" />
                                    <span>Products</span>
                                </Link>
                                <Link href="/farmers" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Users className="h-4 w-4" />
                                    <span>Farmers</span>
                                </Link>
                                <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Analytics</span>
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                        <p className="text-gray-600">Track your business performance and insights</p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Last 7 days
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4" />
                                    )}
                                    <span className="text-sm font-medium">{stat.change}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sales Trend Chart */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Product Categories Pie Chart */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={productCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {productCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-green-600">#{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sales} sales</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${product.revenue}</p>
                                        <div className={`flex items-center gap-1 justify-end ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.trend === 'up' ? (
                                                <ArrowUpRight className="h-3 w-3" />
                                            ) : (
                                                <ArrowDownRight className="h-3 w-3" />
                                            )}
                                            <span className="text-xs font-medium">{Math.abs(product.change)}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Farmer Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Farmers</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={farmerPerformance} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="#10b981" name="Sales ($)" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="products" fill="#3b82f6" name="Products" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}
