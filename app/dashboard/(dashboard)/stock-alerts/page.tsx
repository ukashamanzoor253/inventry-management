"use client";

import { useState, useEffect } from "react";
import HeroHeader from "@/components/ui/HeroHeader";
import { Bell, Check, Package, AlertTriangle, Loader2, Eye, ShoppingCart } from "lucide-react";

// Types based on API response
interface StockAlert {
  id: string;
  productId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    available: number;
    reorderPoint: number;
    price: number;
    location: string;
    category: {
      id: string;
      name: string;
      color: string;
    };
  };
}

interface ApiResponse {
  alerts: StockAlert[];
  unreadCount: number;
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = filter === "unread" 
        ? `/api/stock-alerts?unread=true`
        : `/api/stock-alerts`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch stock alerts');
      }
      
      const data: ApiResponse = await response.json();
      setAlerts(data.alerts);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching stock alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    setMarkingAsRead(alertId);
    
    try {
      const response = await fetch(`/api/stock-alert/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark alert as read');
      }
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking alert as read:', err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    const unreadAlerts = alerts.filter(alert => !alert.isRead);
    for (const alert of unreadAlerts) {
      await markAsRead(alert.id);
    }
  };

  const getPriorityLabel = (available: number, reorderPoint: number) => {
    if (available === 0) return { label: "Critical", color: "from-rose-500 to-red-600", bgLight: "bg-rose-50 text-rose-700" };
    if (available <= reorderPoint / 2) return { label: "High", color: "from-orange-500 to-red-600", bgLight: "bg-orange-50 text-orange-700" };
    if (available <= reorderPoint) return { label: "Medium", color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50 text-amber-700" };
    return { label: "Low", color: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50 text-emerald-700" };
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return AlertTriangle;
      case 'CRITICAL':
        return AlertTriangle;
      default:
        return Package;
    }
  };

  const criticalCount = alerts.filter(a => a.product.available === 0).length;
  const lowStockCount = alerts.filter(a => a.product.available > 0 && a.product.available <= a.product.reorderPoint).length;



  if (error) {
    return (
      <div className="space-y-6">
        <HeroHeader
          badge="Monitoring"
          title="Stock Alerts"
          subtitle="Track and manage inventory notifications"
          stats={[
            { label: "Total Alerts", value: "0" },
            { label: "Unread", value: "0" },
          ]}
        />
        <div className="rounded-2xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
          <p className="text-rose-600 mb-3">Error: {error}</p>
          <button 
            onClick={fetchAlerts}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-white hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <HeroHeader
        badge="Monitoring"
        title="Stock Alerts"
        subtitle="Track and manage inventory notifications"
        stats={[
          { label: "Total Alerts", value: alerts.length },
          { label: "Unread", value: unreadCount },
        ]}
        actions={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </button>
          )
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{alerts.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Critical</p>
              <p className="text-3xl font-bold text-rose-600">{criticalCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-md">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock</p>
              <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm">
        {/* Filter Bar */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Stock Notifications</h3>
              <p className="text-sm text-slate-500">Priority items requiring attention</p>
            </div>
            <div className="flex gap-3">
              <div className="flex rounded-xl border border-slate-200 p-1 bg-white">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    filter === "all" 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    filter === "unread" 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
              
              <button 
                onClick={() => window.location.href = '/dashboard/createorder'}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 shadow-md"
              >
                <ShoppingCart className="h-4 w-4" />
                Create PO
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-lg font-medium text-slate-900">No stock alerts</p>
              <p className="mt-1 text-sm text-slate-500">
                {filter === "unread" 
                  ? "All alerts have been read" 
                  : "All products are well-stocked"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = getAlertTypeIcon(alert.type);
                const priority = getPriorityLabel(alert.product.available, alert.product.reorderPoint);
                const isUnread = !alert.isRead;
                
                return (
                  <div
                    key={alert.id}
                    className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                      isUnread 
                        ? "border-rose-200 bg-gradient-to-br from-rose-50/50 to-white shadow-sm" 
                        : "border-slate-200 bg-white opacity-75 hover:opacity-100"
                    }`}
                  >
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-red-500" />
                    )}
                    
                    <div className="relative">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                              alert.product.available === 0 
                                ? "from-rose-500 to-red-600" 
                                : "from-amber-500 to-orange-600"
                            } shadow-md`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold text-slate-900">
                                  {alert.product.name}
                                </p>
                                {isUnread && (
                                  <span className="rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {alert.product.category.name} · SKU: {alert.product.sku}
                              </p>
                              {alert.message && (
                                <p className="mt-2 text-sm text-rose-700 bg-rose-100/50 p-2 rounded-lg">
                                  {alert.message}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
                              <Package className="h-3.5 w-3.5 text-slate-500" />
                              <span className="text-slate-700">
                                Available: <span className="font-semibold text-slate-900">{alert.product.available}</span> units
                              </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
                              <span className="text-slate-700">
                                Reorder point: <span className="font-semibold text-slate-900">{alert.product.reorderPoint}</span> units
                              </span>
                            </div>
                            {alert.product.location && (
                              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
                                <span className="text-slate-500">📍</span>
                                <span className="text-slate-700">{alert.product.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full bg-gradient-to-r ${priority.color} px-4 py-1.5 text-sm font-semibold text-white shadow-sm`}>
                            {priority.label}
                          </div>
                          
                          {isUnread && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              disabled={markingAsRead === alert.id}
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                              title="Mark as read"
                            >
                              {markingAsRead === alert.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                        <span className="capitalize">Alert type: {alert.type.replace('_', ' ').toLowerCase()}</span>
                        <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Quick Stats Footer */}
        {alerts.length > 0 && (
          <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 rounded-b-2xl">
            <div className="flex flex-wrap justify-between gap-4 text-sm">
              <div>
                <span className="text-slate-500">Total Alerts:</span>
                <span className="ml-2 font-semibold text-slate-900">{alerts.length}</span>
              </div>
              <div>
                <span className="text-slate-500">Unread:</span>
                <span className="ml-2 font-semibold text-rose-600">{unreadCount}</span>
              </div>
              <div>
                <span className="text-slate-500">Critical:</span>
                <span className="ml-2 font-semibold text-rose-600">{criticalCount}</span>
              </div>
              <div>
                <span className="text-slate-500">Low Stock:</span>
                <span className="ml-2 font-semibold text-amber-600">{lowStockCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}