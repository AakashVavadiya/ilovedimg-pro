/**
 * ============================================================
 *  Google AdSense Configuration
 * ============================================================
 */

export const ADSENSE_CONFIG = {
  publisherId: "ca-pub-0000000000000000",
  enabled: false, // Set to true once approved, showing placeholders in local/dev
  slots: {
    banner: "1234567890",      // Header banner / Footer banner
    rectangle: "0987654321",   // Homepage between rows / Sidebars
    sidebar: "1122334455",
    inArticle: "5566778899",
  },
} as const;

export type AdSlotKey = keyof typeof ADSENSE_CONFIG.slots;
