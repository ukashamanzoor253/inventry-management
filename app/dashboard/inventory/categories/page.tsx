"use client";

import { useEffect, useState } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
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
  const [formData, setFormData] = useState({ name: "", color: "from-blue-600 to-indigo-600" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      
      const transformedCategories: CategoryDisplay[] = data.map(category => {
        const totalProducts = category.products.length;
        const totalSKUs = category.products.reduce((sum, product) => sum + product.available, 0);
        const totalValue = category.products.reduce((sum, product) => sum + (product.available * 100), 0);
        
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
      
      await fetchCategories();
      resetModal();
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      
      await fetchCategories();
      resetModal();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
      
      await fetchCategories();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const openEditModal = (category: CategoryDisplay) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      color: category.color
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({ name: "", color: "from-blue-600 to-indigo-600" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", color: "from-blue-600 to-indigo-600" });
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const getHealthMetrics = () => {
    const healthy = categories.filter(c => c.skus > 100).length;
    const needsAttention = categories.filter(c => c.skus > 50 && c.skus <= 100).length;
    const lowStock = categories.filter(c => c.skus <= 50).length;
    return { healthy, needsAttention, lowStock };
  };

  const healthMetrics = getHealthMetrics();
  const totalSKUs = categories.reduce((acc, c) => acc + c.skus, 0);



  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-rose-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-rose-600 hover:text-rose-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <HeroHeader
        badge="Inventory"
        title="Categories"
        subtitle="Manage and organize your product categories"
        stats={[
          { label: "Total Categories", value: categories.length },
          { label: "Total SKUs", value: totalSKUs },
        ]}
      />

      {/* Add Category Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Categories</h2>
          <p className="text-sm text-slate-500">
           {loading  ? "... " : `${categories.length}`} categories · {loading  ? "... " : `${totalSKUs}`}  total SKUs
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 "
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
    {loading ? (
  // 🔄 LOADING STATE (skeleton grid)
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <article
        key={i}
        className="animate-pulse rounded-2xl border border-slate-200/50 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-200" />
            <div className="h-8 w-8 rounded-lg bg-slate-200" />
          </div>
        </div>

        <div className="mt-4 h-5 w-32 rounded bg-slate-200" />

        <div className="mt-4 flex justify-between">
          <div>
            <div className="h-6 w-16 rounded bg-slate-200" />
            <div className="mt-1 h-3 w-10 rounded bg-slate-200" />
          </div>
          <div className="text-right">
            <div className="h-5 w-14 rounded bg-slate-200" />
            <div className="mt-1 h-3 w-10 rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-4 h-3 w-24 rounded bg-slate-200" />
      </article>
    ))}
  </div>
) : categories.length === 0 ? (
  <div className="rounded-2xl border border-slate-200/50 bg-white p-12 text-center">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
      <Layers className="h-8 w-8 text-slate-400" />
    </div>

    <h3 className="text-lg font-semibold text-slate-900">
      No categories yet
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      Get started by creating your first category
    </p>

    <button
      onClick={openAddModal}
      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700"
    >
      <Plus className="h-4 w-4" />
      Add Category
    </button>
  </div>
) : (
  // ✅ DATA GRID
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {categories.map((category) => (
      <article
        key={category.id}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 "
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} `}
            >
              <Layers className="h-6 w-6 text-white" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditModal(category)}
                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setDeleteConfirm(category.id)}
                className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {category.name}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {category.skus.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">SKUs</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">
                {category.revenue}
              </p>
              <p className="text-xs text-slate-500">Revenue</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Package className="h-3.5 w-3.5" />
            <span>{category.productCount} products</span>
          </div>
        </div>
      </article>
    ))}
  </div>
)}

      {/* Category Health */}
      
        <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 ">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Category Health</h3>
              <p className="text-sm text-slate-500">Keep product groups balanced and avoid stockouts</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-600">{loading ? "..." : healthMetrics.healthy}</p>
              <p className="text-sm text-emerald-700">Healthy categories</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 border border-amber-100">
              <p className="text-2xl font-bold text-amber-600">{loading ? "..." : healthMetrics.needsAttention}</p>
              <p className="text-sm text-amber-700">Needs attention</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 border border-rose-100">
              <p className="text-2xl font-bold text-rose-600">{loading ? "..." : healthMetrics.lowStock}</p>
              <p className="text-sm text-rose-700">Low stock alert</p>
            </div>
          </div>
        </div>
   

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={resetModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white ">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 ">
                    <Tag className="h-5 w-5 text-white" />
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
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Color Theme</label>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[
                    "from-blue-600 to-indigo-600",
                    "from-emerald-500 to-teal-600",
                    "from-amber-500 to-orange-600",
                    "from-violet-500 to-purple-600",
                    "from-rose-500 to-red-600",
                    "from-cyan-500 to-blue-600",
                    "from-fuchsia-500 to-pink-600",
                    "from-lime-500 to-green-600",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-10 w-full rounded-lg bg-gradient-to-br ${color} transition-all duration-200 ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-slate-400 scale-105 ' 
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={resetModal}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateCategory : handleAddCategory}
                disabled={!formData.name.trim() || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white ">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 ">
                  <Trash2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Category</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this category? This will also affect all products in this category.
              </p>
            </div>
            
            <div className="border-t border-slate-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirm)}
                className="rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-rose-700 hover:to-red-700"
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