import supabaseAdmin from '@/lib/supabaseServer';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
import HeaderCampus from '@/components/ui/header_campus'; // Assuming this is your green header

// Reuse the same user type
type CampusUser = {
  campus_admin_id: string;
  username: string;
  admin_name: string;
  email: string;
  campus_name: string;
  location: string;
  // ... other fields
};

async function fetchUserProfile() {
  try {
    const cookieStore = await cookies();
    const campusCookie = cookieStore.get('campus_admin_id');

    // Fallback logic similar to your dashboard page
    let query = supabaseAdmin.from('campus_admin').select('*');

    if (campusCookie) {
      query = query.eq('campus_admin_id', campusCookie.value);
    } else {
      // No cookie found, return null
      return null;
    }

    const { data: user } = await query.maybeSingle();
    return user as CampusUser;
  } catch (err) {
    return null;
  }
}

export default async function CampusAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await fetchUserProfile();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Pass the fetched user to the Header */}
      <HeaderCampus user={user} />
      <main>
        {children}
      </main>
    </div>
  );
}