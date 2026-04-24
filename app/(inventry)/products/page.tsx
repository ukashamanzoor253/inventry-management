"use client";

import { useState } from "react";
import { 
  Package, 
  Plus, 
  X, 
  Tag,
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Supplies" },
  { id: 3, name: "Logistics" },
  { id: 4, name: "Equipment" },
  { id: 5, name: "Office Supplies" },
  { id: 6, name: "Tools" },
];

const initialProducts = [
  { id: 1, name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, status: "Good stock", price: "$299.00" },
  { id: 2, name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, status: "Low stock", price: "$12.99" },
  { id: 3, name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, status: "Good stock", price: "$45.00" },
  { id: 4, name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, status: "Critical", price: "$28.50" },
  { id: 5, name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, status: "Low stock", price: "$899.00" },
  { id: 6, name: "Industrial Shelving", sku: "IS-5520", category: "Logistics", available: 45, status: "Good stock", price: "$320.00" },
  { id: 7, name: "Label Printer", sku: "LP-2200", category: "Electronics", available: 8, status: "Critical", price: "$450.00" },
  { id: 8, name: "Safety Gloves", sku: "SG-1100", category: "Supplies", available: 156, status: "Good stock", price: "$18.99" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  "Good stock": { bg: "bg-emerald-50 text-emerald-700", text: "bg-emerald-500", icon: CheckCircle },
  "Low stock": { bg: "bg-amber-50 text-amber-700", text: "bg-amber-500", icon: AlertTriangle },
  "Critical": { bg: "bg-rose-50 text-rose-700", text: "bg-rose-500", icon: AlertCircle },
};

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    sku: "", 
    category: "", 
    available: 0, 
    price: "" 
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeFilterCount = [filters.category, filters.status].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ category: "", status: "" });
  };

  const handleAddProduct = () => {
    if (newProduct.name.trim() && newProduct.sku.trim() && newProduct.category) {
      const status = newProduct.available <= 10 ? "Critical" : newProduct.available <= 25 ? "Low stock" : "Good stock";
      const product = {
        id: Date.now(),
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        available: newProduct.available,
        status,
        price: newProduct.price || "$0.00",
      };
      setProducts([...products, product]);
      setNewProduct({ name: "", sku: "", category: "", available: 0, price: "" });
      setIsModalOpen(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-8 translate-y-8 rounded-full bg-blue-500/10 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-blue-300">Inventory</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
              <p className="mt-2 text-slate-300">Manage and track your product inventory</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-slate-400">Total Products</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">{products.filter(p => p.status === "Good stock").length}</p>
                <p className="text-xs text-slate-400">In Stock</p>
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
                      {initialCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
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
            {filteredProducts.map((product) => {
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
                  <td className="px-6 py-4 text-slate-600">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{product.price}</td>
                  <td className="px-6 py-4 text-slate-600">{product.available}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[product.status].bg}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Package className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Add New Product</h3>
                  <p className="text-sm text-slate-500">Create a new product entry</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g., WS-3381"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price</label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="$0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <span className={newProduct.category ? "text-slate-900" : "text-slate-400"}>
                      {newProduct.category || "Select a category"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      {initialCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setNewProduct({ ...newProduct, category: cat.name });
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

              <div>
                <label className="block text-sm font-medium text-slate-700">Initial Stock</label>
                <input
                  type="number"
                  value={newProduct.available || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, available: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name.trim() || !newProduct.sku.trim() || !newProduct.category}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
