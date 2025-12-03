"use client";

export default function CampusRankingTable({ campuses, onRowClick }) {
  
  // Create a sorted copy of the data (High to Low usage)
  // We use [...campuses] to ensure we don't mutate the original prop array
  const sorted = [...campuses].sort((a, b) => b.renewable_usage - a.renewable_usage);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Campus Renewable Ranking
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-slate-500 dark:text-slate-400">
              <th className="pb-3 px-2">Rank</th>
              <th className="pb-3 px-2">Campus</th>
              <th className="pb-3 px-2">Location</th>
              <th className="pb-3 px-2">Admin</th>
              <th className="pb-3 px-2">Usage</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((campus, index) => (
              <tr 
                key={campus.id} 
                // 1. Trigger the zoom function passed from parent
                onClick={() => onRowClick(campus)}
                // 2. Add cursor pointer and hover effects for interactivity
                className="border-t border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                {/* Dynamically calculate rank based on sort order (index + 1) */}
                <td className="py-3 px-2 font-bold text-indigo-600 dark:text-indigo-400">
                  #{index + 1}
                </td>

                <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">
                  {campus.name}
                </td>

                <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                  {campus.location || "N/A"}
                </td>

                <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                  {campus.admin || "N/A"}
                </td>

                <td className="py-3 px-2 font-semibold">
                  <span className={`
                    ${campus.renewable_usage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : ''}
                    ${campus.renewable_usage < 75 && campus.renewable_usage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : ''}
                    ${campus.renewable_usage < 50 ? 'text-red-600 dark:text-red-400' : ''}
                  `}>
                    {campus.renewable_usage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}