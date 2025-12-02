"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Building2, Mail, MapPin, Edit } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface CampusAdmin {
  campus_admin_id: number;
  username: string;
  campus_name: string;
  email: string | null;
  location: string | null;
  admin_name: string | null;
}

export default function ProfileButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState<CampusAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      // Fetch the first campus admin (or use auth logic to get specific user)
      const { data, error, count } = await supabase
        .from("campus_admin")
        .select("campus_admin_id, username, campus_name, email, location, admin_name", { count: 'exact' })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        // Set a default admin if there's an error
        setAdmin({
          campus_admin_id: 1,
          username: "admin",
          campus_name: "Default Campus",
          email: "admin@campus.edu",
          location: "Campus Location",
          admin_name: "Campus Administrator"
        });
        return;
      }
      
      if (data) {
        setAdmin(data);
      } else {
        // No admin found, create a default one for demo
        console.log("No admin found in database, using default");
        setAdmin({
          campus_admin_id: 1,
          username: "admin",
          campus_name: "Default Campus",
          email: "admin@campus.edu",
          location: "Campus Location",
          admin_name: "Campus Administrator"
        });
      }
    } catch (error: any) {
      console.error("Error fetching admin profile:", error);
      // Fallback to default
      setAdmin({
        campus_admin_id: 1,
        username: "admin",
        campus_name: "Default Campus",
        email: "admin@campus.edu",
        location: "Campus Location",
        admin_name: "Campus Administrator"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent animate-pulse">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-lg transition-all duration-200 hover:scale-105"
        title="Profile"
      >
        <User className="h-4 w-4 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-background shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {admin?.admin_name || admin?.username || "Campus Admin"}
                  </h3>
                  <p className="text-white/80 text-sm truncate">
                    @{admin?.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 space-y-3">
              {admin?.campus_name && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Campus</p>
                    <p className="font-medium truncate">{admin.campus_name}</p>
                  </div>
                </div>
              )}

              {admin?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{admin.email}</p>
                  </div>
                </div>
              )}

              {admin?.location && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium truncate">{admin.location}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Footer Actions */}
            <div className="border-t border-border p-2 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/campusAdmin/profile");
                }}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>View Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
