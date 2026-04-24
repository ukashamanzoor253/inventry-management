"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Send,
  Download,
  Printer,
  MoreVertical,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Types
interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  orderDate: string;
  expectedDate: string;
  receivedDate?: string;
  status: "draft" | "pending" | "approved" | "shipped" | "received" | "cancelled" | "rejected";
  priority: "high" | "medium" | "low";
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  receivedBy?: string;
  trackingNumber?: string;
}

// Mock Data
const mockSuppliers = [
  { id: "sup1", name: "TechDistro Inc", email: "orders@techdistro.com", phone: "+1 (555) 123-4567", address: "123 Tech Street, Silicon Valley, CA 94025", contactPerson: "John Smith", paymentTerms: "Net 30", leadTime: 5, rating: 4.8, status: "active" },
  { id: "sup2", name: "Packaging Pro", email: "sales@packagingpro.com", phone: "+1 (555) 234-5678", address: "456 Industry Ave, Chicago, IL 60607", contactPerson: "Sarah Johnson", paymentTerms: "Net 15", leadTime: 3, rating: 4.5, status: "active" },
  { id: "sup3", name: "LogiSupply Co", email: "info@logisupply.com", phone: "+1 (555) 345-6789", address: "789 Logistics Blvd, Dallas, TX 75201", contactPerson: "Mike Wilson", paymentTerms: "Net 45", leadTime: 7, rating: 4.2, status: "active" },
];

const mockInventory = [
  { id: 1, name: "Wireless Barcode Scanner", sku: "WS-3381", price: 249.99, category: "Electronics", available: 184 },
  { id: 2, name: "Packaging Tape", sku: "PK-9108", price: 12.99, category: "Supplies", available: 24 },
  { id: 3, name: "Storage Bin", sku: "SB-7204", price: 34.99, category: "Logistics", available: 312 },
  { id: 4, name: "Thermal Labels", sku: "TL-3320", price: 8.99, category: "Supplies", available: 9 },
  { id: 5, name: "Pallet Jack", sku: "PJ-1109", price: 599.99, category: "Equipment", available: 14 },
];

const initialOrders: PurchaseOrder[] = [
  {
    id: "1",
    orderNumber: "PO-2024-001",
    supplier: mockSuppliers[0],
    items: [
      { id: "item1", productId: 1, productName: "Wireless Barcode Scanner", sku: "WS-3381", quantity: 50, unitPrice: 249.99, totalPrice: 12499.50 }
    ],
    orderDate: "2024-01-15",
    expectedDate: "2024-01-25",
    status: "pending",
    priority: "high",
    subtotal: 12499.50,
    tax: 1249.95,
    shipping: 150.00,
    totalAmount: 13899.45,
    notes: "Urgent requirement for warehouse operations",
  },
  {
    id: "2",
    orderNumber: "PO-2024-002",
    supplier: mockSuppliers[1],
    items: [
      { id: "item2", productId: 2, productName: "Packaging Tape", sku: "PK-9108", quantity: 200, unitPrice: 12.99, totalPrice: 2598.00 }
    ],
    orderDate: "2024-01-16",
    expectedDate: "2024-01-28",
    status: "pending",
    priority: "medium",
    subtotal: 2598.00,
    tax: 259.80,
    shipping: 75.00,
    totalAmount: 2932.80,
  },
  {
    id: "3",
    orderNumber: "PO-2024-003",
    supplier: mockSuppliers[2],
    items: [
      { id: "item3", productId: 3, productName: "Storage Bin", sku: "SB-7204", quantity: 100, unitPrice: 34.99, totalPrice: 3499.00 }
    ],
    orderDate: "2024-01-10",
    expectedDate: "2024-01-30",
    status: "approved",
    priority: "high",
    subtotal: 3499.00,
    tax: 349.90,
    shipping: 200.00,
    totalAmount: 4048.90,
    approvedBy: "Admin User",
    approvedDate: "2024-01-12",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [newOrder, setNewOrder] = useState({
    supplierId: "",
    items: [] as OrderItem[],
    expectedDate: "",
    priority: "medium" as "high" | "medium" | "low",
    notes: "",
  });

  // Stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    approvedOrders: orders.filter(o => o.status === "approved").length,
    receivedOrders: orders.filter(o => o.status === "received").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    averageLeadTime: 8, // Mock value
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-700",
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      received: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-rose-100 text-rose-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-rose-100 text-rose-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-blue-100 text-blue-700",
    };
    return colors[priority as keyof typeof colors];
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: "approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleReceiveOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === "approved") {
      setShowReceiveModal(true);
      setSelectedOrder(order);
    }
  };

  const confirmReceive = () => {
    if (selectedOrder) {
      // Update inventory would happen here
      setOrders(orders.map(order =>
        order.id === selectedOrder.id
          ? { ...order, status: "received", receivedDate: new Date().toISOString().split('T')[0], receivedBy: "Current User" }
          : order
      ));
      setShowReceiveModal(false);
      setSelectedOrder(null);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      ));
    }
  };

  const handleShipOrder = (orderId: string) => {
    const tracking = prompt("Enter tracking number:");
    if (tracking) {
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: "shipped", trackingNumber: tracking }
          : order
      ));
    }
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
              <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">Procurement</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Purchase Orders</h1>
              <p className="mt-2 text-slate-300">Create, track, and manage all your purchase orders</p>
            </div>
            <Link
              href="/createorder"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Create Order
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalOrders}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Total Orders</p>
          <p className="text-xs text-slate-400">All time purchases</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Pending Approval</p>
          <p className="text-xs text-slate-400">Awaiting your action</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.approvedOrders}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">In Transit</p>
          <p className="text-xs text-slate-400">Orders being processed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">${stats.totalValue.toLocaleString()}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Total Value</p>
          <p className="text-xs text-slate-400">Across all orders</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order number or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Order #</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Supplier</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Order Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Expected Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Items</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Total</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Priority</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{order.supplier.name}</td>
                  <td className="px-6 py-4 text-slate-600">{order.orderDate}</td>
                  <td className="px-6 py-4 text-slate-600">{order.expectedDate}</td>
                  <td className="px-6 py-4 text-slate-600">{order.items.length} items</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
                        <>
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-50"
                            title="Mark as Shipped"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReceiveOrder(order.id)}
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                            title="Receive"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleReceiveOrder(order.id)}
                          className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                          title="Receive"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No orders found matching your criteria
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Order Details</h3>
                  <p className="text-sm text-slate-500">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Order Status Timeline */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {["Order Created", "Approved", "Shipped", "Received"].map((step, index) => {
                    const statuses = ["pending", "approved", "shipped", "received"];
                    const currentIndex = statuses.indexOf(selectedOrder.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div className="relative flex flex-col items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isCompleted ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                          } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                          </div>
                          <p className="mt-2 text-xs font-medium text-slate-600">{step}</p>
                          {isCompleted && index < statuses.length - 1 && (
                            <div className="absolute left-full top-5 h-0.5 w-full bg-emerald-200" />
                          )}
                        </div>
                        {index < 3 && <div className="flex-1 border-t border-slate-200" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Supplier Information */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                    <User className="h-4 w-4" />
                    Supplier Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-slate-900">{selectedOrder.supplier.name}</p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-3 w-3" />
                      {selectedOrder.supplier.email}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.supplier.phone}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3 w-3" />
                      {selectedOrder.supplier.address}
                    </p>
                  </div>
                </div>

                {/* Order Information */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                    <Calendar className="h-4 w-4" />
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Order Date:</span>
                      <span className="font-medium text-slate-900">{selectedOrder.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Expected Date:</span>
                      <span className="font-medium text-slate-900">{selectedOrder.expectedDate}</span>
                    </div>
                    {selectedOrder.receivedDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Received Date:</span>
                        <span className="font-medium text-emerald-600">{selectedOrder.receivedDate}</span>
                      </div>
                    )}
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tracking #:</span>
                        <span className="font-medium text-blue-600">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="mb-3 font-semibold text-slate-900">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-600">Product</th>
                        <th className="px-4 py-2 text-left text-slate-600">SKU</th>
                        <th className="px-4 py-2 text-right text-slate-600">Quantity</th>
                        <th className="px-4 py-2 text-right text-slate-600">Unit Price</th>
                        <th className="px-4 py-2 text-right text-slate-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 font-medium text-slate-900">{item.productName}</td>
                          <td className="px-4 py-2 text-slate-600">{item.sku}</td>
                          <td className="px-4 py-2 text-right text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-slate-600">${item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right font-medium text-slate-900">${item.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200">
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right font-medium text-slate-600">Subtotal:</td>
                        <td className="px-4 py-2 text-right font-medium text-slate-900">${selectedOrder.subtotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right text-slate-600">Tax:</td>
                        <td className="px-4 py-2 text-right text-slate-900">${selectedOrder.tax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right text-slate-600">Shipping:</td>
                        <td className="px-4 py-2 text-right text-slate-900">${selectedOrder.shipping.toLocaleString()}</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td colSpan={4} className="px-4 py-2 text-right font-bold text-slate-900">Total:</td>
                        <td className="px-4 py-2 text-right font-bold text-emerald-600">${selectedOrder.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Notes:</p>
                  <p className="text-sm text-slate-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveOrder(selectedOrder.id);
                        setShowOrderModal(false);
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Approve Order
                    </button>
                    <button
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id);
                        setShowOrderModal(false);
                      }}
                      className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                {(selectedOrder.status === "approved" || selectedOrder.status === "shipped") && (
                  <button
                    onClick={() => {
                      handleReceiveOrder(selectedOrder.id);
                      setShowOrderModal(false);
                    }}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Receive Order
                  </button>
                )}
                <button className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Printer className="mr-2 inline h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Order Modal */}
      {showReceiveModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Receive Order</h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800">
                  You are about to receive order <strong>{selectedOrder.orderNumber}</strong>
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  This will update inventory levels for all items in this order.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Items to receive:</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productName}</span>
                    <span className="font-semibold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmReceive}
                className="flex-1 rounded-xl bg-emerald-600 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Confirm Receive
              </button>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
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