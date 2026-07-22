"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ToolsDirectoryContent() {
  const router = useRouter();
  
  React.useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
      Redirecting to Homepage...
    </div>
  );
}

export default function ToolsDirectoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading...</div>}>
      <ToolsDirectoryContent />
    </Suspense>
  );
}
