import Link from "next/link";
import AuthCard from "@/app/components/AuthCard";

export default function AdminAuthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-sm text-slate-700 flex items-center gap-2 mb-8 hover:text-slate-900">
          <span>←</span> Back to Home
        </Link>
        <AuthCard title="Power Source Admin Access" subtitle="Manage renewable energy sources and grid operations" variant="admin" />
      </div>
    </main>
  );
}