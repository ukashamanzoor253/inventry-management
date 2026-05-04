"use client";

import { useState } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
import {
  Package,
  Plus,
  Search,
  AlertCircle,
  DollarSign,
  Layers,
  TrendingUp,
  Edit,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";

// Types
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  available: number;
  reorderPoint: number;
  price: string;
  location: string;
  lastUpdated: string;
}

interface Category {
  id: number;
  name: string;
  itemCount: number;
}

// Initial Data
const initialInventory: InventoryItem[] = [
  { id: 1, name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, reorderPoint: 50, price: "$249.99", location: "A-12", lastUpdated: "2024-01-15" },
  { id: 2, name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, reorderPoint: 100, price: "$12.99", location: "B-05", lastUpdated: "2024-01-14" },
  { id: 3, name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, reorderPoint: 50, price: "$34.99", location: "C-08", lastUpdated: "2024-01-13" },
  { id: 4, name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, reorderPoint: 25, price: "$8.99", location: "B-12", lastUpdated: "2024-01-16" },
  { id: 5, name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, reorderPoint: 10, price: "$599.99", location: "D-03", lastUpdated: "2024-01-12" },
  { id: 6, name: "Anti-Static Mats", sku: "AS-4452", category: "Electronics", available: 45, reorderPoint: 20, price: "$89.99", location: "A-15", lastUpdated: "2024-01-10" },
  { id: 7, name: "Shipping Boxes", sku: "SB-8823", category: "Supplies", available: 350, reorderPoint: 100, price: "$2.49", location: "B-20", lastUpdated: "2024-01-14" },
];

const initialCategories: Category[] = [
  { id: 1, name: "Electronics", itemCount: 2 },
  { id: 2, name: "Supplies", itemCount: 3 },
  { id: 3, name: "Logistics", itemCount: 1 },
  { id: 4, name: "Equipment", itemCount: 1 },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: categories[0]?.name || "",
    available: 0,
    reorderPoint: 0,
    price: "",
    location: "",
  });

  const [newCategory, setNewCategory] = useState({ name: "" });

  // Calculate metrics
  const totalProducts = inventory.length;
  const totalStockValue = inventory.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]/g, ''));
    return sum + (price * item.available);
  }, 0);
  
  const lowStockItems = inventory.filter(item => item.available <= item.reorderPoint);
  const criticalStockItems = inventory.filter(item => item.available <= item.reorderPoint * 0.5);
  const totalUnitsInStock = inventory.reduce((sum, item) => sum + item.available, 0);
  
  const categoryStats = categories.map(cat => ({
    ...cat,
    value: inventory
      .filter(item => item.category === cat.name)
      .reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]/g, ''));
        return sum + (price * item.available);
      }, 0)
  }));

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category) return;
    
    const newId = Math.max(...inventory.map(i => i.id), 0) + 1;
    const product: InventoryItem = {
      ...newProduct,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      available: Number(newProduct.available),
      reorderPoint: Number(newProduct.reorderPoint),
    };
    
    setInventory([...inventory, product]);
    setCategories(categories.map(cat => 
      cat.name === newProduct.category 
        ? { ...cat, itemCount: cat.itemCount + 1 }
        : cat
    ));
    
    setNewProduct({
      name: "",
      sku: "",
      category: categories[0]?.name || "",
      available: 0,
      reorderPoint: 0,
      price: "",
      location: "",
    });
    setShowAddProduct(false);
  };

  const handleEditProduct = (product: InventoryItem) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      available: product.available,
      reorderPoint: product.reorderPoint,
      price: product.price,
      location: product.location,
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    const oldCategory = editingProduct.category;
    const newCategoryName = newProduct.category;
    
    setInventory(inventory.map(item => 
      item.id === editingProduct.id 
        ? { 
            ...item, 
            ...newProduct, 
            available: Number(newProduct.available),
            reorderPoint: Number(newProduct.reorderPoint),
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : item
    ));
    
    if (oldCategory !== newCategoryName) {
      setCategories(categories.map(cat => {
        if (cat.name === oldCategory) return { ...cat, itemCount: cat.itemCount - 1 };
        if (cat.name === newCategoryName) return { ...cat, itemCount: cat.itemCount + 1 };
        return cat;
      }));
    }
    
    resetForm();
  };

  const handleDeleteProduct = (id: number, categoryName: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setInventory(inventory.filter(item => item.id !== id));
      setCategories(categories.map(cat => 
        cat.name === categoryName 
          ? { ...cat, itemCount: cat.itemCount - 1 }
          : cat
      ));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories([...categories, { 
      id: newId, 
      name: newCategory.name, 
      itemCount: 0 
    }]);
    
    setNewCategory({ name: "" });
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (categoryName: string) => {
    const hasProducts = inventory.some(item => item.category === categoryName);
    if (hasProducts) {
      alert("Cannot delete category with existing products. Move or delete products first.");
      return;
    }
    
    if (confirm(`Delete category "${categoryName}"?`)) {
      setCategories(categories.filter(cat => cat.name !== categoryName));
    }
  };

  const resetForm = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setNewProduct({
      name: "",
      sku: "",
      category: categories[0]?.name || "",
      available: 0,
      reorderPoint: 0,
      price: "",
      location: "",
    });
  };

  const updateStock = (id: number, newQuantity: number) => {
    setInventory(inventory.map(item =>
      item.id === id
        ? { ...item, available: Math.max(0, newQuantity), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <HeroHeader
        badge="Inventory Control"
        title="Inventory Management"
        subtitle="Track stock levels, manage products & monitor alerts"
        stats={[
          { label: "Total Products", value: totalProducts },
          { label: "Inventory Value", value: `${totalStockValue.toLocaleString()}` },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 ">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 ">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{totalUnitsInStock.toLocaleString()}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Total Units in Stock</p>
          <p className="text-xs text-slate-400">Across all products</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 ">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 ">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{lowStockItems.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Low Stock Alert</p>
          <p className="text-xs text-slate-400">Below reorder point</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 ">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 ">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{criticalStockItems.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Critical Stock</p>
          <p className="text-xs text-slate-400">Urgent reorder needed</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6  transition-all duration-300 hover:-translate-y-1 ">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 ">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{categories.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Categories</p>
          <p className="text-xs text-slate-400">Product classifications</p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="rounded-2xl border border-slate-200/50 bg-white ">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Product Categories</h3>
              <p className="text-sm text-slate-500">Browse inventory by category</p>
            </div>
            <button
              onClick={() => setShowAddCategory(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 "
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white "
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({totalProducts})
            </button>
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white "
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category.name} ({category.itemCount})
                </button>
                {category.itemCount === 0 && (
                  <button
                    onClick={() => handleDeleteCategory(category.name)}
                    className="absolute -right-1 -top-1 hidden rounded-full bg-rose-500 p-0.5 text-white group-hover:block"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Category Value Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-slate-100">
                <p className="text-sm text-slate-600">{cat.name}</p>
                <p className="text-xl font-bold text-slate-900">${cat.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{cat.itemCount} products</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory List Section */}
      <div className="rounded-2xl border border-slate-200/50 bg-white ">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Inventory List</h3>
              <p className="text-sm text-slate-500">Complete product catalog with stock levels</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddProduct(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 "
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                <th className="px-6 py-4 font-semibold text-slate-600">SKU</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Available</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Reorder Point</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Location</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const status = item.available <= item.reorderPoint * 0.5 ? "Critical" 
                              : item.available <= item.reorderPoint ? "Low Stock" 
                              : "Good Stock";
                const statusConfig = status === "Good Stock" 
                  ? { bg: "from-emerald-500 to-teal-500", text: "text-emerald-700", bgLight: "bg-emerald-50" }
                  : status === "Low Stock" 
                    ? { bg: "from-amber-500 to-orange-500", text: "text-amber-700", bgLight: "bg-amber-50" }
                    : { bg: "from-rose-500 to-red-500", text: "text-rose-700", bgLight: "bg-rose-50" };
                
                return (
                  <tr key={item.id} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.available <= item.reorderPoint ? "text-rose-600" : "text-slate-900"}`}>
                          {item.available}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStock(item.id, item.available - 1)}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs hover:bg-slate-200 transition"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateStock(item.id, item.available + 1)}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs hover:bg-slate-200 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.reorderPoint}</td>
                    <td className="px-6 py-4 text-slate-600">{item.location}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusConfig.bgLight} ${statusConfig.text}`}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${statusConfig.bg}`} />
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(item)}
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id, item.category)}
                          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition"
                          title="Delete"
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
        
        {filteredInventory.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No products found matching your criteria
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white ">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">SKU *</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Available Quantity</label>
                  <input
                    type="number"
                    value={newProduct.available}
                    onChange={(e) => setNewProduct({ ...newProduct, available: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Reorder Point</label>
                  <input
                    type="number"
                    value={newProduct.reorderPoint}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="$0.00"
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    placeholder="A-00"
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700"
              >
                {editingProduct ? "Update" : "Add"} Product
              </button>
              <button
                onClick={resetForm}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white ">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Add New Category</h3>
                <button onClick={() => setShowAddCategory(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="mb-1 block text-sm font-medium text-slate-700">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Electronics"
              />
            </div>
            <div className="border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={handleAddCategory}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700"
              >
                Add Category
              </button>
              <button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}