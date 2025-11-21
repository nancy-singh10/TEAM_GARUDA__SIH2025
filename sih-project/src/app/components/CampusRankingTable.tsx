"use client";

export default function CampusRankingTable() {
  const campuses = [
    {
      id: 1,
      rank: 2,
      name: "Jaipur University",
      location: "Jaipur, Rajasthan",
      admin: "Dr. Mehra",
      renewable_usage: 65,
    },
    {
      id: 2,
      rank: 1,
      name: "Udaipur Tech Campus",
      location: "Udaipur, Rajasthan",
      admin: "Prof. Sharma",
      renewable_usage: 80,
    },
  ];

  // Sort by renewable usage (descending)
  const sorted = campuses.sort((a, b) => b.renewable_usage - a.renewable_usage);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Campus Renewable Ranking
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm text-slate-500 dark:text-slate-400">
            <th className="pb-3">Rank</th>
            <th className="pb-3">Campus</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">Admin</th>
            <th className="pb-3">Usage</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((campus) => (
            <tr key={campus.id} className="border-t border-slate-200 dark:border-slate-700">
              <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">{campus.rank}</td>

              <td className="py-3 font-medium text-slate-900 dark:text-white">
                {campus.name}
              </td>

              <td className="py-3 text-slate-600 dark:text-slate-300">
                {campus.location}
              </td>

              <td className="py-3 text-slate-600 dark:text-slate-300">
                {campus.admin}
              </td>

              <td className="py-3 font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {campus.renewable_usage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
