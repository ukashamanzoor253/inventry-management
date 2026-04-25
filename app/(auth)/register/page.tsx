"use client";

import { Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-400 to-pink-300">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_white,_transparent)]"></div>

          <div className="text-white text-center z-10 px-6">
            <h2 className="text-3xl font-bold mb-2">Join Us</h2>
            <p className="text-sm opacity-90">
              Create your account and start your journey
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              SIGN UP
            </h2>

            <form className="space-y-5">
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="accent-pink-500" />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-pink-500 hover:underline">
                    Terms & Conditions
                  </a>
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold transition"
              >
                CREATE ACCOUNT
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-pink-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
