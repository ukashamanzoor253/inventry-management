"use client";

import { useState } from "react";
import { 
  Package, 
  Plus, 
  X, 
  Tag,
  TrendingUp,
  Layers,
  Edit2,
  Trash2
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "Electronics", skus: 384, revenue: "$48.7K", color: "from-blue-500 to-blue-600", products: 156 },
  { id: 2, name: "Supplies", skus: 226, revenue: "$21.1K", color: "from-emerald-500 to-emerald-600", products: 89 },
  { id: 3, name: "Logistics", skus: 189, revenue: "$10.3K", color: "from-amber-500 to-amber-600", products: 72 },
  { id: 4, name: "Equipment", skus: 114, revenue: "$12.5K", color: "from-violet-500 to-violet-600", products: 45 },
  { id: 5, name: "Office Supplies", skus: 98, revenue: "$8.2K", color: "from-rose-500 to-rose-600", products: 38 },
  { id: 6, name: "Tools", skus: 76, revenue: "$15.4K", color: "from-cyan-500 to-cyan-600", products: 52 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", color: "from-blue-500 to-blue-600" });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        name: newCategory.name,
        skus: 0,
        revenue: "$0",
        color: newCategory.color,
        products: 0,
      };
      setCategories([...categories, category]);
      setNewCategory({ name: "", color: "from-blue-500 to-blue-600" });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
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
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Categories</h1>
              <p className="mt-2 text-slate-300">Manage and organize your product categories</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs text-slate-400">Total Categories</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">{categories.reduce((acc, c) => acc + c.skus, 0)}</p>
                <p className="text-xs text-slate-400">Total SKUs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Categories</h2>
          <p className="text-sm text-slate-500">{categories.length} categories · {categories.reduce((acc, c) => acc + c.skus, 0)} total SKUs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <article 
            key={category.id} 
            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-linear-to-br ${category.color} opacity-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-12 group-hover:-translate-y-44 group-hover:w-[700px] group-hover:h-[700px]`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${category.color}/10`}>
                  <Layers className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
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
                <span>{category.products} products</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Category Health */}
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
            <p className="text-2xl font-bold text-emerald-600">3</p>
            <p className="text-sm text-emerald-700">Healthy categories</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-2xl font-bold text-amber-600">2</p>
            <p className="text-sm text-amber-700">Needs attention</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-2xl font-bold text-rose-600">1</p>
            <p className="text-sm text-rose-700">Low stock alert</p>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                  <Tag className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Add New Category</h3>
                  <p className="text-sm text-slate-500">Create a new product category</p>
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
                <label className="block text-sm font-medium text-slate-700">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`h-10 w-full rounded-lg bg-linear-to-br ${color} transition-all ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : 'opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
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
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
