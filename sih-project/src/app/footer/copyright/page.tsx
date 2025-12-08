import Link from "next/link";

export default function CopyrightPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Copyright Policy</h1>
      <p className="mb-4">Rights &amp; permissions for using site content.</p>
      <p className="mb-4">[Add DMCA/contact information and permission procedures if necessary.]</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
