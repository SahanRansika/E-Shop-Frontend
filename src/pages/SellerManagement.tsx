import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // Backend eke GET /users route eka ona wenawa
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleSellerRole = async (userId: string, currentRoles: string[]) => {
    let newRoles = currentRoles.includes('seller') 
      ? currentRoles.filter(r => r !== 'seller') 
      : [...currentRoles, 'seller'];

    try {
      await api.put(`/users/${userId}/roles`, { roles: newRoles });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Users className="text-purple-600 w-8 h-8" />
        <h1 className="text-3xl font-bold">User & Seller Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-gray-700">Name / Email</th>
              <th className="px-6 py-4 text-gray-700">Current Roles</th>
              <th className="px-6 py-4 text-right text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {u.roles.map((r: string) => (
                      <span key={r} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] uppercase font-bold border border-blue-100">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleSellerRole(u._id, u.roles)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      u.roles.includes('seller') 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {u.roles.includes('seller') ? 'Remove Seller' : 'Make Seller'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerManagement;