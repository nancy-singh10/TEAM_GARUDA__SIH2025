import AuthCard from "@/app/components/AuthCard";

export default function CampusAdminAuthPage() {
  return (
    <AuthCard 
      title="Campus Admin Access" 
      subtitle="Register your campus and manage energy operations" 
      variant="consumer"
      backLink={{ href: "/", label: "Back to Home" }}
    />
  );
}