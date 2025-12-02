"use client";

import { usePathname } from "next/navigation";
import CampusAdminHeader from "@/components/CampusAdminHeader";

export default function CampusAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = !pathname.includes("/auth");

  return (
    <>
      {showHeader && <CampusAdminHeader />}
      {children}
    </>
  );
}
