export interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
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
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  leadTime: number; // in days
  rating: number;
  status: "active" | "inactive";
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  receivedOrders: number;
  totalValue: number;
  averageLeadTime: number;
}