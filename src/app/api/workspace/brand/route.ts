import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  workspaceId: z.string().cuid(),
});

function extract(html: string, pattern: RegExp): string {
  return (pattern.exec(html)?.[1] ?? "").trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function extractColors(html: string): string[] {
  const colors = new Set<string>();

  // theme-color meta
  const themeColor = extract(html, /meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
    || extract(html, /meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
  if (themeColor && /^#[0-9a-f]{3,8}$/i.test(themeColor)) colors.add(themeColor.toLowerCase());

  // hex colors from style blocks (pick most frequent non-black/white ones)
  const hexMatches = html.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
  const freq: Record<string, number> = {};
  for (const c of hexMatches) {
    const lc = c.toLowerCase();
    // skip near-black, near-white, grays
    if (/^#(0{6}|f{6}|[0-9a-f]{2}\1\1)$/i.test(lc)) continue;
    freq[lc] = (freq[lc] ?? 0) + 1;
  }
  Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .forEach(([c]) => colors.add(c));

  return [...colors].slice(0, 5);
}

function inferVoice(desc: string): string {
  const lower = desc.toLowerCase();
  if (/fun|playful|humor|laugh|joke/.test(lower)) return "humorous";
  if (/learn|educat|guide|how.to|tutorial/.test(lower)) return "educational";
  if (/inspir|motivat|dream|passion/.test(lower)) return "inspiring";
  if (/bold|disrupt|revolution|frontier/.test(lower)) return "bold";
  if (/casual|friendly|chat|community/.test(lower)) return "casual";
  return "professional";
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const { url, workspaceId } = parsed.data;

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: session.user.id } },
  });
  if (!member || member.role === "VIEWER")
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

  let html = "";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SocialSync/1.0; +https://socialsync.app/bot)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Could not fetch website. Check the URL and try again." }, { status: 422 });
  }

  // Extract brand data
  const ogTitle       = extract(html, /property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
                     || extract(html, /content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const siteName      = extract(html, /property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
                     || extract(html, /content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
  const titleTag      = extract(html, /<title[^>]*>([^<]+)<\/title>/i);
  const metaDesc      = extract(html, /name=["']description["'][^>]+content=["']([^"']+)["']/i)
                     || extract(html, /content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogDesc        = extract(html, /property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
                     || extract(html, /content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

  const brandName    = siteName || ogTitle || titleTag.split(/[|\-–]/)[0].trim() || new URL(url).hostname;
  const brandDesc    = ogDesc || metaDesc || "";
  const brandColors  = extractColors(html);
  const brandVoice   = inferVoice(brandDesc);

  // Extract keywords from description
  const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","we","our","your","you","that","this","it"]);
  const brandKeywords = [...new Set(
    brandDesc.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
      .filter((w) => w.length > 4 && !stopWords.has(w))
  )].slice(0, 10);

  // Persist to workspace
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { websiteUrl: url, brandName, brandDescription: brandDesc, brandColors, brandKeywords, brandVoice },
  });

  return NextResponse.json({ brandName, brandDescription: brandDesc, brandColors, brandKeywords, brandVoice });
}

// GET – return current brand data for a workspace
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaceId = new URL(req.url).searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { websiteUrl: true, brandName: true, brandDescription: true, brandColors: true, brandKeywords: true, brandVoice: true },
  });
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(workspace);
}
