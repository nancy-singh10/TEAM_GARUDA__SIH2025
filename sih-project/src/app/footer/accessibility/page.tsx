import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Accessibility Statement</h1>
      <p className="mb-4">Info about compliance with guidelines like WCAG.</p>
      <p className="mb-4">[Add details about compliance level, testing, and contact channels for accessibility requests.]</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
