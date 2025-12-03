import { cookies } from 'next/headers';
import HeaderState from '@/components/ui/header_state';

type StateUser = {
  admin_name: string;
  state_name: string;
  email: string;
  location: string;
  username: string;
  state_admin_id?: string;
};

async function getStateUser(): Promise<StateUser | null> {
  try {
    const cookieStore = await cookies();
    const stateAdminId = cookieStore.get('state_admin_id')?.value;

    if (!stateAdminId) {
      return null;
    }

    // Fetch user data from API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stateAdmin/profile?state_admin_id=${stateAdminId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user || null;
  } catch (error) {
    console.error('Error fetching state user:', error);
    return null;
  }
}

export default async function StateAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getStateUser();

  return (
    <>
      <HeaderState user={user} />
      {children}
    </>
  );
}
