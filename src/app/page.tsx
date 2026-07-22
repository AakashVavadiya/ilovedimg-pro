"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Crop,
  FileImage,
  RefreshCcw,
  ZoomIn,
  Sparkles,
  Droplets,
  RotateCw,
  Code2,
  ShoppingBag,
  Sliders,
  Layers,
  Wand2,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import AdBanner from "@/components/AdBanner";

interface ImageTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgGradient: string;
  tag?: string;
  isAi?: boolean;
  externalUrl?: string;
}

const IMAGE_TOOLS: ImageTool[] = [
  {
    id: "compress-image",
    name: "Compress Image",
    description: "Reduce image file size of JPG, PNG or WEBP with the best quality and compression.",
    icon: Minimize2,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "resize-image",
    name: "Resize Image",
    description: "Resize images to custom width/height dimensions with aspect ratio lock.",
    icon: Maximize2,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "crop-image",
    name: "Crop Image",
    description: "Crop images to any aspect ratio or custom dimensions with precision guides.",
    icon: Crop,
    color: "text-emerald-600",
    bgGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "convert-to-jpg",
    name: "Convert to JPG",
    description: "Convert PNG, WEBP, AVIF, TIFF, or GIF images to standard JPG format.",
    icon: FileImage,
    color: "text-amber-600",
    bgGradient: "from-amber-500 to-orange-500",
  },
  {
    id: "convert-from-jpg",
    name: "Convert from JPG",
    description: "Convert JPG images to PNG, WEBP, AVIF, GIF, or BMP formats easily.",
    icon: RefreshCcw,
    color: "text-pink-600",
    bgGradient: "from-pink-500 to-rose-500",
  },
  {
    id: "upscale-image",
    name: "Upscale Image",
    description: "AI-powered image upscaling — boost resolution up to 4× with Lanczos/Bicubic filters.",
    icon: ZoomIn,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-500",
    isAi: true,
    tag: "AI",
  },
  {
    id: "remove-bg",
    name: "Remove Background",
    description: "Instantly remove image background and create a transparent cutout clean cutout.",
    icon: Layers,
    color: "text-rose-600",
    bgGradient: "from-rose-500 to-pink-600",
    isAi: true,
    tag: "AI",
    externalUrl: "https://www.removebg.co.in/",
  },
  {
    id: "watermark-image",
    name: "Watermark Image",
    description: "Overlay custom text or an image watermark onto your photo with transparency controls.",
    icon: Droplets,
    color: "text-sky-600",
    bgGradient: "from-sky-500 to-blue-600",
  },
  {
    id: "rotate-image",
    name: "Rotate Image",
    description: "Rotate images clockwise, counter-clockwise, or flip horizontally/vertically.",
    icon: RotateCw,
    color: "text-red-600",
    bgGradient: "from-red-500 to-rose-600",
  },
  {
    id: "html-to-image",
    name: "HTML to Image",
    description: "Upload your HTML files (.html, .htm) and convert them directly into PNG images.",
    icon: Code2,
    color: "text-teal-600",
    bgGradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "blur-face",
    name: "Blur Face Tool",
    description: "Detect and blur faces in images locally and securely using face detection.",
    icon: Sliders,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-purple-600",
  },
];

const TABS = [
  { id: "all", label: "All Tools" },
  { id: "standard", label: "Standard" },
  { id: "ai", label: "AI Enhanced" },
] as const;

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [activeTab, setActiveTab] = useState<"all" | "standard" | "ai">("all");

  const filteredTools = IMAGE_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "ai") return matchesSearch && tool.isAi;
    return matchesSearch && !tool.isAi;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Reusable Premium Navigation Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-8 px-4 sm:px-6 bg-white border-b border-slate-200/50">
        <div className="absolute inset-0 bg-grid-slate-50 pointer-events-none opacity-60" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Heading, description, and Switch */}
          <div className="md:col-span-7 text-left space-y-5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Every tool you need to <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Edit Images</span> in bulk
            </h1>

            <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed max-w-xl">
              Compress, resize, crop, convert, and watermark images in seconds. Supercharge your productivity with local AI upscale and background removal.
            </p>

            {/* Wobbly style animated switch */}
            <div className="pt-3">
              <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 relative">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative z-10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                        isActive ? "text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.id === "ai" && <Wand2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="wobbly-active-tab"
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl -z-10 shadow-md shadow-orange-500/25"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[450px] aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 p-2 shadow-sm">
              <img
                src="/hero.png"
                alt="I Loved IMG Hero Graphic"
                className="w-full h-full object-cover rounded-2xl animate-fade-in hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User-friendly Horizontal Ad Banner below Hero */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-4">
        <AdBanner slot="banner" />
      </div>

      {/* Tools Grid Section */}
      <section className="flex-1 w-full max-w-[1500px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <React.Fragment key={tool.id}>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group relative"
                >
                {tool.externalUrl ? (
                  <a
                    href={tool.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full p-7 bg-white rounded-3xl border border-slate-200/80 hover:border-orange-200/80 transition-all duration-350 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-500 transition-all shadow-sm">
                        <Icon className={`w-6 h-6 ${tool.color} group-hover:text-white transition-colors`} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base md:text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors tracking-tight">
                            {tool.name}
                          </h3>
                          {tool.tag && (
                            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wider">
                              {tool.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 font-bold leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-xs font-black text-orange-600 uppercase tracking-wider gap-1.5 group-hover:gap-2 transition-all">
                      <span>Visit Site</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </a>
                ) : (
                  <Link
                    href={`/tools/image/${tool.id}`}
                    className="block h-full p-7 bg-white rounded-3xl border border-slate-200/80 hover:border-orange-200/80 transition-all duration-350 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Tool Icon Container using custom gradient and active orange coloring */}
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-500 transition-all shadow-sm">
                        <Icon className={`w-6 h-6 ${tool.color} group-hover:text-white transition-colors`} />
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base md:text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors tracking-tight">
                            {tool.name}
                          </h3>
                          {tool.tag && (
                            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wider">
                              {tool.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 font-bold leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-xs font-black text-orange-600 uppercase tracking-wider gap-1.5 group-hover:gap-2 transition-all">
                      <span>Open Tool</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                )}
              </motion.div>
            </React.Fragment>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-150 flex items-center justify-center mx-auto">
              <Sliders className="w-4.5 h-4.5 text-slate-400" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">No matching image tools found</p>
            <p className="text-[11px] text-slate-400 font-medium">Try checking your search query parameters</p>
          </div>
        )}
      </section>

      <div className="w-full max-w-7xl mx-auto px-6 mb-8">
        <AdBanner slot="banner" />
      </div>

      {/* Proper Premium Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                I Loved IMG
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-md">
              Supercharge your bulk image workflows. Simple, high-quality processing tools
            </p>
          </div>

          <div className="space-y-3 md:justify-self-end">
            <h4 className="text-xs md:text-sm font-black uppercase text-slate-400 tracking-wider">Legal Policies</h4>
            <ul className="space-y-2 text-xs md:text-sm font-bold uppercase text-slate-500">
              <li>
                <Link href="/terms" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-xs font-black uppercase text-slate-400 tracking-widest gap-4">
          <div>© 2026 I Loved IMG • All rights reserved</div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50">Loading I Loved IMG...</div>}>
      <HomeContent />
    </Suspense>
  );
}
