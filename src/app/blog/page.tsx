import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { BLOG_ARTICLES } from "@/lib/blogArticles";
import { Metadata } from "next";
import { BookOpen, ArrowRight, Sparkles, Clock, Calendar, CheckCircle2, Search, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Editing Guides & Articles | ImageTool Blog",
  description: "Explore in-depth guides, technical tutorials, and tips on converting HTML to image, background removal, AI upscaling, photo compression, and image privacy.",
  keywords: [
    "Image Editing Blog",
    "HTML to Image Guide",
    "Background Removal Tutorial",
    "Compress JPG PNG Guide",
    "AI Photo Upscale Tips",
    "Image Privacy Guides"
  ],
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Free Tutorials & Technical Guides
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Master Image Editing, AI Upscaling & Web Optimization
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Discover expert step-by-step guides for our 11 powerful online image tools. Learn how to convert HTML to images, remove background colors, compress files without quality loss, and protect photo privacy.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Main Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Main Articles Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-600" /> Featured Articles ({BLOG_ARTICLES.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select an article below to read detailed step-by-step instructions and best practices.
            </p>
          </div>
        </div>

        {/* 11 Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((article, idx) => (
            <article
              key={article.slug}
              className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-300 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-orange-100">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <Clock className="w-3 h-3 text-slate-400" /> {article.readTime}
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-850 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                  <Calendar className="w-3 h-3 text-slate-400" /> {article.publishDate}
                </div>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-black text-orange-600 group-hover:text-orange-700 transition-all"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ImageTool Blog. All rights reserved. Free, online, browser-based image processing tools.
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
