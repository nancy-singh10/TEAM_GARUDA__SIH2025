"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Building2, Mail, MapPin, User, Save, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface CampusAdmin {
  campus_admin_id: number;
  username: string;
  campus_name: string;
  email: string | null;
  location: string | null;
  admin_name: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<CampusAdmin | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    admin_name: "",
    campus_name: "",
    email: "",
    location: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("campus_admin")
        .select("campus_admin_id, username, campus_name, email, location, admin_name")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Supabase error details:", error);
        // Set default data
        const defaultAdmin = {
          campus_admin_id: 1,
          username: "admin",
          campus_name: "Default Campus",
          email: "admin@campus.edu",
          location: "Campus Location",
          admin_name: "Campus Administrator"
        };
        setAdmin(defaultAdmin);
        setFormData({
          username: defaultAdmin.username,
          admin_name: defaultAdmin.admin_name || "",
          campus_name: defaultAdmin.campus_name,
          email: defaultAdmin.email || "",
          location: defaultAdmin.location || "",
        });
      } else if (data) {
        setAdmin(data);
        setFormData({
          username: data.username || "",
          admin_name: data.admin_name || "",
          campus_name: data.campus_name || "",
          email: data.email || "",
          location: data.location || "",
        });
      } else {
        const defaultAdmin = {
          campus_admin_id: 1,
          username: "admin",
          campus_name: "Default Campus",
          email: "admin@campus.edu",
          location: "Campus Location",
          admin_name: "Campus Administrator"
        };
        setAdmin(defaultAdmin);
        setFormData({
          username: defaultAdmin.username,
          admin_name: defaultAdmin.admin_name || "",
          campus_name: defaultAdmin.campus_name,
          email: defaultAdmin.email || "",
          location: defaultAdmin.location || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!admin?.campus_admin_id) {
        throw new Error("No admin ID found");
      }

      const { error: updateError } = await supabase
        .from("campus_admin")
        .update({
          username: formData.username,
          admin_name: formData.admin_name,
          campus_name: formData.campus_name,
          email: formData.email,
          location: formData.location,
        })
        .eq("campus_admin_id", admin.campus_admin_id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push("/campusAdmin/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/campusAdmin/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-background border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/80 mt-1">Manage your campus admin information</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Profile Info Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                {/* Admin Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.admin_name}
                      onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Info Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-500" />
                Campus Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Campus Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Campus Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.campus_name}
                      onChange={(e) => setFormData({ ...formData, campus_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter campus name"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-500" />
                Contact Information
              </h2>
              <div className="grid md:grid-cols-1 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="admin@campus.edu"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Link
                href="/campusAdmin/dashboard"
                className="flex-1 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
