import Link from "next/link";

export default function HyperlinkingPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Hyperlinking Policy</h1>
      <p className="mb-4">Rules for linking to or from the website.</p>
      <p className="mb-4">[Add specifics about required attribution, forbidden framing, and contact for linking permissions.]</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
