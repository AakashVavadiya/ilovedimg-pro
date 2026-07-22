"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CONFIG, AdSlotKey } from "@/lib/adsense.config";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const SLOT_META: Record<AdSlotKey, { label: string; isBanner: boolean }> = {
  banner:    { label: "Banner Ad — 728×90 (Responsive)", isBanner: true },
  rectangle: { label: "Rectangle Ad — 300×250",          isBanner: false },
  sidebar:   { label: "Sidebar Ad — 160×600",            isBanner: false },
  inArticle: { label: "In-Article Ad (Native)",          isBanner: true },
};

interface AdBannerProps {
  slot: AdSlotKey;
  className?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const insRef = useRef<HTMLModElement>(null);
  const { label, isBanner } = SLOT_META[slot];
  const slotId = ADSENSE_CONFIG.slots[slot];

  useEffect(() => {
    if (!ADSENSE_CONFIG.enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded yet
    }
  }, []);

  if (!ADSENSE_CONFIG.enabled) {
    return null;
  }

  return (
    <div
      className={`ad-wrapper ${className}`}
      style={{ width: "100%", maxWidth: isBanner ? "728px" : "300px", margin: "12px auto", overflow: "hidden" }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={slotId}
        data-ad-format={isBanner ? "auto" : undefined}
        data-full-width-responsive={isBanner ? "true" : undefined}
      />
    </div>
  );
}
