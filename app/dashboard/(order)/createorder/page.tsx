"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroHeader from "@/components/ui/HeroHeader";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Calendar,
  Send,
  Save,
  Globe,
  Store,
  User,
  Phone,
  Mail,
  Package,
  Loader2,
  AlertCircle,
  Download,
  X,
  TrendingUp,
  DollarSign,
  Truck
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
  items: OrderItem[];
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
function SupplierModal({ isOpen, onClose, onSupplierAdded, onSupplierUpdated, onSupplierDeleted, editingSupplier }: any) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (!response.ok) throw new Error(`Failed to ${editingSupplier ? 'update' : 'add'} supplier`);

      const supplier = await response.json();

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
    try {
      await fetch(`/api/suppliers/${editingSupplier.id}`, { method: 'DELETE' });
      onSupplierDeleted(editingSupplier.id);
      onClose();
    } catch (err) {
      setError('Failed to delete supplier');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">Delete {editingSupplier?.name}? This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border border-slate-200 p-2.5">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="flex-1 rounded-xl bg-red-600 p-2.5 text-white">Delete</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Supplier Name" className="w-full rounded-xl border border-slate-200 p-2.5" />
            <input type="email" name="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full rounded-xl border border-slate-200 p-2.5" />
            <input type="tel" name="phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full rounded-xl border border-slate-200 p-2.5" />
            <textarea name="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Address" rows={3} className="w-full rounded-xl border border-slate-200 p-2.5" />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl border p-2.5">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-blue-600 p-2.5 text-white">{loading ? 'Saving...' : (editingSupplier ? 'Update' : 'Add')}</button>
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

  // Online Order State
  const [onlineFormData, setOnlineFormData] = useState({
    customer: { name: '', email: '', phone: '', address: '', city: '', postalCode: '', country: '' },
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
      if (productsRes.ok) setProducts(await productsRes.json());
      if (suppliersRes.ok) setSuppliers(await suppliersRes.json());
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const selectedSupplier = suppliers.find(s => s.id === shopFormData.supplierId);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1;
  const shipping = orderType === "online" ? (onlineFormData.shippingMethod === "express" ? 25 : onlineFormData.shippingMethod === "overnight" ? 50 : 10) : (shopFormData.deliveryMethod === "delivery" ? 15 : 0);
  const total = subtotal + tax + shipping;

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = items.find(i => i.productId === product.id);
    if (existingItem) {
      setItems(items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.quantity + quantity) * i.unitPrice } : i));
    } else {
      setItems([...items, { id: Date.now().toString(), productId: product.id, productName: product.name, sku: product.sku, quantity, unitPrice: product.price, totalPrice: product.price * quantity }]);
    }
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const handleSupplierAdded = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
    setShopFormData({ ...shopFormData, supplierId: supplier.id });
  };

  const handleSupplierUpdated = (updated: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleSupplierDeleted = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    if (shopFormData.supplierId === id) setShopFormData({ ...shopFormData, supplierId: "" });
  };

  const generatePurchaseOrderPDF = async (orderData: OrderPDF) => {
    const html2pdf = (await import('html2pdf.js')).default;
    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `
      <div style="font-family: Arial; padding: 40px;">
        <h1 style="color: #2563eb;">PURCHASE ORDER</h1>
        <p>${orderData.orderNumber}</p>
        <h3>Supplier: ${orderData.supplier.name}</h3>
        <p>${orderData.supplier.email} | ${orderData.supplier.phone}</p>
        <p>${orderData.supplier.address}</p>
        <table style="width:100%; border-collapse: collapse;">
          <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          ${orderData.items.map(item => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.unitPrice}</td><td>${item.totalPrice}</td></tr>`).join('')}
        </table>
        <h3>Total: ${orderData.totalAmount}</h3>
      </div>
    `;
    document.body.appendChild(pdfContent);
    await html2pdf().set({ margin: 0.5, filename: `Purchase_Order_${orderData.orderNumber}.pdf` }).from(pdfContent).save();
    document.body.removeChild(pdfContent);
  };

  const handleSubmit = async (status: "draft" | "pending") => {
    if (items.length === 0) return setError("Please add at least one item");
    if (orderType === "online" && (!onlineFormData.customer.name || !onlineFormData.customer.email)) return setError("Please fill customer information");
    if (orderType === "shop" && !shopFormData.supplierId) return setError("Please select a supplier");
    if (!(orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate)) return setError("Please select expected date");

    try {
      setSubmitting(true);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          expectedDate: orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate,
          priority: orderType === "online" ? onlineFormData.priority : shopFormData.priority,
          notes: orderType === "online" ? onlineFormData.notes : shopFormData.notes,
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice })),
          ...(orderType === "online" && { customer: onlineFormData.customer, paymentMethod: onlineFormData.paymentMethod, shippingMethod: onlineFormData.shippingMethod }),
          ...(orderType === "shop" && { supplierId: shopFormData.supplierId, deliveryMethod: shopFormData.deliveryMethod })
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      const createdOrder = await response.json();

      if (orderType === "shop" && selectedSupplier) {
        await generatePurchaseOrderPDF({
          orderNumber: createdOrder.orderNumber,
          supplier: selectedSupplier,
          items,
          orderDate: new Date().toISOString(),
          expectedDate: shopFormData.expectedDate,
          priority: shopFormData.priority,
          deliveryMethod: shopFormData.deliveryMethod,
          subtotal, tax, shipping, totalAmount: total,
          notes: shopFormData.notes
        });
      }
      router.push('/dashboard/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <div className="space-y-6">
      <HeroHeader
        badge={orderType === "online" ? "Online Order" : "Shop Order"}
        title={`Create ${orderType === "online" ? "Online" : "Shop"} Order`}
        subtitle={orderType === "online" ? "Process customer orders from your online store" : "Create purchase orders for inventory restocking"}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            {orderType === "online" ? <Globe className="h-4 w-4" /> : <Store className="h-4 w-4" />}
            <span className="text-sm font-medium capitalize">{orderType} Order</span>
          </div>
        }
      />

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
        <button onClick={() => setOrderType("online")} className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${orderType === "online" ? "border-blue-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white " : "border-slate-200 bg-white hover:border-blue-500"}`}>
          <div className="relative flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${orderType === "online" ? "bg-white/20" : "bg-gradient-to-br from-blue-600 to-indigo-600"}`}>
              <Globe className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${orderType === "online" ? "text-white" : "text-slate-900"}`}>Online Order</h3>
              <p className={`text-sm mt-1 ${orderType === "online" ? "text-white/80" : "text-slate-500"}`}>Customer orders from online store</p>
            </div>
          </div>
        </button>

        <button onClick={() => setOrderType("shop")} className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${orderType === "shop" ? "border-blue-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white " : "border-slate-200 bg-white hover:border-blue-500"}`}>
          <div className="relative flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${orderType === "shop" ? "bg-white/20" : "bg-gradient-to-br from-blue-600 to-indigo-600"}`}>
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${orderType === "shop" ? "text-white" : "text-slate-900"}`}>Shop Order</h3>
              <p className={`text-sm mt-1 ${orderType === "shop" ? "text-white/80" : "text-slate-500"}`}>Purchase orders for inventory</p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          {orderType === "online" && (
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <User className="h-5 w-5 text-blue-600" />
                Customer Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="Full Name *" value={onlineFormData.customer.name} onChange={(e) => setOnlineFormData({...onlineFormData, customer: {...onlineFormData.customer, name: e.target.value}})} className="rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" />
                <input type="email" placeholder="Email *" value={onlineFormData.customer.email} onChange={(e) => setOnlineFormData({...onlineFormData, customer: {...onlineFormData.customer, email: e.target.value}})} className="rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" />
                <input type="tel" placeholder="Phone" value={onlineFormData.customer.phone} onChange={(e) => setOnlineFormData({...onlineFormData, customer: {...onlineFormData.customer, phone: e.target.value}})} className="rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" />
                <input type="text" placeholder="Address *" value={onlineFormData.customer.address} onChange={(e) => setOnlineFormData({...onlineFormData, customer: {...onlineFormData.customer, address: e.target.value}})} className="rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" />
              </div>
            </div>
          )}

          {/* Supplier Information */}
          {orderType === "shop" && (
            <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Package className="h-5 w-5 text-blue-600" />
                  Supplier Information
                </h2>
                <button onClick={() => { setEditingSupplier(null); setIsSupplierModalOpen(true); }} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                  <Plus className="h-4 w-4" /> Add New
                </button>
              </div>

              <select value={shopFormData.supplierId} onChange={(e) => setShopFormData({...shopFormData, supplierId: e.target.value})} className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none mb-4">
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              {selectedSupplier && (
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedSupplier.email}</p>
                  <p className="text-sm mt-1"><span className="font-medium">Phone:</span> {selectedSupplier.phone}</p>
                  <p className="text-sm mt-1"><span className="font-medium">Address:</span> {selectedSupplier.address}</p>
                </div>
              )}
            </div>
          )}

          {/* Order Details */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Expected Date *</label>
                <input type="date" value={orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate} onChange={(e) => orderType === "online" ? setOnlineFormData({...onlineFormData, expectedDate: e.target.value}) : setShopFormData({...shopFormData, expectedDate: e.target.value})} className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                <select value={orderType === "online" ? onlineFormData.priority : shopFormData.priority} onChange={(e) => orderType === "online" ? setOnlineFormData({...onlineFormData, priority: e.target.value as Priority}) : setShopFormData({...shopFormData, priority: e.target.value as Priority})} className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
              <textarea rows={3} value={orderType === "online" ? onlineFormData.notes : shopFormData.notes} onChange={(e) => orderType === "online" ? setOnlineFormData({...onlineFormData, notes: e.target.value}) : setShopFormData({...shopFormData, notes: e.target.value})} className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 outline-none" placeholder="Additional notes..." />
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 ">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Items</h2>

            <div className="mb-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 p-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500">
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price} (Stock: {p.available})</option>)}
                  </select>
                </div>
                <div>
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <button onClick={handleAddItem} className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="inline h-4 w-4 mr-1" /> Add
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
                    <tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-right">Qty</th><th className="px-4 py-2 text-right">Price</th><th className="px-4 py-2 text-right">Total</th><th className="px-4 py-2 text-center">Action</th></tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 font-medium">{item.productName}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-rose-600 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></td>
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
          <div className="sticky top-6 rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-white p-6 ">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h2>

            <div className="space-y-3 border-b border-slate-200 pb-4">
              <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Tax (10%)</span><span className="font-medium">${tax.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span className="font-medium">${shipping.toLocaleString()}</span></div>
            </div>

            <div className="mt-4 flex justify-between pt-4">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-bold text-blue-600">${total.toLocaleString()}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => handleSubmit("draft")} disabled={submitting} className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <Save className="mr-2 inline h-4 w-4" /> Draft
              </button>
              <button onClick={() => handleSubmit("pending")} disabled={submitting} className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">
                {submitting ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : (orderType === "online" ? <Send className="mr-2 inline h-4 w-4" /> : <Download className="mr-2 inline h-4 w-4" />)}
                {orderType === "online" ? "Submit" : "Download PO"}
              </button>
            </div>

            {orderType === "shop" && (
              <p className="mt-3 text-xs text-center text-slate-500">Creates order & downloads PDF purchase order</p>
            )}
          </div>
        </div>
      </div>

      <SupplierModal isOpen={isSupplierModalOpen} onClose={() => { setIsSupplierModalOpen(false); setEditingSupplier(null); }} onSupplierAdded={handleSupplierAdded} onSupplierUpdated={handleSupplierUpdated} onSupplierDeleted={handleSupplierDeleted} editingSupplier={editingSupplier} />
    </div>
  );
}