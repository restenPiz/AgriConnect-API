import React, { useState } from 'react';
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
    );
}
