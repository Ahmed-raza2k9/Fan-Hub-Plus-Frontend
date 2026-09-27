import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  AdminPageHeader,
  AdminAlert,
  AdminSearch,
  AdminTableWrap,
  AdminDeleteBtn,
  AdminConfirm
} from '../../components/admin/AdminUi';

export default function AdminUsers() {
  const { usersList, updateUserRole, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete);
    setErrorMsg('');
    const res = await deleteUser(pendingDelete);
    setDeletingId(null);
    setPendingDelete(null);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 max-w-[1180px]">
      <AdminPageHeader
        kicker="Community"
        title="Users"
        description="View registered accounts, grant administrator privileges, or remove profiles."
      />

      <div className="admin-card p-3 sm:p-4">
        <AdminSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by name, email, or role…" />
      </div>

      <AdminAlert>{errorMsg}</AdminAlert>

      <AdminTableWrap>
        <table className="text-left">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-stone-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const id = u.id || u._id;
                return (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover bg-black/40"
                        />
                        <div className="min-w-0">
                          <span className="font-medium text-white block">{u.name}</span>
                          <span className="text-[11px] text-stone-500 line-clamp-1">{u.bio || 'Fan Hub Plus member'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-[11px] text-stone-400">{u.email}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          disabled={loadingId === id}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="px-2.5 py-1 text-xs min-w-[8rem]"
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                        </select>
                        {loadingId === id && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff2e63]" />}
                      </div>
                    </td>
                    <td className="text-stone-500 tabular-nums text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : u.joinedDate || 'Recent'}
                    </td>
                    <td className="text-right">
                      <AdminDeleteBtn loading={deletingId === id} disabled={deletingId === id} onClick={() => setPendingDelete(id)} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </AdminTableWrap>

      <AdminConfirm
        open={!!pendingDelete}
        title="Delete user"
        message="This will permanently remove the account. This action cannot be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={!!deletingId}
      />
    </div>
  );
}
