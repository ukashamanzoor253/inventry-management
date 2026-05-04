"use client";

import { useEffect, useState } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
import {
  Package,
  Plus,
  X,
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

// Types
interface Category {
  id: string;
  name: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: Category;
  available: number;
  reorderPoint: number;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  stockalert?: any[];
}

interface ProductDisplay {
  id: string;
  name: string;
  sku: string;
  category: string;
  available: number;
  status: string;
  price: string;
  reorderPoint: number;
  location: string;
}

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  "Good stock": { bg: "from-emerald-500 to-teal-500", text: "bg-emerald-500", icon: CheckCircle },
  "Low stock": { bg: "from-amber-500 to-orange-500", text: "bg-amber-500", icon: AlertTriangle },
  "Critical": { bg: "from-rose-500 to-red-500", text: "bg-rose-500", icon: AlertCircle },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [selectedProduct, setSelectedProduct] = useState<ProductDisplay | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    available: 0,
    price: 0,
    reorderPoint: 10,
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch products and categories
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.status === 'Low stock') params.append('lowStock', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data: Product[] = await response.json();

      const transformedProducts: ProductDisplay[] = data.map(product => {
        let status = "Good stock";
        if (product.available === 0) status = "Critical";
        else if (product.available <= product.reorderPoint) status = "Low stock";

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category.name,
          available: product.available,
          status: status,
          price: `${product.price.toFixed(2)}`,
          reorderPoint: product.reorderPoint,
          location: product.location
        };
      });

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.sku.trim() || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const url = isEditing && selectedProduct
        ? `/api/products/${selectedProduct.id}`
        : '/api/products';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
      }

      await fetchProducts();
      resetModal();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      await fetchProducts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const openEditModal = (product: ProductDisplay) => {
    const selectedCategory = categories.find(c => c.name === product.category);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      categoryId: selectedCategory?.id || "",
      available: product.available,
      price: parseFloat(product.price.replace('$', '')),
      reorderPoint: product.reorderPoint,
      location: product.location
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      sku: "",
      categoryId: "",
      available: 0,
      price: 0,
      reorderPoint: 10,
      location: ""
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      sku: "",
      categoryId: "",
      available: 0,
      price: 0,
      reorderPoint: 10,
      location: ""
    });
    setIsEditing(false);
    setIsSubmitting(false);
    setIsDropdownOpen(false);
  };

  const clearFilters = () => {
    setFilters({ category: "", status: "" });
    setSearchQuery("");
  };

  const activeFilterCount = [filters.category, filters.status].filter(Boolean).length;

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.status === "Good stock").length;



  return (
    <div className="space-y-6 h-full">
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
        title="Products"
        subtitle="Manage and track your product inventory"
        stats={[
          { label: "Total Products", value: totalProducts },
          { label: "In Stock", value: inStockCount },
        ]}
      />

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 ${activeFilterCount > 0 ? 'border-blue-500 text-blue-600' : 'text-slate-700'
                }`}
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-5 ">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Filters</h4>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Good stock">Good stock</option>
                      <option value="Low stock">Low stock</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 "
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white ">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Product</th>
                <th className="px-6 py-4 font-semibold text-slate-700">SKU</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Available</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* 🔄 Loading State */}
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                /* ❌ Empty State (FIXED: using tr instead of div) */
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {searchQuery || activeFilterCount > 0
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first product"}
                      </p>

                      {(searchQuery || activeFilterCount > 0) && (
                        <button
                          onClick={clearFilters}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                /* ✅ Data Rows (FIXED map) */
                products.map((product) => {
                  const StatusIcon = statusConfig[product.status].icon;

                  return (
                    <tr
                      key={product.id}
                      className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        {product.sku}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {product.price}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${product.available <= product.reorderPoint
                                ? "text-amber-600"
                                : "text-slate-900"
                              }`}
                          >
                            {product.available}
                          </span>

                          {product.available <= product.reorderPoint &&
                            product.available > 0 && (
                              <span className="text-xs text-amber-600">
                                (Reorder at {product.reorderPoint})
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[product.status]
                            }`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add/Edit Product Modal */}
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
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {isEditing ? 'Update product details' : 'Create a new product entry'}
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

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., WS-3381"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Category *</label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <span className={formData.categoryId ? "text-slate-900" : "text-slate-400"}>
                      {categories.find(c => c.id === formData.categoryId)?.name || "Select a category"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white ">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFormData({ ...formData, categoryId: cat.id });
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Initial Stock</label>
                  <input
                    type="number"
                    value={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reorder Point</label>
                  <input
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Location (Optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Aisle 1, Shelf B"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.sku.trim() || !formData.categoryId || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
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
                  <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this product? This will also remove all associated data including stock alerts and order items.
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
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-rose-700 hover:to-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}