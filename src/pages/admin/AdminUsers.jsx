import React, { useState } from 'react';
import { Search, Trash2, Shield, User, Loader2, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function AdminUsers() {
  const { usersList, updateUserRole, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleRoleChange = async (userObj, newRole) => {
    const id = userObj.id || userObj._id;
    setLoadingId(id);
    setErrorMsg('');
    const res = await updateUserRole(id, newRole, userObj.name, userObj.email, userObj.avatar);
    setLoadingId(null);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    setErrorMsg('');
    const res = await deleteUser(id);
    setDeletingId(null);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Manage Platform Users
          </h1>
          <p className="text-xs text-zinc-400">
            View registered fandom accounts, grant administrator privileges, or remove profiles.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-zinc-850 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-zinc-500 font-medium">
                  No Users Found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const id = u.id || u._id;
                return (
                  <tr key={id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover bg-zinc-900"
                      />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-zinc-500 line-clamp-1">{u.bio || 'Fan Hub Plus member'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          disabled={loadingId === id}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none ${
                            u.role === 'admin'
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                        </select>
                        {loadingId === id && <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : u.joinedDate || 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        disabled={deletingId === id}
                        onClick={() => handleDelete(id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        {deletingId === id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
