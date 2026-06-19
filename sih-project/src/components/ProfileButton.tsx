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
      // 1. Try to get user from localStorage (set by AuthCard)
      let userId = null;
      try {
        const sessionStr = localStorage.getItem('sessionUser');
        if (sessionStr) {
          const sessionUser = JSON.parse(sessionStr);
          // The auth card returns the full user object from the DB
          if (sessionUser && sessionUser.campus_admin_id) {
            setAdmin(sessionUser);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Error parsing session:", e);
      }

      // 2. Fallback: Try Supabase Auth (if you switch to full Supabase Auth later)
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from("campus_admin").select("campus_admin_id, username, campus_name, email, location, admin_name");

      if (user) {
        // If linked by email or auth_id (assuming you might add this later)
        query = query.eq('email', user.email);
      } else if (userId) {
        query = query.eq('campus_admin_id', userId);
      } else {
        // 3. Last resort: Check for cookie (if set by server actions)
        // This is client-side, so we can't read httpOnly cookies easily, 
        // but if you set a readable cookie, we could use it.
        // For now, if no login found, we shouldn't show a random profile.
        console.log("No logged in user found");
        setLoading(false);
        return;
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (data) {
        setAdmin(data);
      }
    } catch (error: any) {
      console.error("Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/campusAdmin/logout', { method: 'POST' });
      localStorage.removeItem('sessionUser');
    } catch (e) {
      console.error(e);
    }
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
