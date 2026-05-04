"use client";

import { useState, useEffect } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
  };
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SELLER' | 'USER';
  isActive: boolean;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = statusFilter === "all"
        ? "/api/users"
        : `/api/users?status=${statusFilter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editingUser
        ? `/api/users/${editingUser.id}`
        : "/api/users";

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save user');
      }

      setSuccessMessage(editingUser ? "User updated successfully" : "User created successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      setSuccessMessage(`${userName} deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user status');
      }

      setSuccessMessage(`${user.name} ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);

      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTimeout(() => setError(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
      isActive: true
    });
    setEditingUser(null);
    setShowModal(false);
    setShowPassword(false);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: "from-purple-500 to-purple-600",
      SELLER: "from-blue-500 to-blue-600",
      USER: "from-gray-500 to-gray-600"
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-white shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Hero Header */}
      <HeroHeader
        badge="Administration"
        title="User Management"
        subtitle="Manage users, roles, and account status"
        stats={[
          { label: "Total Users", value: users.length },
          { label: "Active", value: activeUsers },
        ]}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{users.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Users</p>
              <p className="text-3xl font-bold text-emerald-600">{activeUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactive Users</p>
              <p className="text-3xl font-bold text-amber-600">{inactiveUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                statusFilter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                statusFilter === "active"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                statusFilter === "inactive"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <p className="text-rose-600">{error}</p>
            <button
              onClick={fetchUsers}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-white hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="mt-3 text-slate-500">No users found</p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full bg-gradient-to-r ${getRoleBadge(user.role)} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {user.isActive ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {user._count?.orders || 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => editUser(user)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {editingUser ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {editingUser ? "Update user details" : "Create a new user account"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password {!editingUser && "*"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="USER">User</option>
                    <option value="SELLER">Seller</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Active (user can login)
                </label>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingUser ? "Update" : "Create"}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}