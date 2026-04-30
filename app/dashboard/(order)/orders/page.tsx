"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Loader2,
  AlertCircle,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MoreVertical
} from "lucide-react";

// Types
interface OrderItem {
  id: string;
  productId: string;
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
  priority: 'low' | 'medium' | 'high';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  supplier?: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  createdAt: string;
  expectedDate: string;
  notes?: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
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

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Order['priority'] }) => {
  const config = {
    low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' }
  };
  const { bg, text, label } = config[priority];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
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
      {type === 'online' ? <Users className="h-3 w-3" /> : <Package className="h-3 w-3" />}
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (ordersData: Order[]) => {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    const totalRevenue = ordersData
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    setStats({ totalOrders, pendingOrders, completedOrders, totalRevenue });
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      // Refresh orders
      await fetchOrders();
      
      // Update selected order if modal is open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
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
      console.error('Error deleting order:', err);
      setError('Failed to delete order');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-[1900px]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest">Order Management</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Orders</h1>
              <p className="mt-2">Manage and track all your orders in one place</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/orders/create')}
              className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 font-semibold backdrop-blur-sm transition hover:bg-white/20"
            >
              <Package className="h-4 w-4" />
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order number, customer, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="online">Online Orders</option>
            <option value="shop">Shop Orders</option>
          </select>
          
          <button
            onClick={fetchOrders}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
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
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? "Try adjusting your filters"
                : "Create your first order to get started"}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={() => router.push('/dashboard/orders/create')}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
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
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Expected</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Priority</th>
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
                        {order.type === 'online' ? order.customerName : order.supplier?.name}
                      </div>
                      {order.type === 'online' && order.customerEmail && (
                        <div className="text-xs text-slate-500">{order.customerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(order.expectedDate)}
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={order.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        {order.status === 'pending' && (
                          <select
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            value={order.status}
                            disabled={updatingStatus === order.id}
                            className="text-xs rounded border border-slate-200 px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
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
                    <p><span className="text-slate-500">Priority:</span> <PriorityBadge priority={selectedOrder.priority} /></p>
                    <p><span className="text-slate-500">Created:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="text-slate-500">Expected:</span> {formatDate(selectedOrder.expectedDate)}</p>
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
                        <p><span className="text-slate-500">Email:</span> {selectedOrder.customerEmail}</p>
                        <p><span className="text-slate-500">Phone:</span> {selectedOrder.customerPhone}</p>
                      </>
                    ) : (
                      <>
                        <p><span className="text-slate-500">Supplier:</span> {selectedOrder.supplier?.name}</p>
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
              
              {/* Summary */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax (10%):</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                    <span>Total:</span>
                    <span className="text-lg text-emerald-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="rounded-lg bg-yellow-50 p-4">
                  <h3 className="mb-1 font-semibold text-yellow-900">Notes</h3>
                  <p className="text-sm text-yellow-800">{selectedOrder.notes}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
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