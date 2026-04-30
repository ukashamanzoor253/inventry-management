"use client";

import { useState, useEffect } from "react";
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
      ADMIN: "bg-purple-100 text-purple-700",
      SELLER: "bg-blue-100 text-blue-700",
      USER: "bg-gray-100 text-gray-700"
    };
    return colors[role as keyof typeof colors] || colors.USER;
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-white shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Header */}

      <div className="group relative overflow-hidden text-white rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-[1900px] group-hover:translate-x-6 group-hover:-translate-y-0" />
        <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-start gap-2">
                <Users className="h-6 w-6" />
                <div className="">
                  <h1 className="text-2xl font-bold">User Management</h1>
                  <p className="mt-1 text-sm">
                    Manage users, roles, and account status
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${statusFilter === "all"
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${statusFilter === "active"
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${statusFilter === "inactive"
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchUsers}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <Users className="h-12 w-12 text-slate-400" />
            <p className="mt-2 text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                          <UserIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
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
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
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
                          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-600"
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
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-emerald-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-emerald-500 focus:outline-none"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password {!editingUser && "*"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-10 focus:border-emerald-500 focus:outline-none"
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
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-emerald-500 focus:outline-none"
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
                  className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Active (user can login)
                </label>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
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