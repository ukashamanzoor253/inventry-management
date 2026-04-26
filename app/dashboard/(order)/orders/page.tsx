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
  Eye,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Printer,
  RefreshCw,
  Download
} from "lucide-react";
import Link from "next/link";

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
  type: string;
  supplier: { id: string; name: string; email: string; phone: string; address: string } | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  orderDate: string;
  expectedDate: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  notes?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  deliveryMethod?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append('status', statusFilter.toUpperCase());
      if (typeFilter !== "all") params.append('type', typeFilter);
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, typeFilter]);

  // Generate PDF for purchase order
  const generatePurchaseOrderPDF = async (order: Order) => {
    try {
      setDownloading(order.id);
      
      // Dynamic import for html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create a temporary div for the PDF content
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Purchase Order ${order.orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #10b981;
            }
            .header h1 {
              color: #10b981;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0 0;
              color: #666;
            }
            .order-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f5f5f5;
              border-radius: 8px;
            }
            .info-section {
              flex: 1;
            }
            .info-section h3 {
              margin: 0 0 10px;
              font-size: 16px;
              color: #10b981;
            }
            .info-section p {
              margin: 5px 0;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .totals {
              width: 300px;
              margin-left: auto;
              margin-bottom: 30px;
            }
            .totals table {
              width: 100%;
            }
            .totals td {
              border: none;
              padding: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              background: #fbbf24;
              color: #000;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PURCHASE ORDER</h1>
            <p>${order.orderNumber}</p>
          </div>
          
          <div class="order-info">
            <div class="info-section">
              <h3>Supplier Information</h3>
              <p><strong>${order.supplier?.name || 'N/A'}</strong></p>
              <p>${order.supplier?.email || 'N/A'}</p>
              <p>${order.supplier?.phone || 'N/A'}</p>
              <p>${order.supplier?.address || 'N/A'}</p>
            </div>
            <div class="info-section">
              <h3>Order Details</h3>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
              <p><strong>Expected Date:</strong> ${new Date(order.expectedDate).toLocaleDateString()}</p>
              <p><strong>Priority:</strong> <span class="status">${order.priority.toUpperCase()}</span></p>
              <p><strong>Delivery Method:</strong> ${order.deliveryMethod || 'Pickup'}</p>
            </div>
          </div>
          
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName}</td>
                  <td>${item.sku}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toLocaleString()}</td>
                  <td>$${item.totalPrice.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <table>
              <tr><td><strong>Subtotal:</strong></td><td align="right">$${order.subtotal.toLocaleString()}</td></tr>
              <tr><td><strong>Tax (10%):</strong></td><td align="right">$${order.tax.toLocaleString()}</td></tr>
              <tr><td><strong>Shipping:</strong></td><td align="right">$${order.shipping.toLocaleString()}</td></tr>
              <tr style="border-top: 2px solid #ddd;"><td><strong>Total:</strong></td><td align="right"><strong>$${order.totalAmount.toLocaleString()}</strong></td></tr>
            </table>
          </div>
          
          ${order.notes ? `
            <div style="margin-bottom: 30px;">
              <h3>Notes</h3>
              <p>${order.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
        </html>
      `;
      
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '-9999px';
      document.body.appendChild(pdfContent);
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Purchase_Order_${order.orderNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(pdfContent).save();
      document.body.removeChild(pdfContent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      await fetchOrders();
      setShowOrderModal(false);
      setShowReceiveModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700",
      processing: "bg-blue-100 text-blue-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-rose-100 text-rose-700",
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order.supplier?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    processingOrders: orders.filter(o => o.status === "processing").length,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const summaryCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-blue-500 to-blue-600", trend: "+12%", trendUp: true },
    { label: "Pending", value: stats.pendingOrders, icon: Clock, color: "from-amber-500 to-amber-600", trend: "+3%", trendUp: false },
    { label: "Processing", value: stats.processingOrders, icon: Truck, color: "from-purple-500 to-purple-600", trend: "+8%", trendUp: true },
    { label: "Completed", value: stats.completedOrders, icon: CheckCircle, color: "from-emerald-500 to-emerald-600", trend: "+15%", trendUp: true },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-red-400 to-pink-300 p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-[1900px]" />
        <div className="relative">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest">Orders</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Order Management</h1>
              <p className="mt-2">Track and manage all your orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs">Total Orders</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
                <p className="text-xs">Total Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-4 translate-x-4 rounded-full bg-linear-to-br ${card.color} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${card.color}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm font-semibold text-slate-700">{card.label}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by order number, supplier, or customer..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-pink-500" />
          </div>
          <div className="flex gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-pink-500">
              <option value="all">All Types</option>
              <option value="online">Online Orders</option>
              <option value="shop">Shop Orders</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-pink-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-pink-500">
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={fetchOrders} className="rounded-xl border border-slate-200 px-4 py-2.5 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link href="/dashboard/createorder"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Create Order
            </Link>
          </div>
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
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Order #</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Supplier/Customer</th>
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
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {order.type === 'online' ? 'Online' : 'Shop'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {order.type === 'online' ? order.customerName : order.supplier?.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(order.expectedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-600">{order.items.length} items</td>
                  <td className="px-6 py-4 font-semibold">${order.totalAmount.toLocaleString()}</td>
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
                      <button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {order.type === 'shop' && (
                        <button onClick={() => generatePurchaseOrderPDF(order)} 
                          disabled={downloading === order.id}
                          className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-50 disabled:opacity-50" 
                          title="Download Purchase Order">
                          {downloading === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        </button>
                      )}
                      {order.status === "pending" && (
                        <button onClick={() => handleUpdateStatus(order.id, 'processing')}
                          className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50" title="Process Order">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {order.status === "processing" && order.type === 'shop' && (
                        <button onClick={() => { setSelectedOrder(order); setShowReceiveModal(true); }}
                          className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-50" title="Receive Order">
                          <Package className="h-4 w-4" />
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
          <div className="p-8 text-center text-slate-500">No orders found matching your criteria</div>
        )}
      </div>

      {/* Order Details Modal - Same as before */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Order Details</h3>
                  <p className="text-sm text-slate-500">{selectedOrder.orderNumber}</p>
                </div>
                <button onClick={() => setShowOrderModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Status Timeline */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {["pending", "processing", "completed"].map((step, index) => {
                    const statuses = ["pending", "processing", "completed"];
                    const currentIndex = statuses.indexOf(selectedOrder.status);
                    const isCompleted = index <= currentIndex;
                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div className="relative flex flex-col items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isCompleted ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                          }`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                          </div>
                          <p className="mt-2 text-xs font-medium text-slate-600 capitalize">{step}</p>
                        </div>
                        {index < 2 && <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" />
                    {selectedOrder.type === 'online' ? 'Customer Information' : 'Supplier Information'}
                  </h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">
                        {selectedOrder.type === 'online' ? selectedOrder.customerName : selectedOrder.supplier?.name}
                      </p>
                      {selectedOrder.type === 'online' ? (
                        <>
                          <p className="flex items-center gap-2 text-slate-600"><Mail className="h-3 w-3" />{selectedOrder.customerEmail}</p>
                          <p className="flex items-center gap-2 text-slate-600"><Phone className="h-3 w-3" />{selectedOrder.customerPhone}</p>
                          <p className="flex items-center gap-2 text-slate-600"><MapPin className="h-3 w-3" />{selectedOrder.customerAddress}</p>
                        </>
                      ) : (
                        <>
                          <p className="flex items-center gap-2 text-slate-600"><Mail className="h-3 w-3" />{selectedOrder.supplier?.email}</p>
                          <p className="flex items-center gap-2 text-slate-600"><Phone className="h-3 w-3" />{selectedOrder.supplier?.phone}</p>
                          <p className="flex items-center gap-2 text-slate-600"><MapPin className="h-3 w-3" />{selectedOrder.supplier?.address}</p>
                        </>
                      )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4" />Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Order Date:</span><span className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Expected Date:</span><span className="font-medium">{new Date(selectedOrder.expectedDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Priority:</span><span className={`font-medium capitalize ${selectedOrder.priority === 'high' ? 'text-rose-600' : selectedOrder.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>{selectedOrder.priority}</span></div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="mb-3 font-semibold">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-left">SKU</th><th className="px-4 py-2 text-right">Quantity</th><th className="px-4 py-2 text-right">Unit Price</th><th className="px-4 py-2 text-right">Total</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 font-medium">{item.productName}</td>
                          <td className="px-4 py-2 text-slate-600">{item.sku}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200">
                      <tr><td colSpan={4} className="px-4 py-2 text-right font-medium">Subtotal:</td><td className="px-4 py-2 text-right">${selectedOrder.subtotal.toLocaleString()}</td></tr>
                      <tr><td colSpan={4} className="px-4 py-2 text-right">Tax (10%):</td><td className="px-4 py-2 text-right">${selectedOrder.tax.toLocaleString()}</td></tr>
                      <tr><td colSpan={4} className="px-4 py-2 text-right">Shipping:</td><td className="px-4 py-2 text-right">${selectedOrder.shipping.toLocaleString()}</td></tr>
                      <tr className="border-t border-slate-200"><td colSpan={4} className="px-4 py-2 text-right font-bold">Total:</td><td className="px-4 py-2 text-right font-bold text-emerald-600">${selectedOrder.totalAmount.toLocaleString()}</td></tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm text-slate-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowOrderModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50">Close</button>
                {selectedOrder.type === 'shop' && (
                  <button onClick={() => generatePurchaseOrderPDF(selectedOrder)} 
                    disabled={downloading === selectedOrder.id}
                    className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 disabled:opacity-50">
                    {downloading === selectedOrder.id ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : <Download className="h-4 w-4 inline mr-2" />}
                    Download PO
                  </button>
                )}
                {selectedOrder.status === "pending" && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')} disabled={updating}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                    {updating ? <Loader2 className="h-4 w-4 animate-spin inline" /> : <CheckCircle className="h-4 w-4 inline mr-2" />}
                    Process Order
                  </button>
                )}
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
              <h3 className="text-xl font-semibold">Receive Order</h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800">You are about to receive order <strong>{selectedOrder.orderNumber}</strong></p>
                <p className="mt-1 text-xs text-emerald-600">This will update inventory levels for all items in this order.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Items to receive:</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm"><span>{item.productName}</span><span className="font-semibold">x{item.quantity}</span></div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')} disabled={updating}
                className="flex-1 rounded-xl bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {updating ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Confirm Receive'}
              </button>
              <button onClick={() => setShowReceiveModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2 font-semibold hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}