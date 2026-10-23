"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Database } from "lucide-react";
import { useAdmin } from "../../../lib/context/AdminContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid administrator credentials. Please check your email and password.");
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please verify server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1528] flex items-center justify-center px-4 py-12 select-none">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white p-1.5 border border-slate-700/60 shadow-xl shadow-black/25 mx-auto flex items-center justify-center">
            <Image
              src="/images/icons/logo.jpeg"
              alt="Deepak Textiles"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide">
            Deepak Textiles Control Center
          </h1>
          <p className="text-xs text-amber-400/90 font-semibold uppercase tracking-wider">
            Wholesale Administrator Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">Database-Verified Admin Access</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-700/80 font-mono">
              <Database className="w-3 h-3" />
              <span>MongoDB</span>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              autoComplete="email"
              required
            />

            <Input
              label="Admin Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold bg-[#C00000] hover:bg-[#A80000] text-white mt-2"
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Admin Panel
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-txt-secondary hover:text-navy-900 font-medium">
              ← Return to Wholesale Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
