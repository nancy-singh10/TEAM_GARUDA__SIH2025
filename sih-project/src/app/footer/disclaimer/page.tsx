import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="mb-4">Legal disclaimer about responsibility for accuracy.</p>
      <p className="mb-4">[Add additional legal disclaimers as required.]</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
