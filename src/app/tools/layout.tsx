"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  FileText,
  Image as ImageIcon,
  Barcode,
  Search,
  Wrench,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import AdBanner from "@/components/AdBanner";

function ToolsLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryParam = searchParams.get("category");

  // Determine active item based on current URL path or search query parameter
  const getActiveItem = () => {
    if (pathname.includes("/tools/pdf/")) return "pdf";
    if (pathname.includes("/tools/image/")) return "image";
    if (pathname.includes("/tools/barcode/")) return "barcode";
    if (pathname.includes("/tools/research/")) return "research";

    if (pathname === "/tools") {
      if (activeCategoryParam === "pdf") return "pdf";
      if (activeCategoryParam === "image") return "image";
      if (activeCategoryParam === "barcode") return "barcode";
      if (activeCategoryParam === "research") return "research";
      return "home";
    }
    return "home";
  };

  const activeItem = getActiveItem();
  const isToolPage = pathname !== "/tools";

  const menuItems = [
    { id: "home", name: "Home", icon: Home, color: "#64748b", path: "/tools" },
    { id: "pdf", name: "PDF Tools", icon: FileText, color: "#ef4444", path: "/tools?category=pdf" },
    { id: "image", name: "Image Tools", icon: ImageIcon, color: "#8b5cf6", path: "/tools?category=image" },
    { id: "barcode", name: "Barcode Tools", icon: Barcode, color: "#10b981", path: "/tools?category=barcode" },
    { id: "research", name: "Seo Tools", icon: Search, color: "#f59e0b", path: "/tools?category=research" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans relative">
      <Header />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-[1700px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Panel (Left) */}
        {!isToolPage && (
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[88px] h-fit">
            <Card className="p-4 border border-slate-200 bg-white/90 backdrop-blur-md rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Wrench className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Utility Hub</h2>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Tools Workspace</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Menu Items */}
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = activeItem === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 group text-left ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                          isActive ? "bg-white/10" : "bg-slate-100 group-hover:bg-slate-200"
                        }`}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: isActive ? "#ffffff" : item.color }}
                        />
                      </div>
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                  );
                })}
              </nav>

              <div className="h-px bg-slate-100" />


            </Card>
          </aside>
        )}

        {/* Main Workspace (Right) */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="flex-1">
            {children}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdBanner slot="banner" />
            <AdBanner slot="banner" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading Utility Workspace...</div>}>
      <ToolsLayoutContent>{children}</ToolsLayoutContent>
    </Suspense>
  );
}
