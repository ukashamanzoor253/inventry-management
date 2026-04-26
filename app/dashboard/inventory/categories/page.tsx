"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  X, 
  Tag,
  TrendingUp,
  Layers,
  Edit2,
  Trash2,
  Loader2
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  available: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryDisplay {
  id: string;
  name: string;
  color: string;
  skus: number;
  revenue: string;
  productCount: number;
  totalValue: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDisplay | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "from-blue-500 to-blue-600" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Color mapping for consistent styling
  const colorMap: Record<string, string> = {
    "from-blue-500 to-blue-600": "bg-blue-500",
    "from-emerald-500 to-emerald-600": "bg-emerald-500",
    "from-amber-500 to-amber-600": "bg-amber-500",
    "from-violet-500 to-violet-600": "bg-violet-500",
    "from-rose-500 to-rose-600": "bg-rose-500",
    "from-cyan-500 to-cyan-600": "bg-cyan-500",
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data: Category[] = await response.json();
      
      // Transform data for display
      const transformedCategories: CategoryDisplay[] = data.map(category => {
        const totalProducts = category.products.length;
        const totalSKUs = category.products.reduce((sum, product) => sum + product.available, 0);
        const totalValue = category.products.reduce((sum, product) => sum + (product.available * 100), 0); // You'll need to add price to product schema
        
        return {
          id: category.id,
          name: category.name,
          color: category.color,
          skus: totalSKUs,
          revenue: `${(totalValue / 1000).toFixed(1)}K-/Rs`,
          productCount: totalProducts,
          totalValue: totalValue
        };
      });
      
      setCategories(transformedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add category');
      }
      
      await fetchCategories(); // Refresh the list
      resetModal();
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }
      
      await fetchCategories(); // Refresh the list
      resetModal();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
      
      await fetchCategories(); // Refresh the list
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  // Open modal for editing
  const openEditModal = (category: CategoryDisplay) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      color: category.color
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({ name: "", color: "from-blue-500 to-blue-600" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Reset modal state
  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", color: "from-blue-500 to-blue-600" });
    setIsEditing(false);
    setIsSubmitting(false);
  };

  // Calculate category health metrics
  const getHealthMetrics = () => {
    const healthy = categories.filter(c => c.skus > 100).length;
    const needsAttention = categories.filter(c => c.skus > 50 && c.skus <= 100).length;
    const lowStock = categories.filter(c => c.skus <= 50).length;
    return { healthy, needsAttention, lowStock };
  };

  const healthMetrics = getHealthMetrics();

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
          <p className="text-sm text-rose-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-xs text-rose-600 hover:text-rose-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-[1900px] group-hover:translate-x-6 group-hover:-translate-y-0" />
        <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest">Inventory</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Categories</h1>
              <p className="mt-2">Manage and organize your product categories</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs">Total Categories</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold">{categories.reduce((acc, c) => acc + c.skus, 0)}</p>
                <p className="text-xs">Total SKUs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Categories</h2>
          <p className="text-sm text-slate-500">
            {categories.length} categories · {categories.reduce((acc, c) => acc + c.skus, 0)} total SKUs
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/50 bg-white p-12 text-center">
          <Layers className="h-12 w-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">No categories yet</h3>
          <p className="text-sm text-slate-500 mt-1">Get started by creating your first category</p>
          <button 
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article 
              key={category.id} 
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-linear-to-br ${category.color} opacity-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-12 group-hover:-translate-y-44 group-hover:w-[700px] group-hover:h-[700px]`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${category.color}`}>
                    <Layers className="h-5 w-5 text-[#ffffff]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(category)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(category.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{category.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{category.skus}</p>
                    <p className="text-xs text-slate-500">SKUs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{category.revenue}</p>
                    <p className="text-xs text-slate-500">Revenue</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Package className="h-3 w-3" />
                  <span>{category.productCount} products</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Category Health */}
      {categories.length > 0 && (
        <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <TrendingUp className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Category Health</h3>
              <p className="text-sm text-slate-500">Keep product groups balanced and avoid stockouts</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-emerald-600">{healthMetrics.healthy}</p>
              <p className="text-sm text-emerald-700">Healthy categories</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-2xl font-bold text-amber-600">{healthMetrics.needsAttention}</p>
              <p className="text-sm text-amber-700">Needs attention</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-2xl font-bold text-rose-600">{healthMetrics.lowStock}</p>
              <p className="text-sm text-rose-700">Low stock alert</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={resetModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Tag className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {isEditing ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {isEditing ? 'Update category details' : 'Create a new product category'}
                  </p>
                </div>
              </div>
              <button 
                onClick={resetModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Color Theme</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                     "from-blue-500 to-blue-600",
                     "from-emerald-500 to-emerald-600",
                     "from-amber-500 to-amber-600",
                     "from-violet-500 to-violet-600",
                     "from-rose-500 to-rose-600",
                     "from-cyan-500 to-cyan-600",
                     "from-red-500 to-red-600",
                     "from-purple-500 to-purple-600",
                     "from-indigo-500 to-indigo-600",
                     "from-teal-500 to-teal-600",
                     "from-orange-500 to-orange-600",
                     "from-pink-500 to-pink-600",
                     "from-lime-500 to-lime-600",
                     "from-yellow-500 to-yellow-600",
                     "from-fuchsia-500 to-fuchsia-600",
                     "from-sky-500 to-sky-600",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-10 w-full rounded-lg bg-linear-to-br ${color} transition-all ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-slate-400 scale-105' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={resetModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateCategory : handleAddCategory}
                disabled={!formData.name.trim() || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Category' : 'Add Category')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Trash2 className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Category</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-slate-600">
              Are you sure you want to delete this category? This will also affect all products in this category.
            </p>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirm)}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}