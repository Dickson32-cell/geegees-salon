/**
 * Detects if the website is being viewed inside an in-app browser
 * (TikTok, Instagram, Facebook, Snapchat, X/Twitter, etc.)
 *
 * In-app browsers — especially TikTok's — have quirks with HTML5 video:
 * multiple autoplaying videos compete for playback, pop out of their containers,
 * and disrupt navigation. When detected, we disable autoplay and show
 * a tap-to-play overlay instead.
 */

/**
 * Returns true if the current session is inside a known in-app browser.
 * Checks both the User-Agent string and TikTok's injected JS variables.
 */
export function isInAppBrowser(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent || "";
  const uaLower = ua.toLowerCase();

  // --- User-Agent based detection ---
  const inAppUAs = [
    "tiktok",          // TikTok in-app browser
    "instagram",       // Instagram in-app browser
    "fban",            // Facebook in-app browser (Android)
    "fbav",            // Facebook in-app browser (iOS)
    "fb_iab",          // Facebook internal
    "snssdk",          // ByteDance / TikTok parent (snssdk*)
    "musical_ly",      // TikTok old name
    "bytedance",       // ByteDance apps
    "snapchat",        // Snapchat in-app browser
    "twitter",         // X / Twitter in-app browser
    "linkedin",        // LinkedIn in-app browser
    "whatsapp",        // WhatsApp in-app browser
    "telegram",        // Telegram in-app browser
    "micromessenger",  // WeChat in-app browser
    "qqbrowser",       // QQ browser
    "baiduboxapp",     // Baidu app
    "samsungbrowser",  // Samsung Internet (not in-app but has video quirks)
  ];

  if (inAppUAs.some((token) => uaLower.includes(token))) {
    return true;
  }

  // --- JS-injection based detection (TikTok injects a global) ---
  try {
    // TikTok injects a global `TikTok` or `__tiktok` object
    if (typeof (window as any).TikTok !== "undefined") return true;
    if (typeof (window as any).__tiktok !== "undefined") return true;
    // Some in-app browsers set a non-standard share function
    if (typeof (window as any).__FB !== "undefined") return true;
  } catch {
    // ignore
  }

  // --- Document referrer based detection ---
  try {
    const referrer = document.referrer || "";
    const refLower = referrer.toLowerCase();
    const inAppReferrers = [
      "tiktok.com",
      "instagram.com",
      "facebook.com",
      "snapchat.com",
      "t.co",        // Twitter/X short links
      "twitter.com",
      "linkedin.com",
    ];
    if (inAppReferrers.some((d) => refLower.includes(d))) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * React hook-friendly cache so we only compute once per session.
 */
let _cachedResult: boolean | null = null;

export function isInAppBrowserCached(): boolean {
  if (_cachedResult === null) {
    _cachedResult = isInAppBrowser();
  }
  return _cachedResult;
}