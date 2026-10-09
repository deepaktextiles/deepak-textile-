"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAdmin } from "../../../lib/context/AdminContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAdmin();

  const [email, setEmail] = useState("admin@deepaktextiles.com");
  const [password, setPassword] = useState("Admin@123");
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gold-500 text-navy-500 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            DT
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-500">
            Deepak Textiles — Admin Portal
          </h1>
          <p className="text-xs text-txt-secondary">
            Authorized wholesale administration access only.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gold-50 border border-gold-200 text-xs text-gold-900">
            <ShieldCheck className="w-4 h-4 text-gold-700 shrink-0" />
            <span>
              Default Login: <strong>admin@deepaktextiles.com</strong> / <strong>Admin@123</strong>
            </span>
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
              className="w-full font-bold bg-gold-500 hover:bg-gold-400 text-navy-500 mt-2"
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Admin Panel
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-txt-secondary hover:text-navy-500">
              ← Return to Wholesale Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
