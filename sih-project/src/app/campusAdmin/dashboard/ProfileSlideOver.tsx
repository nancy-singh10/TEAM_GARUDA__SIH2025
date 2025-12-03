'use client';

import { useState, useEffect } from 'react';
import { 
  X, Mail, MapPin, Building, User, FileText,
  Sun, Wind, Battery, Activity, Server, 
  Edit2, Save, XCircle, Loader2, LogOut
} from 'lucide-react';
import { updateCampusConfig } from './actions'; 
import { useRouter } from 'next/navigation';
import type { CampusUser } from './page';

type ProfileProps = {
  isOpen: boolean;
  onClose: () => void;
  user: CampusUser; 
};

export default function ProfileSlideOver({ isOpen, onClose, user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CampusUser>(user);
  const router = useRouter();

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateCampusConfig(user.campus_admin_id, formData);
    setIsSaving(false);
    
    if (result.success) {
      setIsEditing(false);
      router.refresh(); 
    } else {
      alert(`Failed to save: ${result.message}`);
    }
  };

  // Helper for Input Fields
  const InputField = ({ label, name, icon: Icon, type = "text", placeholder = "" }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </label>
      {isEditing ? (
        <input 
          type={type} 
          name={name}
          value={formData[name as keyof CampusUser] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      ) : (
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-transparent truncate">
          {formData[name as keyof CampusUser] || <span className="text-slate-400 italic">Not set</span>}
        </p>
      )}
    </div>
  );

  // Helper for Energy Capacity Cards
  const CapacityField = ({ label, name, icon: Icon, color, bg, unit = "kW" }: any) => (
    <div className={`p-3 rounded-xl border ${isEditing ? 'bg-white dark:bg-slate-800 border-slate-300' : `${bg} border-transparent`} flex items-center justify-between transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isEditing ? 'bg-slate-100 text-slate-500' : 'bg-white/60'} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isEditing ? 'text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>{label}</p>
          {isEditing ? (
             <div className="flex items-center gap-1">
               <input 
                 type="number" 
                 name={name}
                 value={formData[name as keyof CampusUser]} 
                 onChange={handleChange}
                 className="w-20 font-bold bg-transparent border-b border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-800 dark:text-white"
               />
               <span className="text-xs text-slate-400">{unit}</span>
             </div>
          ) : (
             <p className={`text-lg font-bold ${isEditing ? 'text-slate-800' : 'text-slate-800 dark:text-white'}`}>
                {formData[name as keyof CampusUser]} <span className="text-xs font-normal opacity-70">{unit}</span>
             </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => { if(!isEditing) onClose(); }}
      />
      
      {/* Slide-over Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Profile Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">View and edit your information</p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                </>
              ) : (
                <>
                  <button onClick={() => { setFormData(user); setIsEditing(false); }} className="p-2 text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5"/></button>
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>} Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Identity Section (Name & Username) */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                  {formData.admin_name?.[0]?.toUpperCase() || 'A'}
               </div>
               <div className="flex-1 space-y-2">
                  <InputField label="Full Name" name="admin_name" icon={User} placeholder="e.g. John Doe" />
                  <InputField label="Username" name="username" icon={FileText} placeholder="e.g. admin_user" />
               </div>
            </div>

            {/* 2. Campus & Contact Information */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-500" /> Campus & Contact
              </h3>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                
                {/* Email Field */}
                <InputField label="Email Address" name="email" icon={Mail} placeholder="admin@campus.edu" />
                
                <div className="grid grid-cols-2 gap-4">
                   {/* Campus Name Field */}
                   <InputField label="Campus Name" name="campus_name" icon={Building} placeholder="Main Campus" />
                   
                   {/* Location Field */}
                   <InputField label="Location" name="location" icon={MapPin} placeholder="City, Country" />
                </div>
              </div>
            </section>

            {/* 3. Energy Configuration */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Energy Configuration
              </h3>
              
              {/* Load Limits */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-3">
                 <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase">
                    <Server className="w-3 h-3" /> Grid Load Limits
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <InputField label="Min Load (kW)" name="campus_load_min" icon={Activity} type="number" />
                    <InputField label="Max Load (kW)" name="campus_load_max" icon={Activity} type="number" />
                 </div>
              </div>

              {/* Capacities */}
              <div className="grid grid-cols-1 gap-2">
                 <CapacityField label="Solar Capacity" name="solar_capacity" icon={Sun} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
                 <CapacityField label="Wind Capacity" name="wind_capacity" icon={Wind} color="text-sky-600" bg="bg-sky-50 dark:bg-sky-900/20" />
                 <CapacityField label="Battery Capacity" name="battery_capacity" icon={Battery} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" unit="kWh" />
                 <CapacityField label="Max Grid Limit" name="max_grid_limit" icon={Server} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" />
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}