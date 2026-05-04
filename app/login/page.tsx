"use client";

import { Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ec4899,_transparent_50%)]" />

      {/* Card */}
      <div className="relative w-full max-w-4xl mx-4 grid md:grid-cols-2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent">
          <h2 className="text-3xl font-bold text-white">
            Welcome Back 
          </h2>
          <p className="text-white/70 mt-3 text-sm">
            Sign in to access your dashboard, manage data, and continue your workflow seamlessly.
          </p>

          <div className="mt-10 space-y-2 text-white/60 text-sm">
            <p>✔ Secure authentication</p>
            <p>✔ Fast dashboard access</p>
            <p>✔ Modern UI experience</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 bg-white/5">
          <div className="max-w-md mx-auto">

            {/* Logo */}
            <div className="flex justify-center mb-6">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                            <Image
                              src="/register.png"
                              alt="Description of image"
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-white">
              Sign In
            </h2>
            <p className="text-center text-white/60 text-sm mt-1 mb-6">
              Enter your credentials to continue
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Forgot */}
              <div className="text-right">
                <a href="#" className="text-sm text-pink-400 hover:text-pink-300">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Social */}
             <div className="mt-8 text-center text-white/50 text-sm">
              Can't login the   <a href="/register" className="text-sm text-pink-400 hover:text-pink-300">
                  register
                </a> your account
            </div>
            <div className="mt-1 text-center text-white/50 text-sm">
              Or continue with
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition">
                Google
              </button>
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition">
                Facebook
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}