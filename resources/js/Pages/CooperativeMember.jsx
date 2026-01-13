import React, { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Users,
  Calendar,
  Search,
  XCircle,
  CheckCircle,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

export default function CooperativeMember({ members = [], cooperative = {} }) {
  const { auth } = usePage().props;
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
    let list = (members || []).filter((m) => {
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

  function initialsFrom(name = "") {
    const parts = name.trim().split(" ").filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }

  function avatar(m) {
    if (m.avatarUrl) {
      return (
        <img
          src={m.avatarUrl}
          alt={m.name}
          className="h-14 w-14 rounded-full object-cover border"
        />
      );
    }
    const initials = initialsFrom(m.name);
    return (
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600  text-white flex items-center justify-center font-semibold text-lg">
        {initials}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {cooperative?.name || "Cooperative Members"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{total} member{total !== 1 ? "s" : ""}</p>
          </div>

          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="pl-10"
                placeholder="Search by name, email or phone..."
              />
            </div>

            <Link
                href="/cooperatives"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-slate-700 shadow-sm hover:shadow-md transition"
                aria-label="Back to cooperatives"
                >
                ← Back to Cooperatives
            </Link>
            </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-white rounded-lg border border-dashed border-slate-200">
              <Users className="mx-auto h-12 w-12 text-indigo-400" />
              <h3 className="mt-3 text-lg font-medium text-slate-800">No members found</h3>
              <p className="mt-2 text-sm text-slate-500">Try different filters or add new members.</p>
            </div>
          ) : (
            paginated.map((m) => (
              <article
                key={m.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelected(m)}
              >
                <div className="flex items-start gap-4">
                  {avatar(m)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{m.name || "—"}</h3>
                        <p className="text-sm text-slate-500">{m.role || "Member"}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="px-2 py-1">
                          {m.status === "active" ? <CheckCircle className="h-4 w-4 inline mr-1 text-green-600" /> : <XCircle className="h-4 w-4 inline mr-1 text-rose-600" />}
                          <span className="text-xs">{m.status || "—"}</span>
                        </Badge>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                      {m.email || m.phone ? (
                        <>
                          {m.email && <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400" /> <span className="truncate">{m.email}</span></span>}
                          {m.phone && <span className="flex items-center gap-2 mt-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {m.phone}</span>}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">No contact info</span>
                      )}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">
                        ID: {m.farmer_id || m.id}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700">
                        Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <Link href={`#`} className="text-slate-400 hover:text-emerald-600" onClick={(e) => e.preventDefault()}>
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`#`} className="text-slate-400 hover:text-amber-600" onClick={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button onClick={(ev) => { ev.stopPropagation(); /* TODO: delete */ }} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Showing {(current - 1) * perPage + 1}–{Math.min(current * perPage, total)} of {total}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={current === 1}>Prev</Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pages }).map((_, i) => {
                const pageNum = i + 1;
                const active = pageNum === current;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${active ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white" : "bg-white border"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button variant="outline" size="sm" onClick={onNext} disabled={current === pages}>Next</Button>
          </div>
        </footer>

        {/* Details Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-lg max-w-xl w-full p-6 z-10 shadow-lg">
              <div className="flex items-start gap-4">
                {avatar(selected)}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{selected.name}</h2>
                  <p className="text-sm text-slate-500">{selected.role || "Member"}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="mt-4 text-sm text-slate-700 space-y-2">
                {selected.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {selected.email}</div>}
                {selected.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {selected.phone}</div>}
                {selected.joinedAt && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {new Date(selected.joinedAt).toLocaleString()}</div>}
                {selected.notes && (
                  <div>
                    <strong>Notes:</strong>
                    <div className="mt-1 p-2 bg-slate-50 rounded text-slate-600">{selected.notes}</div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
