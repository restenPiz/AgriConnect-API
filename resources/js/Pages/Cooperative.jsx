import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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

export default function Cooperative({ cooperatives }) {
    const [searchTerm, setSearchTerm] = useState('');
         const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        router.get('/logout');
    };

    const filteredCooperatives = cooperatives.filter(coop =>
        coop.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <Link
                                href="/cooperatives"
                                className="flex items-center gap-2 text-green-600 transition-colors font-medium"
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
                        <div className="p-6">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold mb-4">Cooperatives</h1>
                                <input
                                    type="text"
                                    placeholder="Search cooperatives..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {filteredCooperatives.length === 0 ? (
                                <div className="text-center text-gray-500">No cooperatives found</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCooperatives.map(coop => (
                                        <div key={coop.id} className="bg-white p-4 rounded-lg shadow">
                                            <h2 className="text-xl font-semibold mb-2">{coop.name}</h2>
                                            <p className="text-gray-600 mb-2">{coop.description}</p>

                                            {/* User count badge */}
                                            <div className="mb-4 flex items-center gap-2">
                                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                                    {coop.members_count || 0} members
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-500 mb-4">
                                                <p>Status: <span className="font-semibold capitalize">{coop.status}</span></p>
                                                <p>Type: <span className="font-semibold capitalize">{coop.type}</span></p>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
