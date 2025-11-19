export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-amber-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Revolutionize Your Energy Management
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600">
            Transform your campus into a smart energy ecosystem with real-time monitoring, predictive
            analytics, and automated optimization.
          </p>
        </section>

        {/* Cards */}
        <section className="-mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-start gap-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg p-3">
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Real-Time Monitoring</h3>
              <p className="mt-2 text-sm text-slate-600">Track solar, wind, battery, and grid usage with live data visualization</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-start gap-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3">
              <span className="text-3xl">🔮</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Smart Predictions</h3>
              <p className="mt-2 text-sm text-slate-600">AI-powered forecasting for optimal energy distribution and storage</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-start gap-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Carbon Savings</h3>
              <p className="mt-2 text-sm text-slate-600">Monitor your environmental impact with detailed sustainability reports</p>
            </div>
          </article>
        </section>

        {/* Access buttons */}
        <section className="mt-8 flex justify-center">
          <div className="inline-flex gap-4">
            <a
              href="/stateAdmin/auth"
              className="inline-block bg-slate-900 text-white px-6 py-3 rounded-full shadow hover:shadow-lg transition-shadow duration-150"
              aria-label="State admin access login or signup"
            >
              State Admin Access
            </a>
            <a
              href="/campusAdmin/auth"
              className="inline-block bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-full shadow hover:bg-slate-50 transition-colors duration-150"
              aria-label="Campus admin access login or signup"
            >
              Campus Admin Access
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
