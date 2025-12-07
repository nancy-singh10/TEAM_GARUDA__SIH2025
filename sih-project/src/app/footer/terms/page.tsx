import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms &amp; Conditions</h1>
      <p className="mb-4">Rules for using the website.</p>
      <p className="mb-4">In case of any variance between what has been stated and that contained in the relevant Act, Rules, Regulations, Policy Statements etc, the latter shall prevail.

Certain links on the website lead to resources located on other websites maintained by third parties over whom MNRE has no control or connection. These websites are external to MNRE and by visiting these; you are outside the MNRE website and its channels. MNRE neither endorses in any way nor offers any judgment or warranty and accepts no responsibility or liability for the authenticity, availability of any of the goods or services or for any damage, loss or harm, direct or consequential or any violation of local or international laws that may be incurred by your visiting and transacting on these websites.</p>
      <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to home</Link>
    </main>
  );
}
