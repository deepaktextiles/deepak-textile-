"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAdmin } from "../../../lib/context/AdminContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAdmin();

  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@deepaktextiles.com"
  );
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin@123"
  );
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
    setSubmitting(true);

    try {
      const ok = await login(email, password);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid email or password. Please try again.");
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
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Authorized access only. Session protected by JWT.</span>
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
              placeholder="admin@deepaktextiles.com"
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              required
            />

            <Input
              label="Admin Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
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
