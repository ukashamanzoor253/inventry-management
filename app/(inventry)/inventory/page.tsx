"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  DollarSign,
} from "lucide-react";

// Types
interface PurchaseOrder {
  id: string;
  supplier: string;
  product: string;
  quantity: number;
  expectedDate: string;
  status: "pending" | "approved" | "received" | "cancelled";
  priority: "high" | "medium" | "low";
  totalAmount: string;
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  available: number;
  pending: number;
  reorderPoint: number;
  status: string;
  price: string;
  location: string;
}

// Initial Data
const initialPurchaseOrders: PurchaseOrder[] = [
  { id: "PO-001", supplier: "TechDistro Inc", product: "Wireless Barcode Scanner", quantity: 50, expectedDate: "2024-01-25", status: "pending", priority: "high", totalAmount: "$12,450" },
  { id: "PO-002", supplier: "Packaging Pro", product: "Packaging Tape (Case)", quantity: 200, expectedDate: "2024-01-28", status: "pending", priority: "medium", totalAmount: "$2,598" },
  { id: "PO-003", supplier: "LogiSupply Co", product: "Storage Bin - Large", quantity: 100, expectedDate: "2024-01-30", status: "approved", priority: "high", totalAmount: "$3,450" },
  { id: "PO-004", supplier: "LabelMasters", product: "Thermal Labels (1000pk)", quantity: 30, expectedDate: "2024-02-01", status: "pending", priority: "high", totalAmount: "$1,470" },
  { id: "PO-005", supplier: "EquipDirect", product: "Pallet Jack", quantity: 5, expectedDate: "2024-02-05", status: "approved", priority: "medium", totalAmount: "$2,995" },
];

const initialInventory: InventoryItem[] = [
  { id: 1, name: "Wireless Barcode Scanner", sku: "WS-3381", category: "Electronics", available: 184, pending: 50, reorderPoint: 50, status: "Good stock", price: "$249.99", location: "A-12" },
  { id: 2, name: "Packaging Tape", sku: "PK-9108", category: "Supplies", available: 24, pending: 200, reorderPoint: 100, status: "Low stock", price: "$12.99", location: "B-05" },
  { id: 3, name: "Storage Bin", sku: "SB-7204", category: "Logistics", available: 312, pending: 100, reorderPoint: 50, status: "Good stock", price: "$34.99", location: "C-08" },
  { id: 4, name: "Thermal Labels", sku: "TL-3320", category: "Supplies", available: 9, pending: 30, reorderPoint: 25, status: "Critical", price: "$8.99", location: "B-12" },
  { id: 5, name: "Pallet Jack", sku: "PJ-1109", category: "Equipment", available: 14, pending: 5, reorderPoint: 10, status: "Low stock", price: "$599.99", location: "D-03" },
];

const categories = ["Electronics", "Supplies", "Logistics", "Equipment"];
const suppliers = ["TechDistro Inc", "Packaging Pro", "LogiSupply Co", "LabelMasters", "EquipDirect"];

export default function InventoryPage() {
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"overview" | "pending" | "inventory">("overview");

  const [newPO, setNewPO] = useState({
    supplier: "",
    product: "",
    quantity: 0,
    expectedDate: "",
    priority: "medium" as "high" | "medium" | "low"
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    available: 0,
    reorderPoint: 0,
    price: "",
    location: ""
  });

  const [newCategory, setNewCategory] = useState({ name: "" });

  // Filter pending orders
  const pendingOrders = purchaseOrders.filter(po => po.status === "pending");
  const approvedOrders = purchaseOrders.filter(po => po.status === "approved");

  // Calculate metrics
  const totalPendingItems = purchaseOrders
    .filter(po => po.status === "pending")
    .reduce((sum, po) => sum + po.quantity, 0);

  const totalApprovedItems = purchaseOrders
    .filter(po => po.status === "approved")
    .reduce((sum, po) => sum + po.quantity, 0);

  const lowStockItems = inventory.filter(item => item.status !== "Good stock");
  const totalInventoryValue = inventory.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]/g, ''));
    return sum + (price * item.available);
  }, 0);

  const pendingInventoryValue = purchaseOrders
    .filter(po => po.status === "pending")
    .reduce((sum, po) => {
      const amount = parseFloat(po.totalAmount.replace(/[^0-9.-]/g, ''));
      return sum + amount;
    }, 0);

  const handleApproveOrder = (id: string) => {
    setPurchaseOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, status: "approved" } : order
      )
    );
  };

  const handleReceiveOrder = (id: string) => {
    const order = purchaseOrders.find(o => o.id === id);
    if (order && order.status === "approved") {
      // Update inventory
      setInventory(items =>
        items.map(item =>
          item.name === order.product
            ? { ...item, available: item.available + order.quantity, pending: 0 }
            : item
        )
      );
      // Update order status
      setPurchaseOrders(orders =>
        orders.map(o =>
          o.id === id ? { ...o, status: "received" } : o
        )
      );
    }
  };

  const handleCancelOrder = (id: string) => {
    setPurchaseOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, status: "cancelled" } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-8 translate-y-8 rounded-full bg-emerald-500/10 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
        <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">Inventory Control</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Inventory Management</h1>
              <p className="mt-2 text-slate-300">Track stock, manage purchase orders & monitor pending items</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{totalPendingItems}</p>
                <p className="text-xs text-slate-400">Pending Items</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">${totalInventoryValue.toFixed(1)}K</p>
                <p className="text-xs text-slate-400">Inventory Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{pendingOrders.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Pending Orders</p>
          <p className="text-xs text-slate-400">{totalPendingItems} items waiting</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{approvedOrders.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Approved Orders</p>
          <p className="text-xs text-slate-400">{totalApprovedItems} items incoming</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{lowStockItems.length}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Low Stock Alert</p>
          <p className="text-xs text-slate-400">Items need reorder</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">${pendingInventoryValue.toFixed(1)}K</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Pending Value</p>
          <p className="text-xs text-slate-400">Awaiting approval</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setSelectedTab("overview")}
          className={`px-5 py-2.5 text-sm font-semibold transition-all ${selectedTab === "overview"
            ? "border-b-2 border-emerald-500 text-emerald-600"
            : "text-slate-500 hover:text-slate-700"
            }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab("pending")}
          className={`px-5 py-2.5 text-sm font-semibold transition-all ${selectedTab === "pending"
            ? "border-b-2 border-emerald-500 text-emerald-600"
            : "text-slate-500 hover:text-slate-700"
            }`}
        >
          Pending Orders
          {pendingOrders.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              {pendingOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSelectedTab("inventory")}
          className={`px-5 py-2.5 text-sm font-semibold transition-all ${selectedTab === "inventory"
            ? "border-b-2 border-emerald-500 text-emerald-600"
            : "text-slate-500 hover:text-slate-700"
            }`}
        >
          Inventory List
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Pending Orders */}
          <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Pending Purchase Orders</h3>
                  <p className="text-sm text-slate-500">Orders awaiting your approval</p>
                </div>
                <button
                  onClick={() => setSelectedTab("pending")}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View all →
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-5 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-900">{order.id}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${order.priority === "high" ? "bg-rose-100 text-rose-700" :
                          order.priority === "medium" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                          {order.priority} priority
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{order.product} from {order.supplier}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>Qty: {order.quantity}</span>
                        <span>Expected: {order.expectedDate}</span>
                        <span>Amount: {order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No pending orders
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-slate-900">Low Stock Items</h3>
              </div>
              <p className="text-sm text-slate-500">Items that need immediate attention</p>
            </div>
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.sku} · {item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-rose-600">{item.available}</p>
                      <p className="text-xs text-slate-400">Available</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Stock level</span>
                      <span>{Math.round((item.available / item.reorderPoint) * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-rose-500"
                        style={{ width: `${Math.min((item.available / item.reorderPoint) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Reorder point: {item.reorderPoint} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders Tab */}
      {selectedTab === "pending" && (
        <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">All Purchase Orders</h3>
                <p className="text-sm text-slate-500">Manage and track your purchase requests</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Order ID</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Supplier</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Quantity</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Total</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Priority</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.supplier}</td>
                    <td className="px-6 py-4 text-slate-600">{order.product}</td>
                    <td className="px-6 py-4 text-slate-600">{order.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${order.status === "pending" ? "bg-amber-100 text-amber-700" :
                        order.status === "approved" ? "bg-blue-100 text-blue-700" :
                          order.status === "received" ? "bg-emerald-100 text-emerald-700" :
                            "bg-rose-100 text-rose-700"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${order.priority === "high" ? "bg-rose-100 text-rose-700" :
                        order.priority === "medium" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {order.status === "approved" && (
                          <button
                            onClick={() => handleReceiveOrder(order.id)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                            title="Mark as Received"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {selectedTab === "inventory" && (
        <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Inventory List</h3>
                <p className="text-sm text-slate-500">Complete product catalog with stock levels</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Product</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">SKU</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Category</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Available</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Pending</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Location</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Price</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.available}</td>
                    <td className="px-6 py-4 text-amber-600">{item.pending}</td>
                    <td className="px-6 py-4 text-slate-600">{item.location}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${item.status === "Good stock" ? "bg-emerald-100 text-emerald-700" :
                        item.status === "Critical" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}




    </div>
  );
}