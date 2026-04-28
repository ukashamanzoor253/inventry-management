"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Package, AlertTriangle, Loader2, Eye } from "lucide-react";

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
      
      // Update local state
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
    if (available === 0) return { label: "Critical", color: "bg-rose-100 text-rose-700" };
    if (available <= reorderPoint / 2) return { label: "High", color: "bg-orange-100 text-orange-700" };
    if (available <= reorderPoint) return { label: "Medium", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Low", color: "bg-green-100 text-green-700" };
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

  if (loading) {
    return (
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
            <p className="mt-2 text-sm text-slate-500">Loading stock alerts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button 
              onClick={fetchAlerts}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
            <Bell className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Stock alerts</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Priority replenishment</h2>
          </div>
        </div>
        
        <div className="flex gap-3">
          {/* Filter Buttons */}
          <div className="flex rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                filter === "all" 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                filter === "unread" 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          
          
          
          <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">
            Create purchase order
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-6 space-y-4">
        {alerts.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-3 text-lg font-medium text-slate-600">No stock alerts</p>
            <p className="mt-1 text-sm text-slate-500">
              {filter === "unread" 
                ? "All alerts have been read" 
                : "All products are well-stocked"}
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertTypeIcon(alert.type);
            const priority = getPriorityLabel(alert.product.available, alert.product.reorderPoint);
            const isUnread = !alert.isRead;
            
            return (
              <div
                key={alert.id}
                className={`rounded-[28px] border p-5 transition-all duration-200 ${
                  isUnread 
                    ? "border-rose-200 bg-rose-50 shadow-sm" 
                    : "border-slate-200 bg-white opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      {isUnread && (
                        <div className="mt-1">
                          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-slate-950">
                            {alert.product.name}
                          </p>
                          {isUnread && (
                            <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-semibold text-rose-700">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {alert.product.category.name} · SKU: {alert.product.sku}
                        </p>
                        {alert.message && (
                          <p className="mt-2 text-sm text-rose-600 bg-rose-100/50 p-2 rounded-lg">
                            {alert.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                        <Package className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-slate-700">
                          Available: <span className="font-semibold">{alert.product.available}</span> units
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                        <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-slate-700">
                          Reorder point: <span className="font-semibold">{alert.product.reorderPoint}</span> units
                        </span>
                      </div>
                      {alert.product.location && (
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                          <span className="text-slate-500">📍</span>
                          <span className="text-slate-700">{alert.product.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full px-4 py-1.5 text-sm font-semibold ${priority.color}`}>
                      {priority.label}
                    </div>
                    
                   
                  </div>
                </div>
                
                {/* Additional info */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-rose-100 pt-3">
                  <span>Alert type: {alert.type.replace('_', ' ')}</span>
                  <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Quick Stats Footer */}
      {alerts.length > 0 && (
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
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
              <span className="ml-2 font-semibold text-rose-600">
                {alerts.filter(a => a.product.available === 0).length}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Low Stock:</span>
              <span className="ml-2 font-semibold text-orange-600">
                {alerts.filter(a => a.product.available > 0 && a.product.available <= a.product.reorderPoint).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}