"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "", // Fixed typo: was "mame"
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", { // Changed from login to register
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful, redirect to login or dashboard
      router.push("/login?registered=true"); // Redirect to login with success message
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ec4899,_transparent_50%)]" />

      {/* Card */}
      <div className="relative w-full max-w-5xl mx-4 grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center text-center p-10 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#fff,_transparent)]" />

          <div className="relative z-10 text-white">
            <h2 className="text-3xl font-bold">Join Us </h2>
            <p className="text-white/70 mt-3 text-sm max-w-sm">
              Create your account and unlock powerful tools, insights, and a seamless experience.
            </p>

            <div className="mt-8 space-y-2 text-white/60 text-sm">
              <p>✔ Fast onboarding</p>
              <p>✔ Secure authentication</p>
              <p>✔ Modern dashboard access</p>
            </div>
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

            <h2 className="text-2xl font-bold text-center text-white">
              Create Account
            </h2>
            <p className="text-center text-white/60 text-sm mt-1 mb-6">
              Start your journey in seconds
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {/* Confirm Password */}
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-pink-500"
                  id="terms"
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <a href="/terms" className="text-pink-400 hover:text-pink-300">
                    Terms & Conditions
                  </a>
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-white/50 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-pink-400 hover:text-pink-300">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}