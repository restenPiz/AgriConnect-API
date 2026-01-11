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
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    Settings,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Phone,
    Mail,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Farmer({ farmers }) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        router.get('/logout');
    };

    // // Sample farmer data - replace with your actual data from props
    // const farmers = [
    //     {
    //         id: 1,
    //         name: 'João Silva',
    //         email: 'joao.silva@email.com',
    //         phone: '+258 84 123 4567',
    //         location: 'Beira, Sofala',
    //         products_count: 15,
    //         rating: 4.8,
    //         status: 'active',
    //         verified: true,
    //         avatar: '👨‍🌾'
    //     },
    //     {
    //         id: 2,
    //         name: 'Maria Santos',
    //         email: 'maria.santos@email.com',
    //         phone: '+258 84 234 5678',
    //         location: 'Chimoio, Manica',
    //         products_count: 23,
    //         rating: 4.9,
    //         status: 'active',
    //         verified: true,
    //         avatar: '👩‍🌾'
    //     },
    //     {
    //         id: 3,
    //         name: 'Pedro Mendes',
    //         email: 'pedro.mendes@email.com',
    //         phone: '+258 84 345 6789',
    //         location: 'Nampula',
    //         products_count: 8,
    //         rating: 4.5,
    //         status: 'pending',
    //         verified: false,
    //         avatar: '👨‍🌾'
    //     },
    //     {
    //         id: 4,
    //         name: 'Ana Costa',
    //         email: 'ana.costa@email.com',
    //         phone: '+258 84 456 7890',
    //         location: 'Tete',
    //         products_count: 31,
    //         rating: 5.0,
    //         status: 'active',
    //         verified: true,
    //         avatar: '👩‍🌾'
    //     },
    //     {
    //         id: 5,
    //         name: 'Carlos Rodrigues',
    //         email: 'carlos.r@email.com',
    //         phone: '+258 84 567 8901',
    //         location: 'Maputo',
    //         products_count: 0,
    //         rating: 0,
    //         status: 'inactive',
    //         verified: false,
    //         avatar: '👨‍🌾'
    //     },
    // ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: 'Active', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
            pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
            inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
        };

        const config = statusConfig[status] || statusConfig.active;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const filteredFarmers = farmers.filter(farmer =>
        farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                className="flex items-center gap-2 text-green-600 transition-colors font-medium"
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
                            <Link
                                href="/cooperatives"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                <span>Cooperatives</span>
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
                                <Link href="/farmers" className="flex items-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg font-medium">
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
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmers</h2>
                    <p className="text-gray-600">Manage and connect with farmers in your network</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <p className="text-sm text-gray-600">Total Farmers</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{farmers.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-gray-600">Active Farmers</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {farmers.filter(f => f.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <p className="text-sm text-gray-600">Pending Approval</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {farmers.filter(f => f.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <p className="text-sm text-gray-600">Avg Rating</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {(farmers.filter(f => f.rating > 0).reduce((acc, f) => acc + f.rating, 0) /
                              farmers.filter(f => f.rating > 0).length || 0).toFixed(1)}
                        </p>
                    </div>
                </div><br></br>

                {/* Action Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search farmers by name, email, location..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                            {/* <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Farmer</span>
                            </Button> */}
                        </div>
                    </div>
                </div>

                {/* Farmers Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Farmer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Products</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredFarmers.length > 0 ? (
                                    filteredFarmers.map((farmer) => (
                                        <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-2xl">
                                                        👨‍🌾
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{farmer.name}</p>
                                                            {farmer.verified && (
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">ID: #{farmer.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                                        <Mail className="h-3 w-3 text-gray-400" />
                                                        {farmer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="h-3 w-3 text-gray-400" />
                                                        {farmer.phone_number}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-900">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    {farmer.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{farmer.products_count}</span>
                                                    <span className="text-sm text-gray-500">products</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {farmer.rating > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium text-gray-900">{farmer.rating.toFixed(1)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No ratings</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(farmer.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu className="bg-white">
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md">
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Eye className="h-4 w-4" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Package className="h-4 w-4" />
                                                            View Products
                                                        </DropdownMenuItem> */}
                                                        {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4" />
                                                            Edit Details
                                                        </DropdownMenuItem> */}
                                                        {/* <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                            Remove Farmer
                                                        </DropdownMenuItem> */}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No farmers found</p>
                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{filteredFarmers.length}</span> of{' '}
                            <span className="font-medium">{farmers.length}</span> farmers
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
