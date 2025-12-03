export const dynamic = 'force-dynamic';
import supabaseAdmin from '../../../lib/supabaseServer';
import { cookies } from 'next/headers';
import ProfileForm from './ProfileForm';

// Define User Type
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

async function fetchUserProfile() {
  try {
    const cookieStore = await cookies();
    const campusCookie = cookieStore.get('campus_admin_id');
    // Default to '3' for demo/testing if cookie is missing
    const adminId = campusCookie ? campusCookie.value : '3'; 

    const { data: user, error } = await supabaseAdmin
      .from('campus_admin')
      .select('*')
      .eq('campus_admin_id', adminId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return user as CampusUser;
  } catch (err) {
    return null;
  }
}

export default async function ProfilePage() {
  const user = await fetchUserProfile();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">User not found</h2>
          <p className="text-slate-500 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <ProfileForm user={user} />
    </div>
  );
}