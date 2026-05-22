import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ url: z.string().url() });

// ── Color utilities ─────────────────────────────────────────────────────────

function normalizeHex(raw: string): string {
  const h = raw.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h))
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  if (/^#[0-9a-f]{6}$/.test(h)) return h;
  return "";
}

/** Returns true for vibrant, saturated, non-gray colors worth showing as brand colors */
function isBrandColor(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  // Too close to black
  if (r < 20 && g < 20 && b < 20) return false;
  // Too close to white
  if (r > 235 && g > 235 && b > 235) return false;

  // Saturation via HSL
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const s = max === min ? 0 : l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);

  // Too desaturated (gray)
  if (s < 0.18) return false;
  // Very dark or very light even if saturated
  if (l < 0.06 || l > 0.94) return false;

  return true;
}

/** Deduplicate very similar colors (within ~15 steps on each channel) */
function dedupeColors(colors: string[]): string[] {
  const result: string[] = [];
  for (const c of colors) {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    const tooSimilar = result.some((existing) => {
      const er = parseInt(existing.slice(1, 3), 16);
      const eg = parseInt(existing.slice(3, 5), 16);
      const eb = parseInt(existing.slice(5, 7), 16);
      return Math.abs(r - er) < 18 && Math.abs(g - eg) < 18 && Math.abs(b - eb) < 18;
    });
    if (!tooSimilar) result.push(c);
  }
  return result;
}

function extractColorsFromText(source: string): string[] {
  const scored: Record<string, number> = {};

  // ── Strategy 1: CSS custom properties with brand/color names ────────────
  // e.g. --primary-color: #3b82f6  /  --brand: #ff5500  /  --color-cta: #e11d48
  const cssVarRe = /--(?:[a-z0-9-]*(?:color|brand|primary|accent|theme|cta|highlight|key|main|hero|btn|button|link)[a-z0-9-]*)[\s]*:[\s]*(#[0-9a-fA-F]{3,6})\b/gi;
  let m: RegExpExecArray | null;
  while ((m = cssVarRe.exec(source)) !== null) {
    const c = normalizeHex(m[1]);
    if (c && isBrandColor(c)) scored[c] = (scored[c] ?? 0) + 10;
  }

  // ── Strategy 2: Colors on semantic selectors ─────────────────────────────
  // Capture colors directly associated with buttons, links, headers, nav, CTA
  const semanticRe =
    /(?:button|\.btn|\.cta|a\b|a:hover|nav\b|header\b|\.header|\.nav|\.primary|\.hero|\.highlight|h1\b|h2\b)[^{]{0,80}\{[^}]{0,400}(?:background(?:-color)?|color)\s*:\s*(#[0-9a-fA-F]{3,6})\b/gi;
  while ((m = semanticRe.exec(source)) !== null) {
    const c = normalizeHex(m[1]);
    if (c && isBrandColor(c)) scored[c] = (scored[c] ?? 0) + 6;
  }

  // ── Strategy 3: theme-color / msapplication-TileColor meta tags ──────────
  const themeRe = /(?:theme-color|msapplication-TileColor)[^>]+content=["']([^"']+)["']|content=["']([^"']+)["'][^>]+(?:theme-color|msapplication-TileColor)/gi;
  while ((m = themeRe.exec(source)) !== null) {
    const raw = m[1] || m[2];
    const c = normalizeHex(raw?.trim() ?? "");
    if (c && isBrandColor(c)) scored[c] = (scored[c] ?? 0) + 8;
  }

  // ── Strategy 4: Frequency analysis of all hex colors ────────────────────
  const allHex = source.match(/#[0-9a-fA-F]{3,6}\b/g) ?? [];
  for (const raw of allHex) {
    const c = normalizeHex(raw);
    if (c && isBrandColor(c)) scored[c] = (scored[c] ?? 0) + 1;
  }

  // Sort by score descending, dedupe similar ones, take top 5
  const sorted = Object.entries(scored)
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c);

  return dedupeColors(sorted).slice(0, 5);
}

// ── Text extraction utilities ──────────────────────────────────────────────

function extractMeta(html: string, pattern: RegExp): string {
  return (pattern.exec(html)?.[1] ?? "").trim()
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function inferVoice(desc: string): string {
  const l = desc.toLowerCase();
  if (/fun|playful|humor|laugh|joke|cheeky/.test(l)) return "humorous";
  if (/learn|educat|guide|how.to|tutorial|insight/.test(l)) return "educational";
  if (/inspir|motivat|dream|passion|vision/.test(l)) return "inspiring";
  if (/bold|disrupt|revolution|frontier|transform/.test(l)) return "bold";
  if (/casual|friendly|chat|community|relax/.test(l)) return "casual";
  return "professional";
}

function extractKeywords(text: string): string[] {
  const stop = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
    "is","are","we","our","your","you","that","this","it","be","from","have",
    "has","was","were","will","their","they","them","what","how","when","where",
    "all","more","about","make","just","can","get","one","into","than","its",
    "use","used","using","also","which","such","these","some","any","like",
  ]);
  return [...new Set(
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/)
      .filter((w) => w.length > 4 && !stop.has(w) && !/^\d+$/.test(w))
  )].slice(0, 10);
}

// ── HTTP fetch helpers ─────────────────────────────────────────────────────

const BOT_UA = "Mozilla/5.0 (compatible; SocialSyncBot/1.0; brand-analysis)";

async function safeFetch(url: string, timeoutMs = 8000): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": BOT_UA, Accept: "text/html,text/css,*/*;q=0.9" },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // Don't download huge files
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text") && !ct.includes("css") && !ct.includes("html")) return "";
  const text = await res.text();
  return text.slice(0, 500_000); // cap at 500 KB
}

function parseCssLinks(html: string, baseUrl: string): string[] {
  const urls: string[] = [];
  const re = /<link[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    if (!/rel=["']stylesheet["']/i.test(tag)) continue;
    const hrefMatch = /href=["']([^"']+)["']/i.exec(tag);
    if (!hrefMatch) continue;
    try {
      urls.push(new URL(hrefMatch[1], baseUrl).href);
    } catch { /* skip invalid */ }
  }
  return [...new Set(urls)].slice(0, 6); // max 6 CSS files
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid URL" }, { status: 422 });

  let { url } = parsed.data;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  // ── 1. Fetch HTML ─────────────────────────────────────────────────────────
  let html = "";
  try {
    html = await safeFetch(url);
  } catch {
    return NextResponse.json({ error: "Could not fetch website. Check the URL and try again." }, { status: 422 });
  }

  // ── 2. Fetch linked CSS files in parallel ─────────────────────────────────
  const cssLinks = parseCssLinks(html, url);
  const cssResults = await Promise.allSettled(
    cssLinks.map((cssUrl) => safeFetch(cssUrl, 5000))
  );
  const css = cssResults
    .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
    .map((r) => r.value)
    .join("\n");

  // ── 3. Extract brand metadata from HTML ────────────────────────────────────
  const ogTitle    = extractMeta(html, /property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
                  || extractMeta(html, /content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const siteName   = extractMeta(html, /property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
                  || extractMeta(html, /content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
  const titleTag   = extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i);
  const metaDesc   = extractMeta(html, /name=["']description["'][^>]+content=["']([^"']+)["']/i)
                  || extractMeta(html, /content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogDesc     = extractMeta(html, /property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
                  || extractMeta(html, /content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  const twitterDesc = extractMeta(html, /name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i)
                  || extractMeta(html, /content=["']([^"']+)["'][^>]+name=["']twitter:description["']/i);

  const rawName   = siteName || ogTitle || titleTag.split(/[|\-–—]/)[0].trim();
  const brandName = rawName || new URL(url).hostname.replace("www.", "").split(".")[0]
    .replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const brandDesc = ogDesc || twitterDesc || metaDesc || "";

  // ── 4. Extract colors (CSS takes priority over HTML) ──────────────────────
  // Weight CSS more heavily by analyzing it first, then supplement with HTML
  const combinedSource = css + "\n" + html;
  const brandColors = extractColorsFromText(combinedSource);

  // ── 5. Voice & keywords ────────────────────────────────────────────────────
  const brandVoice    = inferVoice(brandDesc);
  const brandKeywords = extractKeywords(brandDesc + " " + brandName);

  return NextResponse.json({
    brandName,
    brandDescription: brandDesc,
    brandColors,
    brandKeywords,
    brandVoice,
    cssFilesAnalyzed: cssLinks.length,
  });
}
