import AuthCard from "@/app/components/AuthCard";

export default function AdminAuthPage() {
  return (
    <AuthCard 
      title="Power Source Admin Access" 
      subtitle="Manage renewable energy sources and grid operations" 
      variant="admin"
      backLink={{ href: "/", label: "Back to Home" }}
    />
  );
}