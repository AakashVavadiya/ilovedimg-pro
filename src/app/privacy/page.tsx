import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, Bell, Mail, ChevronRight, Cookie } from "lucide-react";

export const metadata = {
  title: "Privacy Policy – I Loved IMG",
  description: "Learn how I Loved IMG collects, uses, and protects your personal data. We are committed to your privacy.",
};

export default function PrivacyPage() {
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
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-xs font-black uppercase text-orange-400 tracking-widest">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed text-sm">
            Your privacy matters to us. This policy explains what information we collect, why we collect it, and how we use it when you use I Loved IMG.
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
                { id: "overview", label: "Overview" },
                { id: "data-collected", label: "Data We Collect" },
                { id: "how-we-use", label: "How We Use Data" },
                { id: "images", label: "Your Images" },
                { id: "cookies", label: "Cookies & Tracking" },
                { id: "third-party", label: "Third-Party Services" },
                { id: "data-security", label: "Data Security" },
                { id: "children", label: "Children's Privacy" },
                { id: "your-rights", label: "Your Rights" },
                { id: "changes", label: "Changes to Policy" },
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
            <Section id="overview" title="1. Overview" icon={<Eye className="w-5 h-5 text-orange-500" />}>
              <p>I Loved IMG ("we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and share information when you use our image processing tools and website.</p>
              <Highlight type="note">
                <strong>Privacy First:</strong> I Loved IMG is designed with a privacy-first approach. Most image processing happens locally in your browser or is processed server-side and immediately discarded. We do not build profiles from your image content.
              </Highlight>
            </Section>

            <Section id="data-collected" title="2. Data We Collect" icon={<Database className="w-5 h-5 text-orange-500" />}>
              <p>We collect minimal information to operate and improve our service:</p>
              <SubHeading>Automatically Collected Data</SubHeading>
              <ul>
                <li><strong>Usage Data:</strong> Anonymous information about how you interact with our tools (which tools you use, general performance metrics, errors encountered).</li>
                <li><strong>Device Information:</strong> Browser type, operating system, screen resolution, and language settings.</li>
                <li><strong>IP Address:</strong> Used briefly to detect geographic location for compliance and to detect abuse patterns. Not stored permanently.</li>
                <li><strong>Referrer URLs:</strong> The page that linked you to our service.</li>
              </ul>
              <SubHeading>Information You Provide</SubHeading>
              <ul>
                <li><strong>Contact Information:</strong> If you contact us via email, we collect the email address and content of your message.</li>
                <li><strong>Uploaded Files:</strong> Image files you upload for processing. See the "Your Images" section for full details.</li>
              </ul>
              <Highlight type="warning">
                We do not require account registration. We do not collect your name, email address, or personal details unless you voluntarily contact us.
              </Highlight>
            </Section>

            <Section id="how-we-use" title="3. How We Use Your Data" icon={<Shield className="w-5 h-5 text-orange-500" />}>
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li>To provide, operate, and maintain the Service.</li>
                <li>To improve, personalize, and expand the Service.</li>
                <li>To understand and analyze how you use the Service.</li>
                <li>To detect, prevent, and address technical issues and abuse.</li>
                <li>To respond to comments and questions from you.</li>
                <li>To comply with legal obligations.</li>
              </ul>
              <p>We do not sell, trade, or rent your personal identification information or image data to third parties.</p>
            </Section>

            <Section id="images" title="4. Your Images & Files" icon={<Lock className="w-5 h-5 text-orange-500" />}>
              <Highlight type="note">
                <strong>Your images belong to you.</strong> We do not claim ownership over any images you upload to our platform.
              </Highlight>
              <p>Here is how we handle your uploaded images:</p>
              <ul>
                <li><strong>Local Processing:</strong> Many tools operate entirely within your browser. In these cases, your images never leave your device.</li>
                <li><strong>Server Processing:</strong> For tools like background removal that require AI models, your image is temporarily sent to our secure servers to be processed. The image is immediately deleted after processing is complete (typically within seconds).</li>
                <li><strong>No Storage:</strong> We do not store, log, or analyze the content of your uploaded images.</li>
                <li><strong>No Training:</strong> Your images are never used to train AI models or for any machine learning purposes.</li>
              </ul>
            </Section>

            <Section id="cookies" title="5. Cookies & Tracking Technologies" icon={<Cookie className="w-5 h-5 text-orange-500" />}>
              <p>We use cookies and similar tracking technologies to enhance your experience on our platform:</p>
              <SubHeading>Essential Cookies</SubHeading>
              <p>Required for the Service to function, such as remembering your tool settings or preferences within a session. These cannot be disabled.</p>
              <SubHeading>Analytics Cookies</SubHeading>
              <p>We use anonymous analytics (e.g., aggregated page view counts) to understand how the platform is used. These do not identify you personally.</p>
              <SubHeading>Advertising Cookies</SubHeading>
              <p>We display third-party ads via Google AdSense to keep the Service free. Google may use cookies to serve relevant ads based on your browsing history. You can manage Google's ad personalization at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">adssettings.google.com</a>.</p>
              <p>You can control cookies through your browser settings. Note that disabling cookies may affect some functionality of the Service.</p>
            </Section>

            <Section id="third-party" title="6. Third-Party Services" icon={<Database className="w-5 h-5 text-orange-500" />}>
              <p>We use a limited number of carefully selected third-party services:</p>
              <ul>
                <li><strong>Google AdSense:</strong> Displays advertisements to fund the free service. Subject to Google's Privacy Policy.</li>
                <li><strong>Hosting & CDN:</strong> Our infrastructure is hosted on cloud services with strong data protection standards.</li>
              </ul>
              <p>These third-party services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these external providers.</p>
            </Section>

            <Section id="data-security" title="7. Data Security" icon={<Lock className="w-5 h-5 text-orange-500" />}>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul>
                <li>All data in transit is encrypted using HTTPS/TLS.</li>
                <li>Server-side processing uses isolated, ephemeral containers.</li>
                <li>Uploaded images are processed in memory and never written to permanent disk storage.</li>
                <li>We regularly review our security practices and update them as needed.</li>
              </ul>
              <Highlight type="warning">
                No method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </Highlight>
            </Section>

            <Section id="children" title="8. Children's Privacy" icon={<Shield className="w-5 h-5 text-orange-500" />}>
              <p>Our Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.</p>
              <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
            </Section>

            <Section id="your-rights" title="9. Your Rights" icon={<Eye className="w-5 h-5 text-orange-500" />}>
              <p>Depending on your location, you may have certain rights regarding your personal data:</p>
              <ul>
                <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> Request correction of any inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data where applicable.</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data for certain purposes.</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data in a machine-readable format.</li>
              </ul>
              <p>Since we collect minimal data and do not store images, most of these rights are automatically satisfied by design. To exercise any rights, please contact us using the information below.</p>
            </Section>

            <Section id="changes" title="10. Changes to This Privacy Policy" icon={<Bell className="w-5 h-5 text-orange-500" />}>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we update the policy, we will revise the "Last Updated" date at the top of this page.</p>
              <p>We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of the Service after any changes constitutes your acceptance of the updated Privacy Policy.</p>
            </Section>

            <Section id="contact" title="11. Contact Us" icon={<Mail className="w-5 h-5 text-orange-500" />}>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <p className="text-sm font-black text-slate-800">I Loved IMG – Privacy Team</p>
                <p className="text-xs text-slate-500 font-semibold">Email: <a href="mailto:privacy@ilovedimg.com" className="text-orange-600 hover:underline">privacy@ilovedimg.com</a></p>
                <p className="text-xs text-slate-500 font-semibold">Website: <a href="/" className="text-orange-600 hover:underline">ilovedimg.com</a></p>
              </div>
              <p>We aim to respond to all privacy-related inquiries within 30 business days.</p>
            </Section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 font-bold">© {new Date().getFullYear()} I Loved IMG. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
            <Link href="/terms" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy" className="text-orange-600">Privacy Policy</Link>
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1.5">{children}</h3>;
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
