import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  workspaceId: z.string().cuid(),
  platforms: z.array(z.string()).default(["INSTAGRAM"]),
  postsPerDay: z.number().min(1).max(3).default(1),
  theme: z.string().optional(),
  startDate: z.string().optional(), // ISO date string
});

interface WeeklyPost {
  day: number;          // 0 = today, 6 = 6 days from now
  date: string;         // "Mon, Jan 6"
  time: string;         // e.g. "09:00"
  platform: string;
  caption: string;
  imagePrompt: string;
  hashtags: string[];
  type: "educational" | "promotional" | "engagement" | "inspirational" | "behind-scenes";
}

const POSTING_TIMES = ["08:00", "12:00", "17:00", "19:00", "21:00"];
const POST_TYPES: WeeklyPost["type"][] = [
  "educational", "promotional", "engagement",
  "inspirational", "behind-scenes", "educational", "promotional",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const { workspaceId, platforms, postsPerDay, theme, startDate } = parsed.data;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      brandName: true, brandDescription: true, brandVoice: true,
      brandKeywords: true, websiteUrl: true, aiCredits: true,
    },
  });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const creditsNeeded = 7 * postsPerDay;
  if (workspace.aiCredits < creditsNeeded) {
    return NextResponse.json({
      error: `Not enough AI credits. Need ${creditsNeeded}, have ${workspace.aiCredits}.`,
    }, { status: 402 });
  }

  const start = startDate ? new Date(startDate) : new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  });

  const brandBlock = workspace.brandName
    ? `Brand: ${workspace.brandName}
Niche/description: ${workspace.brandDescription ?? "not set"}
Keywords: ${(workspace.brandKeywords ?? []).join(", ") || "none"}
Voice: ${workspace.brandVoice ?? "professional"}`
    : "Voice: professional";

  const systemPrompt = `You are a social media strategist. Create a 7-day content calendar.

${brandBlock}
Platforms: ${platforms.join(", ")}
${theme ? `Weekly theme: ${theme}` : ""}

Generate ${postsPerDay} post(s) per day × 7 days = ${7 * postsPerDay} posts total.

For each post provide:
- day (0-6)
- type: one of educational|promotional|engagement|inspirational|behind-scenes
- caption: the full post text with emojis (platform-appropriate length)
- imagePrompt: a detailed DALL-E image prompt for a matching visual
- hashtags: array of 5 relevant hashtags (without #)
- time: best posting time in HH:MM (24h)

Return ONLY valid JSON: { "posts": [ ...array of post objects... ] }`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate the 7-day content plan for days: ${days.join(", ")}` },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content ?? "{}";
    let posts: WeeklyPost[] = [];

    try {
      const data = JSON.parse(raw);
      const rawPosts = data.posts ?? data.calendar ?? data.plan ?? [];
      posts = rawPosts.map((p: Partial<WeeklyPost>, i: number) => ({
        day: p.day ?? (i % 7),
        date: days[p.day ?? (i % 7)] ?? days[i % 7],
        time: p.time ?? POSTING_TIMES[Math.floor(Math.random() * POSTING_TIMES.length)],
        platform: platforms[0],
        caption: p.caption ?? "",
        imagePrompt: p.imagePrompt ?? `Professional social media post for ${workspace.brandName ?? "a brand"}`,
        hashtags: p.hashtags ?? [],
        type: p.type ?? POST_TYPES[i % 7],
      }));
    } catch {
      posts = [];
    }

    // Deduct credits
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { aiCredits: { decrement: creditsNeeded } },
    });

    await prisma.aIGeneration.create({
      data: {
        workspaceId,
        userId: session.user.id,
        type: "CAMPAIGN",
        prompt: theme ?? "weekly content plan",
        output: JSON.stringify(posts),
        model: "gpt-4o-mini",
        tokensUsed: completion.usage?.total_tokens ?? 0,
      },
    });

    return NextResponse.json({
      posts,
      creditsUsed: creditsNeeded,
      creditsRemaining: workspace.aiCredits - creditsNeeded,
      model: "gpt-4o-mini",
    });
  } catch (error) {
    console.error("[AI Weekly Plan]", error);
    return NextResponse.json({ error: "Weekly plan generation failed" }, { status: 500 });
  }
}
