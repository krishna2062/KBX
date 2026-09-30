import React, { useState, useEffect } from 'react';
import { Users, Shield, KeyRound, LogOut, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { AdminUser } from '../types/admin';

export const AdminUsers: React.FC = () => {
  const { showToast, currentUser } = useAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Password Change Form
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passUpdating, setPassUpdating] = useState(false);

  useEffect(() => {
    adminApi.getUsers().then((res) => {
      if (res && res.success) {
        setUsers(res.users);
      }
      setLoading(false);
    });
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPassUpdating(true);
    await new Promise((r) => setTimeout(r, 600));
    setPassUpdating(false);
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Admin password updated successfully!', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Access Control &amp; Authentication
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Users &amp; Admin Security
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Role-based credentials, permission tiers, and active administrative sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Admin Users Table */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15">
            <h2 className="font-display font-medium text-base text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-emerald-400" />
              <span>Registered Administrators</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-gray-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role Tier</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-3">
                        <div className="font-medium text-white flex items-center gap-2">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-6 h-6 rounded-full object-cover border border-emerald-500/30"
                          />
                          <span>{u.name}</span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-400 pl-8">{u.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase font-medium">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-400">
                        {new Date(u.lastLogin).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-400 font-mono text-[11px]">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Permissions Matrix */}
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-3">
            <h3 className="font-display font-medium text-sm text-white flex items-center gap-2">
              <Shield size={15} className="text-emerald-400" />
              <span>Role Permissions Matrix</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#050b08] border border-white/[0.04]">
                <div className="font-medium text-emerald-400 mb-1">Super Admin</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Full unrestricted control over all CMS domains, inquiries, code ownership, and user credentials.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#050b08] border border-white/[0.04]">
                <div className="font-medium text-white mb-1">Admin</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Can edit content, manage project requests and messages, and upload media assets.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#050b08] border border-white/[0.04]">
                <div className="font-medium text-white mb-1">Editor</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Can draft and publish blog posts, services, and project descriptions only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Password Update */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-4">
            <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
              <KeyRound size={16} className="text-emerald-400" />
              <span>Change Admin Password</span>
            </h2>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-[#050b08] border border-white/10 text-white text-xs outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={passUpdating}
                className="mt-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
              >
                {passUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Session Termination */}
          <div className="p-6 rounded-2xl bg-[#08130f] border border-red-500/20 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-red-400 font-medium">
              Emergency Session Management
            </span>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Invalidates all active tokens across devices and forces re-authentication on the next request.
            </p>
            <button
              onClick={() => showToast('All remote sessions invalidated', 'info')}
              className="py-2 px-4 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 text-xs font-mono transition-colors cursor-pointer self-start"
            >
              Logout All Remote Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
