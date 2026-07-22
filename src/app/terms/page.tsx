import Link from "next/link";
import { ArrowLeft, Shield, FileText, AlertCircle, Globe, Mail, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service – I Loved IMG",
  description: "Read our Terms of Service to understand the rules and guidelines for using I Loved IMG's image processing tools.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-xs font-black uppercase text-orange-400 tracking-widest">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed text-sm">
            Please read these Terms of Service carefully before using I Loved IMG. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <p className="text-slate-500 text-xs font-bold mt-4">Last Updated: July 6, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">On this page</p>
              {[
                { id: "acceptance", label: "Acceptance of Terms" },
                { id: "services", label: "Use of Services" },
                { id: "privacy", label: "Privacy" },
                { id: "ip", label: "Intellectual Property" },
                { id: "disclaimer", label: "Disclaimer" },
                { id: "limitation", label: "Limitation of Liability" },
                { id: "changes", label: "Changes to Terms" },
                { id: "contact", label: "Contact Us" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-orange-600 transition-colors py-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-10">
            <Section id="acceptance" title="1. Acceptance of Terms" icon={<Shield className="w-5 h-5 text-orange-500" />}>
              <p>By accessing or using I Loved IMG (the "Service"), you confirm that you are at least 13 years of age, have read and understood these Terms of Service ("Terms"), and agree to be legally bound by them.</p>
              <p>If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and by accepting these Terms, you are doing so on behalf of that organization.</p>
              <p>If you do not agree to these Terms, do not use our Service.</p>
            </Section>

            <Section id="services" title="2. Use of Services" icon={<Globe className="w-5 h-5 text-orange-500" />}>
              <p>I Loved IMG provides browser-based and local image processing tools, including but not limited to: compression, resizing, cropping, background removal, watermarking, format conversion, and batch processing.</p>
              <Highlight type="note">
                Most image processing operations are performed locally in your browser or on our secure servers. We do not retain or store your uploaded images beyond the time necessary to process and return the result.
              </Highlight>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful, harmful, or fraudulent purpose.</li>
                <li>Upload images containing illegal, harmful, hateful, obscene, or copyrighted content without proper authorization.</li>
                <li>Attempt to circumvent, disable, or interfere with security-related features of the Service.</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
                <li>Use automated scripts or bots to abuse our infrastructure or exceed reasonable usage limits.</li>
                <li>Resell, sublicense, or commercially exploit the Service without our written consent.</li>
              </ul>
              <p>We reserve the right to terminate or restrict your access to the Service at any time, without notice, for any reason, including if we believe you have violated these Terms.</p>
            </Section>

            <Section id="privacy" title="3. Privacy" icon={<Shield className="w-5 h-5 text-orange-500" />}>
              <p>Your use of the Service is also governed by our <Link href="/privacy" className="text-orange-600 hover:underline font-bold">Privacy Policy</Link>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.</p>
              <p>By using the Service, you consent to the collection and use of information as described in our Privacy Policy.</p>
            </Section>

            <Section id="ip" title="4. Intellectual Property" icon={<FileText className="w-5 h-5 text-orange-500" />}>
              <p>The Service and its original content, features, functionality, branding, and interface design are and will remain the exclusive property of I Loved IMG and its licensors. Our trademarks, service marks, logos, and trade names may not be used without our prior written consent.</p>
              <p>You retain all rights to the images you upload. By using our tools, you grant us a limited, non-exclusive, royalty-free license solely to process your images in order to provide the Service to you. This license terminates once processing is complete.</p>
            </Section>

            <Section id="disclaimer" title="5. Disclaimer of Warranties" icon={<AlertCircle className="w-5 h-5 text-orange-500" />}>
              <Highlight type="warning">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </Highlight>
              <p>We do not warrant that:</p>
              <ul>
                <li>The Service will be uninterrupted, timely, secure, or error-free.</li>
                <li>The results obtained from use of the Service will be accurate or reliable.</li>
                <li>Any errors or defects in the Service will be corrected.</li>
              </ul>
              <p>Some jurisdictions do not allow exclusion of implied warranties, so the above exclusion may not apply to you.</p>
            </Section>

            <Section id="limitation" title="6. Limitation of Liability" icon={<AlertCircle className="w-5 h-5 text-orange-500" />}>
              <p>To the fullest extent permitted by applicable law, I Loved IMG and its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul>
                <li>Your access to or use of (or inability to access or use) the Service.</li>
                <li>Any conduct or content of any third party on the Service.</li>
                <li>Any content obtained from the Service.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
              <p>In no event shall our total liability to you for all claims exceed the amount you paid us, if any, in the past six months for using the Service.</p>
            </Section>

            <Section id="changes" title="7. Changes to These Terms" icon={<Globe className="w-5 h-5 text-orange-500" />}>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to the new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
              <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
            </Section>

            <Section id="contact" title="8. Contact Us" icon={<Mail className="w-5 h-5 text-orange-500" />}>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <p className="text-sm font-black text-slate-800">I Loved IMG</p>
                <p className="text-xs text-slate-500 font-semibold">Email: <a href="mailto:legal@ilovedimg.com" className="text-orange-600 hover:underline">legal@ilovedimg.com</a></p>
                <p className="text-xs text-slate-500 font-semibold">Website: <a href="/" className="text-orange-600 hover:underline">ilovedimg.com</a></p>
              </div>
            </Section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 font-bold">© {new Date().getFullYear()} I Loved IMG. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
            <Link href="/terms" className="text-orange-600">Terms of Service</Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-base font-black text-slate-800">{title}</h2>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 text-sm text-slate-600 font-medium leading-relaxed shadow-sm">
        {children}
      </div>
    </section>
  );
}

function Highlight({ type, children }: { type: "note" | "warning"; children: React.ReactNode }) {
  const styles = type === "warning"
    ? "bg-amber-50 border-amber-200 text-amber-900"
    : "bg-blue-50 border-blue-200 text-blue-900";
  return (
    <div className={`border rounded-2xl p-4 text-xs font-semibold leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}
