'use client';

import { useState } from 'react';
import { User, Building, MapPin, Mail, Activity, Sun, Wind, Battery, Server, Save, Loader2, Edit2 } from 'lucide-react';
import { updateCampusConfig } from '../dashboard/actions'; // Imports the action we created earlier
import { useRouter } from 'next/navigation';

// Type definition matching your DB schema
type CampusUser = {
  campus_admin_id: string;
  username: string;
  admin_name: string;
  email: string;
  campus_name: string;
  location: string;
  campus_load_min: number;
  campus_load_max: number;
  solar_capacity: number;
  wind_capacity: number;
  battery_capacity: number;
  max_grid_limit: number;
};

export default function ProfileForm({ user }: { user: CampusUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CampusUser>(user);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Reuse the server action from the dashboard to save data
    const result = await updateCampusConfig(user.campus_admin_id, formData);
    setIsSaving(false);
    
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert('Failed to save changes');
    }
  };

  // Helper component for text inputs
  const InputGroup = ({ label, name, icon: Icon, type = "text" }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-500 flex items-center gap-2">
        <Icon className="w-4 h-4" /> {label}
      </label>
      {isEditing ? (
        <input 
          type={type} 
          name={name}
          value={formData[name as keyof CampusUser] || ''}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      ) : (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium min-h-[48px] flex items-center">
          {formData[name as keyof CampusUser]}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile and energy configurations</p>
        </div>
        <div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsEditing(false); setFormData(user); }}
                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          {/* Section 1: Personal Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              Personal Information
            </h2>
            <div className="space-y-5">
              <InputGroup label="Username" name="username" icon={User} />
              <InputGroup label="Full Name" name="admin_name" icon={User} />
              <InputGroup label="Email Address" name="email" icon={Mail} />
            </div>
          </div>

          {/* Section 2: Campus Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              Campus Details
            </h2>
            <div className="space-y-5">
              <InputGroup label="Campus Name" name="campus_name" icon={Building} />
              <InputGroup label="Location" name="location" icon={MapPin} />
            </div>
          </div>
        </div>

        {/* Right Column: Energy Config */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Energy Configuration
          </h2>
          
          <div className="space-y-6">
            {/* Load Limits */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">System Load Limits (kW)</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Min Load" name="campus_load_min" icon={Activity} type="number" />
                <InputGroup label="Max Load" name="campus_load_max" icon={Activity} type="number" />
              </div>
            </div>

            {/* Capacities */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/30">
                 <InputGroup label="Solar Capacity (kW)" name="solar_capacity" icon={Sun} type="number" />
              </div>
              <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 dark:bg-sky-900/10 dark:border-sky-900/30">
                 <InputGroup label="Wind Capacity (kW)" name="wind_capacity" icon={Wind} type="number" />
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                 <InputGroup label="Battery Capacity (kWh)" name="battery_capacity" icon={Battery} type="number" />
              </div>
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-900/30">
                 <InputGroup label="Max Grid Limit (kW)" name="max_grid_limit" icon={Server} type="number" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}