"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Truck,
  Calendar,
  Send,
  Save,
  Globe,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Loader2,
  AlertCircle,
  Download,
  X
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: { name: string };
  available: number;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderPDF {
  orderNumber: string;
  supplier: Supplier;
  items: OrderItem[];  // Fixed: Changed from Product to OrderItem[]
  orderDate: string;
  expectedDate: string;
  priority: string;
  deliveryMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  notes: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

type Priority = "low" | "medium" | "high";
type ShippingMethod = "standard" | "express" | "overnight";
type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "credit_card" | "debit_card" | "cash" | "bank_transfer";
type OrderType = "online" | "shop";

// Supplier Modal Component
interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierAdded: (supplier: Supplier) => void;
  onSupplierUpdated: (supplier: Supplier) => void;
  onSupplierDeleted: (supplierId: string) => void;
  editingSupplier?: Supplier | null;
}

function SupplierModal({ isOpen, onClose, onSupplierAdded, onSupplierUpdated,
  onSupplierDeleted,
  editingSupplier }: SupplierModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        email: editingSupplier.email,
        phone: editingSupplier.phone,
        address: editingSupplier.address
      });
    } else {
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setError('');
    setShowDeleteConfirm(false);
  }, [editingSupplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (editingSupplier) {
        response = await fetch(`/api/suppliers/${editingSupplier.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch('/api/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${editingSupplier ? 'update' : 'add'} supplier`);
      }

      const supplier: Supplier = await response.json();

      if (editingSupplier) {
        onSupplierUpdated(supplier);
      } else {
        onSupplierAdded(supplier);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!editingSupplier) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete supplier');
      }

      onSupplierDeleted(editingSupplier.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                Are you sure you want to delete {editingSupplier?.name}? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 p-2.5 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Supplier Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                placeholder="supplier@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                placeholder="Full address"
                rows={3}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {editingSupplier && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? (editingSupplier ? 'Updating...' : 'Adding...') : (editingSupplier ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Main Component
export default function CreateOrderPage() {
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showSupplierList, setShowSupplierList] = useState(false);

  const handleSupplierUpdated = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s =>
      s.id === updatedSupplier.id ? updatedSupplier : s
    ));
    if (shopFormData.supplierId === updatedSupplier.id) {
      setShopFormData({ ...shopFormData, supplierId: updatedSupplier.id });
    }
  };

  const handleSupplierDeleted = async (supplierId: string) => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));

      if (shopFormData.supplierId === supplierId) {
        setShopFormData((prev) => ({ ...prev, supplierId: "" }));
      }

    } catch (err) {
      console.error("Delete supplier error:", err);
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
    setShowSupplierList(false);
  };

  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setIsSupplierModalOpen(true);
    setShowSupplierList(false);
  };

  // Online Order State
  const [onlineFormData, setOnlineFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: ''
    } as CustomerInfo,
    expectedDate: "",
    priority: "medium" as Priority,
    notes: "",
    paymentMethod: "credit_card" as PaymentMethod,
    shippingMethod: "standard" as ShippingMethod,
  });

  // Shop Order State
  const [shopFormData, setShopFormData] = useState({
    supplierId: "",
    expectedDate: "",
    priority: "medium" as Priority,
    notes: "",
    deliveryMethod: "pickup" as DeliveryMethod,
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch products and suppliers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, suppliersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/suppliers')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const selectedSupplier = suppliers.find(s => s.id === shopFormData.supplierId);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1;

  const getShippingCost = () => {
    if (orderType === "online") {
      switch (onlineFormData.shippingMethod) {
        case "express": return 25;
        case "overnight": return 50;
        default: return 10;
      }
    }
    if (orderType === "shop" && shopFormData.deliveryMethod === "delivery") return 15;
    return 0;
  };

  const shipping = getShippingCost();
  const total = subtotal + tax + shipping;

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = items.find(i => i.productId === product.id);
    if (existingItem) {
      setItems(items.map(i =>
        i.productId === product.id
          ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.quantity + quantity) * i.unitPrice }
          : i
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      };
      setItems([...items, newItem]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
        : item
    ));
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    setShopFormData({ ...shopFormData, supplierId });
  };

  const handleSupplierAdded = (newSupplier: Supplier) => {
    setSuppliers(prev => [...prev, newSupplier]);
    setShopFormData({ ...shopFormData, supplierId: newSupplier.id });
  };

  // Generate PDF for purchase order
  const generatePurchaseOrderPDF = async (orderData: OrderPDF) => {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf: any = html2pdfModule.default || html2pdfModule;
    const pdfContent = document.createElement('div');

    const formatDate = (date: string | Date) =>
      new Date(date).toLocaleDateString();

    const safeNumber = (value: number | undefined | null) =>
      (value ?? 0).toLocaleString();

    pdfContent.innerHTML = `
    <div>
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
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .info-section h3 {
          color: #10b981;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
        }
        th {
          background: #f5f5f5;
        }
        .status {
          padding: 4px 10px;
          background: #fbbf24;
          border-radius: 20px;
          font-size: 12px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>

      <div class="header">
        <h1>PURCHASE ORDER</h1>
        <p>${orderData.orderNumber}</p>
      </div>

      <div class="order-info">
        <div class="info-section">
          <h3>Supplier</h3>
          <p><strong>${orderData.supplier?.name ?? ''}</strong></p>
          <p>${orderData.supplier?.email ?? ''}</p>
          <p>${orderData.supplier?.phone ?? ''}</p>
          <p>${orderData.supplier?.address ?? ''}</p>
        </div>

        <div class="info-section">
          <h3>Details</h3>
          <p><strong>Order Date:</strong> ${formatDate(orderData.orderDate)}</p>
          <p><strong>Expected:</strong> ${formatDate(orderData.expectedDate)}</p>
          <p><strong>Priority:</strong> 
            <span class="status">${orderData.priority?.toUpperCase()}</span>
          </p>
          <p><strong>Delivery:</strong> ${orderData.deliveryMethod ?? '-'}</p>
        </div>
      </div>

      <h3>Items</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items.map((item: OrderItem, i: number) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.productName}</td>
              <td>${item.sku}</td>
              <td>${item.quantity}</td>
              <td>$${safeNumber(item.unitPrice)}</td>
              <td>$${safeNumber(item.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 20px;">
        <p><strong>Subtotal:</strong> $${safeNumber(orderData.subtotal)}</p>
        <p><strong>Tax:</strong> $${safeNumber(orderData.tax)}</p>
        <p><strong>Shipping:</strong> $${safeNumber(orderData.shipping)}</p>
        <h3>Total: $${safeNumber(orderData.totalAmount)}</h3>
      </div>

      ${orderData.notes
        ? `<div><h3>Notes</h3><p>${orderData.notes}</p></div>`
        : ''
      }

      <div class="footer">
        <p>Computer generated document</p>
      </div>
    </div>
  `;

    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    document.body.appendChild(pdfContent);

    const opt = {
      margin: 0.5,
      filename: `Purchase_Order_${orderData.orderNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(pdfContent).save();
    } finally {
      if (document.body.contains(pdfContent)) {
        document.body.removeChild(pdfContent);
      }
    }
  };

  const handleSubmit = async (status: "draft" | "pending") => {
    if (items.length === 0) {
      setError("Please add at least one item to the order");
      return;
    }

    if (orderType === "online") {
      if (!onlineFormData.customer.name || !onlineFormData.customer.email || !onlineFormData.customer.address) {
        setError("Please fill in all customer information");
        return;
      }
      if (!onlineFormData.expectedDate) {
        setError("Please select expected delivery date");
        return;
      }
    }

    if (orderType === "shop") {
      if (!shopFormData.supplierId) {
        setError("Please select a supplier");
        return;
      }
      if (!shopFormData.expectedDate) {
        setError("Please select expected receipt date");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        type: orderType,
        expectedDate: orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate,
        priority: orderType === "online" ? onlineFormData.priority : shopFormData.priority,
        notes: orderType === "online" ? onlineFormData.notes : shopFormData.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        ...(orderType === "online" && {
          customer: onlineFormData.customer,
          paymentMethod: onlineFormData.paymentMethod,
          shippingMethod: onlineFormData.shippingMethod
        }),
        ...(orderType === "shop" && {
          supplierId: shopFormData.supplierId,
          deliveryMethod: shopFormData.deliveryMethod
        })
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const createdOrder = await response.json();
      
      const supplierForPDF: Supplier = selectedSupplier ?? {
        id: '',
        name: 'N/A',
        email: '',
        phone: '',
        address: ''
      };
      
      // For shop orders, download the purchase order PDF
      if (orderType === "shop") {
        const neworder: OrderPDF = {
          orderNumber: createdOrder.orderNumber,
          supplier: supplierForPDF,
          items: items,
          orderDate: new Date().toISOString(),
          expectedDate: shopFormData.expectedDate,
          priority: shopFormData.priority,
          deliveryMethod: shopFormData.deliveryMethod,
          subtotal: subtotal,
          tax: tax,
          shipping: shipping,
          totalAmount: total,
          notes: shopFormData.notes
        };
        await generatePurchaseOrderPDF(neworder);
      }

      router.push('/dashboard/orders');
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderTypeSelect = (type: OrderType) => {
    setOrderType(type);
    setItems([]);
    setSelectedProduct("");
    setQuantity(1);
    setError(null);
  };

  if (loading) {
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest">
                {orderType === "online" ? "Online Order" : "Shop Order"}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Create {orderType === "online" ? "Online" : "Shop"} Order
              </h1>
              <p className="mt-2">
                {orderType === "online"
                  ? "Process customer orders from your online store"
                  : "Create purchase orders for inventory restocking"}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              {orderType === "online" ? <Globe className="h-4 w-4" /> : <Store className="h-4 w-4" />}
              <span className="text-sm font-medium capitalize">{orderType} Order</span>
            </div>
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

      {/* Order Type Selection */}
      <div className="grid gap-6 md:grid-cols-2">
        <button
          onClick={() => handleOrderTypeSelect("online")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${orderType === "online"
            ? "border-emerald-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl"
            : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl"
          }`}
        >
          <div className="relative flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${orderType === "online" ? "bg-white/20" : "bg-gradient-to-br from-emerald-500 to-emerald-600"
              }`}>
              <Globe className={`h-7 w-7 ${orderType === "online" ? "text-white" : "text-white"}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${orderType === "online" ? "text-white" : "text-slate-900"}`}>
                Online Order
              </h3>
              <p className={`text-sm mt-1 ${orderType === "online" ? "text-white/80" : "text-slate-500"}`}>
                Customer orders from online store
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleOrderTypeSelect("shop")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${orderType === "shop"
            ? "border-emerald-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl"
            : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl"
          }`}
        >
          <div className="relative flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${orderType === "shop" ? "bg-white/20" : "bg-gradient-to-br from-blue-500 to-blue-600"
              }`}>
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${orderType === "shop" ? "text-white" : "text-slate-900"}`}>
                Shop Order
              </h3>
              <p className={`text-sm mt-1 ${orderType === "shop" ? "text-white/80" : "text-slate-500"}`}>
                Purchase orders for inventory
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          {orderType === "online" && (
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <User className="h-5 w-5 text-emerald-600" />
                Customer Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name *</label>
                  <input type="text" value={onlineFormData.customer.name || ""}
                    onChange={(e) => setOnlineFormData({
                      ...onlineFormData,
                      customer: { ...onlineFormData.customer, name: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                  <input type="email" value={onlineFormData.customer.email || ""}
                    onChange={(e) => setOnlineFormData({
                      ...onlineFormData,
                      customer: { ...onlineFormData.customer, email: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                    placeholder="customer@example.com" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
                  <input type="tel" value={onlineFormData.customer.phone || ""}
                    onChange={(e) => setOnlineFormData({
                      ...onlineFormData,
                      customer: { ...onlineFormData.customer, phone: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                    placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Address *</label>
                  <input type="text" value={onlineFormData.customer.address || ""}
                    onChange={(e) => setOnlineFormData({
                      ...onlineFormData,
                      customer: { ...onlineFormData.customer, address: e.target.value }
                    })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                    placeholder="123 Main St" />
                </div>
              </div>
            </div>
          )}

          {/* Supplier Information */}
          {orderType === "shop" && (
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Package className="h-5 w-5 text-emerald-600" />
                Supplier Information
              </h2>

              <div className="grid gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Supplier *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSupplierList(!showSupplierList)}
                        className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800"
                      >
                        {showSupplierList ? 'Hide List' : 'View All'}
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddSupplier}
                        className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add New
                      </button>
                    </div>
                  </div>

                  <select
                    value={shopFormData.supplierId}
                    onChange={handleSupplierChange}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Loading...' : 'Select supplier'}</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSupplier && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs text-slate-600">
                          Contact: {selectedSupplier.email}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Phone: {selectedSupplier.phone}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Address: {selectedSupplier.address}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditSupplier(selectedSupplier)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit supplier"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleSupplierDeleted(selectedSupplier.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete supplier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Supplier List Panel */}
                {showSupplierList && suppliers.length > 0 && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">All Suppliers</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {suppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${shopFormData.supplierId === supplier.id
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                        >
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                            setShopFormData({ ...shopFormData, supplierId: supplier.id });
                            setShowSupplierList(false);
                          }}>
                            <p className="text-sm font-medium text-slate-900">{supplier.name}</p>
                            <p className="text-xs text-slate-500 truncate">{supplier.email}</p>
                            <p className="text-xs text-slate-500 truncate">{supplier.phone}</p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSupplier(supplier);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this supplier?')) {
                                  handleSupplierDeleted(supplier.id);
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Supplier Modal */}
          <SupplierModal
            isOpen={isSupplierModalOpen}
            onClose={() => {
              setIsSupplierModalOpen(false);
              setEditingSupplier(null);
            }}
            onSupplierAdded={handleSupplierAdded}
            onSupplierUpdated={handleSupplierUpdated}
            onSupplierDeleted={handleSupplierDeleted}
            editingSupplier={editingSupplier}
          />

          {/* Order Details */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Expected {orderType === "online" ? "Delivery" : "Receipt"} Date *
                </label>
                <input type="date"
                  value={orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate}
                  onChange={(e) => orderType === "online"
                    ? setOnlineFormData({ ...onlineFormData, expectedDate: e.target.value })
                    : setShopFormData({ ...shopFormData, expectedDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                <select value={orderType === "online" ? onlineFormData.priority : shopFormData.priority}
                  onChange={(e) => orderType === "online"
                    ? setOnlineFormData({ ...onlineFormData, priority: e.target.value as Priority })
                    : setShopFormData({ ...shopFormData, priority: e.target.value as Priority })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {orderType === "online" && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
                    <select value={onlineFormData.paymentMethod}
                      onChange={(e) => setOnlineFormData({ ...onlineFormData, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500">
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Shipping Method</label>
                    <select value={onlineFormData.shippingMethod}
                      onChange={(e) => setOnlineFormData({ ...onlineFormData, shippingMethod: e.target.value as ShippingMethod })}
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500">
                      <option value="standard">Standard ($10)</option>
                      <option value="express">Express ($25)</option>
                      <option value="overnight">Overnight ($50)</option>
                    </select>
                  </div>
                </>
              )}
              {orderType === "shop" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Delivery Method</label>
                  <select value={shopFormData.deliveryMethod}
                    onChange={(e) => setShopFormData({ ...shopFormData, deliveryMethod: e.target.value as DeliveryMethod })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500">
                    <option value="pickup">Pickup (Free)</option>
                    <option value="delivery">Delivery ($15)</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
              <textarea rows={3}
                value={orderType === "online" ? onlineFormData.notes : shopFormData.notes}
                onChange={(e) => orderType === "online"
                  ? setOnlineFormData({ ...onlineFormData, notes: e.target.value })
                  : setShopFormData({ ...shopFormData, notes: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                placeholder={orderType === "online" ? "Special delivery instructions..." : "Purchase order notes..."} />
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Items</h2>

            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Product</label>
                  <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500">
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price} (Stock: {product.available})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Quantity</label>
                  <input type="number" min="1" value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleAddItem}
                    className="w-full rounded-lg bg-emerald-600 p-2 text-sm font-semibold text-white hover:bg-emerald-700">
                    <Plus className="inline h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No items added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 font-medium">{item.productName}</td>
                        <td className="px-4 py-2 font-mono text-xs">{item.sku}</td>
                        <td className="px-4 py-2 text-right">
                          <input type="number" min="1" value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-20 rounded border border-slate-200 px-2 py-1 text-right" />
                        </td>
                        <td className="px-4 py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg p-1 text-rose-600 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h2>

            <div className="space-y-3 border-b border-slate-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium">${shipping.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between pt-4">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-bold text-emerald-600">${total.toLocaleString()}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => handleSubmit("draft")} disabled={submitting}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <Save className="mr-2 inline h-4 w-4" />
                Save Draft
              </button>
              <button onClick={() => handleSubmit("pending")} disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {submitting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> :
                  orderType === "online" ? <Send className="mr-2 inline h-4 w-4" /> : <Download className="mr-2 inline h-4 w-4" />}
                {orderType === "online" ? "Submit Order" : "Download PO"}
              </button>
            </div>

            {orderType === "shop" && (
              <p className="mt-3 text-xs text-center text-slate-500">
                Clicking Download will create the order and download a PDF purchase order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}