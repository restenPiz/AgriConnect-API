import React, { useMemo, useState } from "react";

/**
 * CooperativeMember.jsx
 *
 * Props:
 * - cooperative: { id, name, description }
 * - members: [{ id, name, email, phone, role, avatarUrl, joinedAt, notes }]
 *
 * This component provides:
 * - Search by name/email/phone
 * - Role filter
 * - Sort options
 * - Paginated, responsive card grid
 * - Click card to open a details modal
 *
 * Tailwind CSS classes are used for styling. If your project doesn't use Tailwind,
 * adjust classes or add styles accordingly.
 */

export default function CooperativeMember({ members = [], cooperative = {} }) {
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sort, setSort] = useState("name_asc");
    const [page, setPage] = useState(1);
    const [perPage] = useState(12);
    const [selected, setSelected] = useState(null);

    // derive roles from members
    const roles = useMemo(() => {
        const setRoles = new Set(members.map((m) => m.role || "Member"));
        return ["all", ...Array.from(setRoles)];
    }, [members]);

    // filter + sort
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = members.filter((m) => {
            if (!q) return true;
            return (
                (m.name || "").toLowerCase().includes(q) ||
                (m.email || "").toLowerCase().includes(q) ||
                (m.phone || "").toLowerCase().includes(q)
            );
        });
        if (roleFilter !== "all") {
            list = list.filter((m) => (m.role || "Member") === roleFilter);
        }
        // sort
        list.sort((a, b) => {
            if (sort === "name_asc") return (a.name || "").localeCompare(b.name || "");
            if (sort === "name_desc") return (b.name || "").localeCompare(a.name || "");
            if (sort === "joined_desc") return new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0);
            if (sort === "joined_asc") return new Date(a.joinedAt || 0) - new Date(b.joinedAt || 0);
            return 0;
        });
        return list;
    }, [members, query, roleFilter, sort]);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(page, pages);

    const paginated = useMemo(() => {
        const start = (current - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, current, perPage]);

    function onPrev() {
        setPage((p) => Math.max(1, p - 1));
    }
    function onNext() {
        setPage((p) => Math.min(pages, p + 1));
    }

    function avatar(m) {
        if (m.avatarUrl) return (
            <img src={m.avatarUrl} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
        );
        const initials = (m.name || "U")
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
        return (
            <div className="h-14 w-14 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {initials}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {cooperative?.name || "Cooperative Members"}
                    </h1>
                    {cooperative?.description && (
                        <p className="text-sm text-gray-500 mt-1">{cooperative.description}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{total} member{total !== 1 ? "s" : ""}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search name, email or phone..."
                        className="px-3 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 border rounded-md bg-white"
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r === "all" ? "All roles" : r}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white"
                    >
                        <option value="name_asc">Name ↑</option>
                        <option value="name_desc">Name ↓</option>
                        <option value="joined_desc">Newest</option>
                        <option value="joined_asc">Oldest</option>
                    </select>
                </div>
            </header>

            {total === 0 ? (
                <div className="border rounded-lg p-8 text-center text-gray-600">
                    <svg className="mx-auto mb-4 h-12 w-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zM6 21a6 6 0 0112 0H6z" />
                    </svg>
                    <h3 className="text-lg font-medium">No members yet</h3>
                    <p className="mt-2 text-sm">There are no members matching your filters. Add some members to get started.</p>
                </div>
            ) : (
                <>
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {paginated.map((m) => (
                            <article
                                key={m.id}
                                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white"
                                onClick={() => setSelected(m)}
                            >
                                <div className="flex items-center gap-3">
                                    {avatar(m)}
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800">{m.name}</h3>
                                        <p className="text-sm text-gray-500">{m.role || "Member"}</p>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-600 space-y-1">
                                    {m.email && (
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">{m.email}</span>
                                        </div>
                                    )}
                                    {m.phone && <div>{m.phone}</div>}
                                    {m.joinedAt && (
                                        <div className="text-xs text-gray-400">Joined {new Date(m.joinedAt).toLocaleDateString()}</div>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                        ID: {m.id}
                                    </span>
                                    <span className="text-xs text-indigo-600">View details →</span>
                                </div>
                            </article>
                        ))}
                    </section>

                    <footer className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {(current - 1) * perPage + 1}–{Math.min(current * perPage, total)} of {total}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onPrev}
                                disabled={current === 1}
                                className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                            >
                                Prev
                            </button>

                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: pages }).map((_, i) => {
                                    const pageNum = i + 1;
                                    const active = pageNum === current;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-3 py-1 rounded ${active ? "bg-indigo-600 text-white" : "bg-white border"}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={onNext}
                                disabled={current === pages}
                                className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </footer>
                </>
            )}

            {/* Details Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={() => setSelected(null)} />
                    <div className="relative bg-white rounded-lg max-w-xl w-full p-6 z-10 shadow-lg">
                        <div className="flex items-start gap-4">
                            {avatar(selected)}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">{selected.name}</h2>
                                <p className="text-sm text-gray-500">{selected.role || "Member"}</p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 text-sm text-gray-700 space-y-2">
                            {selected.email && <div><strong>Email:</strong> {selected.email}</div>}
                            {selected.phone && <div><strong>Phone:</strong> {selected.phone}</div>}
                            {selected.joinedAt && (
                                <div><strong>Joined:</strong> {new Date(selected.joinedAt).toLocaleString()}</div>
                            )}
                            {selected.notes && (
                                <div>
                                    <strong>Notes:</strong>
                                    <div className="mt-1 p-2 bg-gray-50 rounded text-gray-600">{selected.notes}</div>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 rounded border bg-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
