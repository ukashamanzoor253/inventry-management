// app/not-found.js
"use client";

import Link from 'next/link'
import { Home, Package, ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-white rounded-[20px]">
      <div className="flex flex-col items-center justify-center px-4 py-10">
        {/* Main Content */}
        <div className="w-full max-w-2xl text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold tracking-tighter md:text-9xl">
              4
              <span className="text-emerald-500">0</span>
              4
            </h1>
          </div>

          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <AlertCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          {/* Message */}
          <h2 className="mb-3 text-2xl font-semibold md:text-3xl">
            Page not found
          </h2>
          <p className="mb-8 text-slate-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Package className="h-4 w-4" />
              View Inventory
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-6">
            <p className="mb-3 text-sm text-slate-500">Need help finding something?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/inventory"
                className="text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Inventory
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                href="/orders"
                className="text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Orders
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                href="/categories"
                className="text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Categories
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                href="/suppliers"
                className="text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Suppliers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}