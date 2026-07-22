// I Loved IMG - Created By Uniqrs Studio
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Search,
  X,
  ChevronDown,
  Minimize2,
  Maximize2,
  Crop,
  FileImage,
  RefreshCcw,
  ZoomIn,
  Layers,
  Droplets,
  RotateCw,
  Code2,
  Sliders,
  BookOpen,
} from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const HEADER_TOOLS: ToolItem[] = [
  { id: "compress-image", name: "Compress Image", icon: Minimize2, color: "text-blue-500", description: "Reduce image file size" },
  { id: "resize-image", name: "Resize Image", icon: Maximize2, color: "text-purple-500", description: "Resize dimensions" },
  { id: "crop-image", name: "Crop Image", icon: Crop, color: "text-emerald-500", description: "Crop aspect ratio" },
  { id: "convert-to-jpg", name: "Convert to JPG", icon: FileImage, color: "text-amber-500", description: "Convert to JPG format" },
  { id: "convert-from-jpg", name: "Convert from JPG", icon: RefreshCcw, color: "text-pink-500", description: "Convert from JPG format" },
  { id: "upscale-image", name: "Upscale Image", icon: ZoomIn, color: "text-violet-500", description: "AI upscale resolution" },
  { id: "remove-bg", name: "Remove Background", icon: Layers, color: "text-fuchsia-500", description: "AI remove background" },
  { id: "watermark-image", name: "Watermark Image", icon: Droplets, color: "text-sky-500", description: "Add text or image watermark" },
  { id: "rotate-image", name: "Rotate Image", icon: RotateCw, color: "text-red-500", description: "Rotate or flip images" },
  { id: "html-to-image", name: "HTML to Image", icon: Code2, color: "text-teal-500", description: "Convert HTML/URL to image" },
  { id: "blur-face", name: "Blur Face Tool", icon: Sliders, color: "text-indigo-500", description: "Detect and blur faces" },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync state with URL search param on mount or URL change
  useEffect(() => {
    const searchVal = searchParams.get("search") || "";
    setSearchQuery(searchVal);
  }, [searchParams]);

  // Handle outside clicks to close dropdown or search results
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    // If we're on the homepage, filter in-place. If we're on a tool page, typing should send us back to home page with search or show search results list
    const isHomePage = window.location.pathname === "/";
    if (isHomePage) {
      if (val.trim()) {
        router.push(`/?search=${encodeURIComponent(val)}`);
      } else {
        router.push("/");
      }
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    router.push("/");
  };

  // Find matching tools for search dropdown (mostly when on tool pages or autocomplete)
  const matchingTools = HEADER_TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/85 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5.5 h-5.5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none block">
              I Loved IMG
            </span>
            <span className="text-[9px] text-orange-600 font-black uppercase tracking-wider block mt-0.5">
              Bulk Editor
            </span>
          </div>
        </Link>

        {/* Tools Dropdown Shortcut */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <span>All Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-[480px] max-w-[90vw] bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 grid grid-cols-2 gap-2 z-50 overflow-hidden"
              >
                {HEADER_TOOLS.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setDropdownOpen(false);
                        if (tool.id === "remove-bg") {
                          window.open("https://www.removebg.co.in/", "_blank");
                        } else {
                          router.push(`/tools/image/${tool.id}`);
                        }
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${tool.color} group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors`}>
                        <ToolIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800 group-hover:text-orange-600 transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold leading-tight">
                          {tool.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/blog"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition-all border border-transparent hover:border-orange-200"
        >
          <BookOpen className="w-3.5 h-3.5 text-orange-500" />
          <span>Articles</span>
        </Link>
      </div>
    </div>

      {/* Search Bar in Header */}
      <div className="relative flex items-center" ref={searchRef}>
        <div className={`flex items-center bg-slate-50 border rounded-2xl px-3 py-2 w-32 focus-within:w-40 sm:w-64 sm:focus-within:w-80 transition-all duration-300 ${searchFocused ? "border-orange-500 ring-2 ring-orange-500/10" : "border-slate-200/80"}`}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-800 px-2 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={handleSearchClear}
              className="text-slate-400 hover:text-slate-600 shrink-0"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Autocomplete List when on tool details page */}
        <AnimatePresence>
          {searchFocused && searchQuery.trim() && window.location.pathname !== "/" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-12 top-0 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto"
            >
              <div className="text-[10px] font-black uppercase text-slate-400 px-3 py-1 border-b mb-1">
                Suggested Tools ({matchingTools.length})
              </div>
              {matchingTools.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSearchFocused(false);
                      setSearchQuery("");
                      if (tool.id === "remove-bg") {
                        window.open("https://www.removebg.co.in/", "_blank");
                      } else {
                        router.push(`/tools/image/${tool.id}`);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 ${tool.color}`}>
                      <ToolIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{tool.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold">{tool.description}</div>
                    </div>
                  </button>
                );
              })}
              {matchingTools.length === 0 && (
                <div className="p-4 text-center text-xs font-bold text-slate-400">
                  No matching tools found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
