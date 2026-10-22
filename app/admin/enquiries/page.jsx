"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminEnquiriesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin?tab=enquiries");
  }, [router]);
  return null;
}
