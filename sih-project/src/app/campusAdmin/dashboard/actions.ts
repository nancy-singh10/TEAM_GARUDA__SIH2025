'use server';

import supabaseAdmin from '../../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

// Updated to match your schema and the profile form
type CampusProfileUpdate = {
  // Personal & Campus Info
  username: string;
  admin_name: string;
  campus_name: string;
  location: string;
  email: string;

  // Energy Config (Keeping these as they are part of the table)
  campus_load_min: number;
  campus_load_max: number;
  solar_capacity: number;
  wind_capacity: number;
  battery_capacity: number;
  max_grid_limit: number;
};

export async function updateCampusConfig(adminId: string, data: CampusProfileUpdate) {
  try {
    const { error } = await supabaseAdmin
      .from('campus_admin')
      .update({
        // Text Fields
        username: data.username,
        admin_name: data.admin_name,
        campus_name: data.campus_name,
        location: data.location,
        email: data.email,

        // Numeric Fields
        campus_load_min: data.campus_load_min,
        campus_load_max: data.campus_load_max,
        solar_capacity: data.solar_capacity,
        wind_capacity: data.wind_capacity,
        battery_capacity: data.battery_capacity,
        max_grid_limit: data.max_grid_limit
      })
      .eq('campus_admin_id', adminId);

    if (error) throw error;

    revalidatePath('/campusAdmin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Update failed:', error);
    return { success: false, message: error.message };
  }
}