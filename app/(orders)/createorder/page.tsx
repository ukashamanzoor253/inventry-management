"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    Trash2,
    ShoppingCart,
    Truck,
    Calendar,
    DollarSign,
    Send,
    Save,
    AlertCircle,
    Globe,
    Store,
    User,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Package,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
    id: string;
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
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

const mockProducts = [
    { id: 1, name: "Wireless Barcode Scanner", sku: "WS-3381", price: 249.99, category: "Electronics", available: 184 },
    { id: 2, name: "Packaging Tape", sku: "PK-9108", price: 12.99, category: "Supplies", available: 24 },
    { id: 3, name: "Storage Bin", sku: "SB-7204", price: 34.99, category: "Logistics", available: 312 },
    { id: 4, name: "Thermal Labels", sku: "TL-3320", price: 8.99, category: "Supplies", available: 9 },
    { id: 5, name: "Pallet Jack", sku: "PJ-1109", price: 599.99, category: "Equipment", available: 14 },
];

const mockSuppliers = [
    { id: "sup1", name: "TechDistro Inc", email: "orders@techdistro.com", leadTime: 5 },
    { id: "sup2", name: "Packaging Pro", email: "sales@packagingpro.com", leadTime: 3 },
    { id: "sup3", name: "LogiSupply Co", email: "info@logisupply.com", leadTime: 7 },
];

type OrderType = "online" | "shop";

export default function CreateOrderPage() {
    const router = useRouter();
    const [orderType, setOrderType] = useState<OrderType>("shop");

    // Online Order State
    const [onlineFormData, setOnlineFormData] = useState({
        customer: {} as CustomerInfo,
        expectedDate: "",
        priority: "medium" as "high" | "medium" | "low",
        notes: "",
        paymentMethod: "credit_card" as "credit_card" | "paypal" | "bank_transfer",
        shippingMethod: "standard" as "standard" | "express" | "overnight",
    });

    // Shop Order State
    const [shopFormData, setShopFormData] = useState({
        supplierId: "",
        expectedDate: "",
        priority: "medium" as "high" | "medium" | "low",
        notes: "",
        deliveryMethod: "pickup" as "pickup" | "delivery",
    });

    const [items, setItems] = useState<OrderItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showCustomerForm, setShowCustomerForm] = useState(false);

    const selectedSupplier = mockSuppliers.find(s => s.id === shopFormData.supplierId);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1;

    // Calculate shipping based on order type
    const getShippingCost = () => {
        if (orderType === "online") {
            switch (onlineFormData.shippingMethod) {
                case "express": return 25;
                case "overnight": return 50;
                default: return 10;
            }
        }
        if (orderType === "shop" && shopFormData.deliveryMethod === "delivery") {
            return 15;
        }
        return 0;
    };

    const shipping = getShippingCost();
    const total = subtotal + tax + shipping;

    const handleAddItem = () => {
        if (!selectedProduct || quantity < 1) return;

        const product = mockProducts.find(p => p.id.toString() === selectedProduct);
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

    const handleSubmit = (status: "draft" | "pending") => {
        if (items.length === 0) {
            alert("Please add at least one item to the order");
            return;
        }

        if (orderType === "online") {
            if (!onlineFormData.customer.name || !onlineFormData.customer.email || !onlineFormData.customer.address) {
                alert("Please fill in all customer information");
                return;
            }
        }

        if (orderType === "shop" && !shopFormData.supplierId) {
            alert("Please select a supplier");
            return;
        }

        const newOrder = {
            id: Date.now().toString(),
            orderNumber: `${orderType === "online" ? "ON" : "SH"}-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
            orderType: orderType,
            type: orderType === "online" ? "Online Order" : "Shop Order",
            ...(orderType === "online" && { customer: onlineFormData.customer }),
            ...(orderType === "shop" && { supplier: selectedSupplier }),
            items: items,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate,
            status: status,
            priority: orderType === "online" ? onlineFormData.priority : shopFormData.priority,
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            totalAmount: total,
            notes: orderType === "online" ? onlineFormData.notes : shopFormData.notes,
            ...(orderType === "online" && {
                paymentMethod: onlineFormData.paymentMethod,
                shippingMethod: onlineFormData.shippingMethod
            }),
            ...(orderType === "shop" && {
                deliveryMethod: shopFormData.deliveryMethod
            }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save to localStorage
        const existingOrders = JSON.parse(localStorage.getItem("purchaseOrders") || "[]");
        localStorage.setItem("purchaseOrders", JSON.stringify([...existingOrders, newOrder]));

        router.push("/orders");
    };

    // Reset form when changing order type
    const handleOrderTypeSelect = (type: OrderType) => {
        setOrderType(type);
        setItems([]);
        setSelectedProduct("");
        setQuantity(1);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-8 translate-y-8 rounded-full bg-emerald-500/10 transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">
                                    {orderType === "online" ? "Online Order" : "Shop Order"}
                                </p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                                    Create {orderType === "online" ? "Online" : "Shop"} Order
                                </h1>
                                <p className="mt-2 text-slate-300">
                                    {orderType === "online"
                                        ? "Process customer orders from your online store"
                                        : "Create purchase orders for inventory restocking"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                            {orderType === "online" ? <Globe className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                            <span className="text-sm font-medium">{orderType === "online" ? "Online Order" : "Shop Order"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <button
                    onClick={() => handleOrderTypeSelect("online")}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all duration-300 hover:-translate-y-1 ${orderType === "online"
                        ? "border-emerald-500 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl"
                        : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl"
                        }`}
                >
                    <div className={`absolute right-0 top-0 h-32 w-32 group-hover:w-[900px] group-hover:h-[300px] translate-x-8 -translate-y-8 group-hover:translate-x-12 group-hover:-translate-y-12 rounded-full transition-all duration-500 ${orderType === "online"
                        ? "bg-white/10"
                        : "bg-emerald-500/10"
                        }`} />
                    <div className="relative flex items-center gap-4">
                        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${orderType === "online"
                            ? "bg-white/20 text-white"
                            : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                            }`}>
                            <Globe className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className={`mb-2 text-xl font-bold ${orderType === "online" ? "text-white" : "text-slate-900"
                                }`}>
                                Online Order
                            </h3>
                            <p className={`mb-4 ${orderType === "online" ? "text-slate-300" : "text-slate-500"
                                }`}>
                                Process orders received from your online store, e-commerce platform, or website
                            </p>
                        </div>
                    </div>
                </button>

                {/* Shop Order Card */}
                <button
                    onClick={() => handleOrderTypeSelect("shop")}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all duration-300 hover:-translate-y-1 ${orderType === "shop"
                        ? "border-emerald-500 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl"
                        : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl"
                        }`}
                >
                    <div className={`absolute right-0 top-0 h-32 w-32 group-hover:w-[900px] group-hover:h-[300px] translate-x-8 -translate-y-8 group-hover:translate-x-12 group-hover:-translate-y-12 rounded-full transition-all duration-500 ${orderType === "shop"
                        ? "bg-white/10"
                        : "bg-emerald-500/10"
                        }`} />
                    <div className="relative flex items-center gap-4">
                        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${orderType === "shop"
                            ? "bg-white/20 text-white"
                            : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            }`}>
                            <Store className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className={`mb-2 text-xl font-bold ${orderType === "shop" ? "text-white" : "text-slate-900"
                                }`}>
                                Shop Order
                            </h3>
                            <p className={`mb-4 ${orderType === "shop" ? "text-slate-300" : "text-slate-500"
                                }`}>
                                Create purchase orders for restocking inventory from suppliers and distributors
                            </p>
                        </div>
                    </div>
                </button>
            </div>


            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer/Supplier Information based on order type */}
                    {orderType === "online" && (
                        <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <User className="h-5 w-5 text-emerald-600" />
                                Customer Information
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Full Name *</label>
                                    <input
                                        type="text"
                                        value={onlineFormData.customer.name || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, name: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                                    <input
                                        type="email"
                                        value={onlineFormData.customer.email || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, email: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="customer@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
                                    <input
                                        type="tel"
                                        value={onlineFormData.customer.phone || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, phone: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Address *</label>
                                    <input
                                        type="text"
                                        value={onlineFormData.customer.address || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, address: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                                    <input
                                        type="text"
                                        value={onlineFormData.customer.city || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, city: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
                                    <input
                                        type="text"
                                        value={onlineFormData.customer.postalCode || ""}
                                        onChange={(e) => setOnlineFormData({
                                            ...onlineFormData,
                                            customer: { ...onlineFormData.customer, postalCode: e.target.value }
                                        })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {orderType === "shop" && (
                        <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <Package className="h-5 w-5 text-emerald-600" />
                                Supplier Information
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Supplier *</label>
                                    <select
                                        value={shopFormData.supplierId}
                                        onChange={(e) => setShopFormData({ ...shopFormData, supplierId: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                    >
                                        <option value="">Select supplier</option>
                                        {mockSuppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Lead Time</label>
                                    <input
                                        type="text"
                                        value={selectedSupplier ? `${selectedSupplier.leadTime} days` : "Select supplier"}
                                        disabled
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Expected Date *</label>
                                <input
                                    type="date"
                                    value={orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate}
                                    onChange={(e) => orderType === "online"
                                        ? setOnlineFormData({ ...onlineFormData, expectedDate: e.target.value })
                                        : setShopFormData({ ...shopFormData, expectedDate: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                                <select
                                    value={orderType === "online" ? onlineFormData.priority : shopFormData.priority}
                                    onChange={(e) => orderType === "online"
                                        ? setOnlineFormData({ ...onlineFormData, priority: e.target.value as any })
                                        : setShopFormData({ ...shopFormData, priority: e.target.value as any })
                                    }
                                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            {orderType === "online" && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
                                        <select
                                            value={onlineFormData.paymentMethod}
                                            onChange={(e) => setOnlineFormData({ ...onlineFormData, paymentMethod: e.target.value as any })}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        >
                                            <option value="credit_card">Credit Card</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Shipping Method</label>
                                        <select
                                            value={onlineFormData.shippingMethod}
                                            onChange={(e) => setOnlineFormData({ ...onlineFormData, shippingMethod: e.target.value as any })}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                        >
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
                                    <select
                                        value={shopFormData.deliveryMethod}
                                        onChange={(e) => setShopFormData({ ...shopFormData, deliveryMethod: e.target.value as any })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                    >
                                        <option value="pickup">Pickup (Free)</option>
                                        <option value="delivery">Delivery ($15)</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                            <textarea
                                rows={3}
                                value={orderType === "online" ? onlineFormData.notes : shopFormData.notes}
                                onChange={(e) => orderType === "online"
                                    ? setOnlineFormData({ ...onlineFormData, notes: e.target.value })
                                    : setShopFormData({ ...shopFormData, notes: e.target.value })
                                }
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-emerald-500"
                                placeholder={orderType === "online" ? "Special delivery instructions or notes..." : "Purchase order notes..."}
                            />
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Items</h2>

                        {/* Add Item Form */}
                        <div className="mb-6 rounded-xl bg-slate-50 p-4">
                            <div className="grid gap-3 sm:grid-cols-4">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Product</label>
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
                                    >
                                        <option value="">Select product</option>
                                        {mockProducts.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} - ${product.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleAddItem}
                                        className="w-full rounded-lg bg-emerald-600 p-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        <Plus className="inline h-4 w-4 mr-1" />
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        {items.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                                <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
                                <p className="mt-2 text-sm text-slate-500">No items added yet</p>
                                <p className="text-xs text-slate-400">Use the form above to add products</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-slate-600">Product</th>
                                            <th className="px-4 py-2 text-left font-semibold text-slate-600">SKU</th>
                                            <th className="px-4 py-2 text-right font-semibold text-slate-600">Quantity</th>
                                            <th className="px-4 py-2 text-right font-semibold text-slate-600">Unit Price</th>
                                            <th className="px-4 py-2 text-right font-semibold text-slate-600">Total</th>
                                            <th className="px-4 py-2 text-center font-semibold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2 font-medium text-slate-900">{item.productName}</td>
                                                <td className="px-4 py-2 font-mono text-xs text-slate-600">{item.sku}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                        className="w-20 rounded border border-slate-200 px-2 py-1 text-right text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="rounded-lg p-1 text-rose-600 hover:bg-rose-50"
                                                    >
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
                                <span className="font-medium text-slate-900">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Tax (10%)</span>
                                <span className="font-medium text-slate-900">${tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Shipping</span>
                                <span className="font-medium text-slate-900">${shipping.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                            <span className="text-base font-bold text-slate-900">Total</span>
                            <span className="text-xl font-bold text-emerald-600">${total.toLocaleString()}</span>
                        </div>

                        <div className="mt-6 space-y-3">
                            {orderType === "online" && onlineFormData.shippingMethod && (
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <Truck className="mt-0.5 h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs font-medium text-blue-900">Shipping Information</p>
                                            <p className="text-xs text-blue-700 capitalize">{onlineFormData.shippingMethod} shipping</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {orderType === "shop" && shopFormData.deliveryMethod === "delivery" && (
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <Truck className="mt-0.5 h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs font-medium text-blue-900">Delivery Service</p>
                                            <p className="text-xs text-blue-700">Door delivery included</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate) && (
                                <div className="rounded-lg bg-amber-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="mt-0.5 h-4 w-4 text-amber-600" />
                                        <div>
                                            <p className="text-xs font-medium text-amber-900">Expected {orderType === "online" ? "Delivery" : "Receipt"}</p>
                                            <p className="text-xs text-amber-700">
                                                {orderType === "online" ? onlineFormData.expectedDate : shopFormData.expectedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {items.length > 0 && (
                                <div className="rounded-lg bg-emerald-50 p-3">
                                    <div className="flex items-start gap-2">
                                        <Package className="mt-0.5 h-4 w-4 text-emerald-600" />
                                        <div>
                                            <p className="text-xs font-medium text-emerald-900">Total Items</p>
                                            <p className="text-xs text-emerald-700">{items.reduce((sum, i) => sum + i.quantity, 0)} units ({items.length} products)</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => handleSubmit("draft")}
                                className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Save className="mr-2 inline h-4 w-4" />
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSubmit("pending")}
                                className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <Send className="mr-2 inline h-4 w-4" />
                                Submit Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}