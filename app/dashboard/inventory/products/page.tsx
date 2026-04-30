"use client";

import { useEffect, useState } from "react";
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
  "Good stock": { bg: "bg-emerald-50 text-emerald-700", text: "bg-emerald-500", icon: CheckCircle },
  "Low stock": { bg: "bg-amber-50 text-amber-700", text: "bg-amber-500", icon: AlertTriangle },
  "Critical": { bg: "bg-rose-50 text-rose-700", text: "bg-rose-500", icon: AlertCircle },
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
      
      // Build query params
      const params = new URLSearchParams();
      if (filters.category) params.append('categoryId', filters.category);
      if (filters.status === 'Low stock') params.append('lowStock', 'true');
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data: Product[] = await response.json();
      
      // Transform data for display
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
          price: `$${product.price.toFixed(2)}`,
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

  // Apply filters and search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  // Add or update product
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
      
      await fetchProducts(); // Refresh the list
      resetModal();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
      
      await fetchProducts(); // Refresh the list
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  // Open modal for editing
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

  // Open modal for adding
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

  // Reset modal state
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: "", status: "" });
    setSearchQuery("");
  };

  const activeFilterCount = [filters.category, filters.status].filter(Boolean).length;

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300" />
        <div className="flex gap-4">
          <div className="h-12 flex-1 max-w-md bg-slate-200 rounded-xl" />
          <div className="h-12 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl" />
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
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
              <p className="mt-2">Manage and track your product inventory</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs">Total Products</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold">{products.filter(p => p.status === "Good stock").length}</p>
                <p className="text-xs">In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 ${activeFilterCount > 0 ? 'border-blue-500 text-blue-600' : 'text-slate-700'}`}
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Filters</h4>
                  {activeFilterCount > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:underline"
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
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
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 && !loading ? (
        <div className="rounded-2xl border border-slate-200/50 bg-white p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">No products found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery || activeFilterCount > 0 
              ? "Try adjusting your search or filters" 
              : "Get started by adding your first product"}
          </p>
          {(searchQuery || activeFilterCount > 0) && (
            <button 
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Available</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => {
                  const StatusIcon = statusConfig[product.status].icon;
                  return (
                    <tr key={product.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <Package className="h-5 w-5 text-slate-600" />
                          </div>
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{product.available}</span>
                          {product.available <= product.reorderPoint && product.available > 0 && (
                            <span className="text-xs text-amber-600">(Reorder at {product.reorderPoint})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[product.status].bg}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(product.id)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
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
                  <Package className="h-5 w-5 text-slate-600" />
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

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Category *</label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <span className={formData.categoryId ? "text-slate-900" : "text-slate-400"}>
                      {categories.find(c => c.id === formData.categoryId)?.name || "Select a category"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFormData({ ...formData, categoryId: cat.id });
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reorder Point</label>
                  <input
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
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
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.sku.trim() || !formData.categoryId || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Trash2 className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-slate-600">
              Are you sure you want to delete this product? This will also remove all associated data including stock alerts and order items.
            </p>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
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