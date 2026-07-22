// I Loved IMG - Created By Uniqrs Studio
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { BLOG_ARTICLES, BlogArticle } from "@/lib/blogArticles";
import { Metadata } from "next";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  
  if (!article) {
    return {
      title: "Article Not Found | ImageTool Blog",
    };
  }

  return {
    title: `${article.metaTitle} | ImageTool Guides`,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const isExternalTool = article.toolPath.startsWith("http");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <Header />

      {/* Breadcrumb & Article Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">{article.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> {article.category}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" /> {article.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.publishDate}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Prominent Call to Action Box for Tool */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-orange-100">
              <Wrench className="w-4 h-4" /> Ready to Use The Tool?
            </div>
            <p className="text-sm sm:text-base font-bold text-white">
              Launch our free online tool to get instant results directly in your browser.
            </p>
          </div>

          {isExternalTool ? (
            <a
              href={article.toolPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-orange-700 font-black text-xs shadow-md transition-all whitespace-nowrap"
            >
              Open Tool Online <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={article.toolPath}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-orange-700 font-black text-xs shadow-md transition-all whitespace-nowrap"
            >
              Try Tool Now <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Article Content Body */}
        <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Intro Paragraph */}
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal border-l-4 border-orange-500 pl-4 bg-orange-50/50 py-3 rounded-r-xl">
            {article.content.intro}
          </div>

          {/* Dynamic Article Sections */}
          <div className="space-y-8">
            {article.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-850 tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> {section.heading}
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {section.body}
                </p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Comparison Table Section if available */}
          {article.content.comparisonTable && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> {article.content.comparisonTable.title}
              </h3>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 font-black text-slate-800 uppercase tracking-wider text-[11px]">
                      {article.content.comparisonTable.headers.map((head, hIdx) => (
                        <th key={hIdx} className="p-3 sm:p-4">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white text-xs sm:text-sm">
                    {article.content.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-slate-900">{row.feature}</td>
                        <td className="p-3 sm:p-4 text-emerald-700 font-semibold">{row.tool}</td>
                        <td className="p-3 sm:p-4 text-slate-500 font-semibold">{row.screenshot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQs Section */}
          {article.content.faqs && article.content.faqs.length > 0 && (
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <h3 className="text-base sm:text-lg font-black text-slate-850 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-600" /> Frequently Asked Questions
              </h3>

              <div className="grid gap-4">
                {article.content.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">
                      Q: {faq.question}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Footer Navigation Back to Blog */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 text-slate-700 font-black text-xs shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-orange-600" /> Back to All Articles
          </Link>

          {isExternalTool ? (
            <a
              href={article.toolPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition-all"
            >
              Open Tool <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={article.toolPath}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition-all"
            >
              Try Tool <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ImageTool Guides. Free online image utility tools.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
