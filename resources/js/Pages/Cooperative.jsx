import React, { useState, useMemo } from 'react';
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
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Cooperative({ cooperatives = [] }) {
    const { auth } = usePage().props;
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('newest');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.get('/logout');
    };

    const filtered = useMemo(() => {
        let items = cooperatives || [];

        const q = query.trim().toLowerCase();
        if (q) {
            items = items.filter(c =>
                (c.name || '').toLowerCase().includes(q) ||
                (c.description || '').toLowerCase().includes(q) ||
                ((c.coordinator && c.coordinator.name) || '').toLowerCase().includes(q)
            );
        }

        if (sort === 'members_desc') {
            items = items.sort((a, b) => (b.members_count || 0) - (a.members_count || 0));
        } else if (sort === 'members_asc') {
            items = items.sort((a, b) => (a.members_count || 0) - (b.members_count || 0));
        } else {
            items = items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return items;
    }, [cooperatives, query, sort]);

    const initials = (name = '') => {
        const parts = name.trim().split(' ').filter(Boolean);
        if (!parts.length) return 'U';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Sprout className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">AgriConnect</h1>
                            {/* <span className="text-sm text-gray-500">Cooperatives</span> */}
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                                <Home className="h-4 w-4" />
                                <span>Inicio</span>
                            </Link>
                            <Link href="/product" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                                <Package className="h-4 w-4" />
                                <span>Products</span>
                            </Link>
                            <Link href="/farmers" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                                <Users className="h-4 w-4" />
                                <span>Farmers</span>
                            </Link>
                            <Link href="/analytics" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                            <Link href="/cooperatives" className="flex items-center gap-2 text-green-600 font-medium">
                                <Users className="h-4 w-4" />
                                <span>Cooperatives</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                    {initials(auth.user.name)}
                                </div>
                            </div>

                            <Button onClick={handleLogout} variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>

                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-3">
                                <Link href="/dashboard" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                                <Link href="/farmers" className="px-3 py-2 text-green-600 bg-green-50 rounded-lg font-medium">Farmers</Link>
                                <Button onClick={handleLogout} variant="outline">Logout</Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Cooperatives</h2>
                        <p className="text-sm text-slate-500">Browse and manage cooperatives in your network</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" placeholder="Search cooperatives, coordinator, description..." />
                        </div>


                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full text-center text-slate-500 py-14 bg-white rounded-lg border border-dashed border-slate-200">
                            No cooperatives found
                        </div>
                    ) : filtered.map(coop => (
                        <div key={coop.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1 p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg font-semibold">
                                            {initials(coop.name)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">{coop.name}</h3>
                                            <p className="text-xs text-slate-500">
                                                Coordinator: <span className="font-medium text-slate-700">{coop.coordinator?.name || '—'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <Badge variant="secondary" className="inline-flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {coop.members_count || 0} members
                                        </Badge>

                                        <span className={`text-xs px-2 py-1 rounded ${coop.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-800'}`}>
                                            {coop.status || '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-2">
                                        <Link href={`/cooperativesM/${coop.id}`} className="text-slate-500 hover:text-emerald-600">
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => {}} className="text-slate-400 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
