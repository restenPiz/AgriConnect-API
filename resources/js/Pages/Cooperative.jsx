import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function Cooperative({ cooperatives }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCooperatives = cooperatives.filter(coop =>
        coop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCooperatives.map(coop => (
                    <div key={coop.id} className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">{coop.name}</h2>
                        <p className="text-gray-600 mb-4">{coop.description}</p>
                        <Link href={`/cooperatives/${coop.id}`} className="text-blue-500 hover:underline">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
