import { supabaseAdmin } from '@/lib/supabaseServer';
import RankingClient from './RankingClient';

// Revalidate every minute to refresh "random" rankings for demo purposes
export const revalidate = 60;

async function getCampusRankings() {
    const { data: campuses, error } = await supabaseAdmin
        .from('campus_admin')
        .select('campus_admin_id, campus_name, location, admin_name');

    if (error) {
        console.error('Error fetching campuses:', error);
        return [];
    }

    // Add random token/score for ranking
    const rankedCampuses = (campuses || []).map((campus) => {
        return {
            ...campus,
            // Sample values: Monthly (100-1000), Overall (5000-50000)
            monthly_tokens: Math.floor(Math.random() * 900) + 100,
            overall_tokens: Math.floor(Math.random() * 45000) + 5000,
        };
    });

    return rankedCampuses;
}

export default async function CampusRankingPage() {
    const rankings = await getCampusRankings();

    return <RankingClient initialRankings={rankings} />;
}
