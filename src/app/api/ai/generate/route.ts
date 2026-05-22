import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  tone: z.enum(["professional", "casual", "humorous", "inspiring", "educational", "bold"]).default("professional"),
  platforms: z.array(z.string()).default(["INSTAGRAM"]),
  variations: z.number().min(1).max(5).default(3),
  workspaceId: z.string().cuid(),
});

const PLATFORM_LIMITS: Record<string, number> = {
  TWITTER: 280, INSTAGRAM: 2200, LINKEDIN: 3000, FACEBOOK: 63206, THREADS: 500,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const { prompt, tone, platforms, variations, workspaceId } = parsed.data;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      brandName: true, brandDescription: true,
      brandVoice: true, brandKeywords: true, websiteUrl: true, aiCredits: true,
    },
  });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  if (workspace.aiCredits <= 0) return NextResponse.json({ error: "No AI credits remaining" }, { status: 402 });

  const primaryLimit = PLATFORM_LIMITS[platforms[0]] ?? 2200;
  const activeTone = workspace.brandVoice ?? tone;

  const brandBlock = workspace.brandName
    ? `Brand: ${workspace.brandName}
Description: ${workspace.brandDescription ?? "not set"}
Keywords/niche: ${(workspace.brandKeywords ?? []).join(", ") || "none"}
Voice: ${activeTone}`
    : `Voice: ${activeTone}`;

  const systemPrompt = `You are an expert social media copywriter. Write exactly ${variations} unique post variations.

${brandBlock}
Platform: ${platforms.join(", ")}
Character limit: ${primaryLimit}

Rules:
- Each variation must be distinct in angle and structure
- Include relevant emojis naturally (not excessively)
- Add 3–5 hashtags at the end
- Stay within the character limit
- Write as the brand, not about the brand

Return ONLY a valid JSON array of strings, no markdown, no explanation:
["variation 1", "variation 2", ...]`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${prompt}` },
      ],
      temperature: 0.85,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content ?? "{}";

    // Parse: model returns { variations: [...] } or a raw array
    let variationsOut: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      variationsOut = Array.isArray(parsed)
        ? parsed
        : parsed.variations ?? parsed.posts ?? Object.values(parsed)[0] ?? [];
    } catch {
      variationsOut = [];
    }

    // Deduct 1 credit
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { aiCredits: { decrement: 1 } },
    });

    // Log generation
    await prisma.aIGeneration.create({
      data: {
        workspaceId,
        userId: session.user.id,
        type: "POST_CAPTION",
        prompt,
        output: JSON.stringify(variationsOut),
        model: "gpt-4o-mini",
        tokensUsed: completion.usage?.total_tokens ?? 0,
      },
    });

    return NextResponse.json({
      variations: variationsOut,
      tokensUsed: completion.usage?.total_tokens ?? 0,
      model: "gpt-4o-mini",
      creditsRemaining: workspace.aiCredits - 1,
    });
  } catch (error) {
    console.error("[AI Generate]", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
