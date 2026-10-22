"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * StoreLayout conditionally renders customer-facing Header, Footer, and
 * floating WhatsApp button. When accessing /admin or any admin subroute,
 * it suppresses them completely so the admin portal operates in a dedicated,
 * distraction-free layout.
 */
export function StoreLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
