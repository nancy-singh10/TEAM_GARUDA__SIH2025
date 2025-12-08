import Link from "next/link";

export default function SecurityPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Security Policy</h1>
      <p className="mb-4">Security standards &amp; practices used.</p>
      <p className="mb-4">[Add contact for reporting security issues and responsible disclosure instructions if desired.]</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
