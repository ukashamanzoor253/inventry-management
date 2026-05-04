"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroHeader from "@/components/ui/HeroHeader";
import {
  Search,
  Eye,
  Trash2,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  DollarSign
} from "lucide-react";

// Types
interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  type: 'online' | 'shop';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  supplier?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw, label: 'Processing' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelled' }
  };
  const { bg, text, icon: Icon, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

// Order Type Badge
const OrderTypeBadge = ({ type }: { type: Order['type'] }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      type === 'online' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
    }`}>
      {type === 'online' ? 'Online' : 'Shop'}
    </span>
  );
};

// Main Component
export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete order');
      
      await fetchOrders();
      setShowDeleteConfirm(false);
      setShowDetailsModal(false);
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesSearch;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <HeroHeader
        badge="Order Management"
        title="Orders"
        subtitle="Manage and track all your orders in one place"
        actions={
          <button
            onClick={() => router.push("/dashboard/orders/create")}
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            <Package className="h-4 w-4" />
            New Order
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6  border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6  border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6  border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6  border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order number, customer, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <p className="text-sm text-rose-800">{error}</p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200/50 bg-white  overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm ? "Try adjusting your search" : "Create your first order to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/dashboard/orders/create')}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Order
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Order #</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Customer/Supplier</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Total</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <OrderTypeBadge type={order.type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {order.type === 'online' ? order.customerName : order.supplier}
                      </div>
                      {order.type === 'online' && order.customerEmail && (
                        <div className="text-xs text-slate-500">{order.customerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          title="Delete Order"
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

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
                <p className="text-sm text-slate-500">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Order Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-500">Type:</span> <OrderTypeBadge type={selectedOrder.type} /></p>
                    <p><span className="text-slate-500">Status:</span> <StatusBadge status={selectedOrder.status} /></p>
                    <p><span className="text-slate-500">Created:</span> {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">
                    {selectedOrder.type === 'online' ? 'Customer Information' : 'Supplier Information'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    {selectedOrder.type === 'online' ? (
                      <>
                        <p><span className="text-slate-500">Name:</span> {selectedOrder.customerName}</p>
                        {selectedOrder.customerEmail && (
                          <p><span className="text-slate-500">Email:</span> {selectedOrder.customerEmail}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p><span className="text-slate-500">Supplier:</span> {selectedOrder.supplier}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Items */}
              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Order Items</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">SKU</th>
                        <th className="px-4 py-2 text-right">Quantity</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 font-medium">{item.productName}</td>
                          <td className="px-4 py-2 font-mono text-xs">{item.sku}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Total */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total Amount:</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Delete Order</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete order {selectedOrder.orderNumber}? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteOrder}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}