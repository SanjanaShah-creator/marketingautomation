import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  tone: z.enum(["professional", "casual", "humorous", "inspiring", "educational", "bold"]).default("professional"),
  platforms: z.array(z.string()).default(["TWITTER"]),
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

  // Load workspace brand context
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      brandName: true,
      brandDescription: true,
      brandVoice: true,
      brandKeywords: true,
      brandColors: true,
      websiteUrl: true,
    },
  });

  const primaryLimit = PLATFORM_LIMITS[platforms[0]] ?? 280;
  const activeTone   = workspace?.brandVoice ?? tone;

  // Build brand context block
  const brandContext = workspace?.brandName
    ? `
Brand context:
- Brand name: ${workspace.brandName}
- Website: ${workspace.websiteUrl ?? "not set"}
- Description: ${workspace.brandDescription ?? "not provided"}
- Brand voice: ${activeTone}
- Key topics/keywords: ${(workspace.brandKeywords ?? []).join(", ") || "none"}

Always write AS this brand. Match the brand voice. Reference the brand's niche and topics naturally.`
    : "";

  const systemPrompt = `You are an expert social media copywriter.${brandContext}

Generate ${variations} unique, engaging post variations based on:
Topic: ${prompt}
Tone: ${activeTone}
Platform(s): ${platforms.join(", ")}
Character limit: ${primaryLimit}

Return a JSON array of strings, each being one variation. Include relevant emojis and hashtags naturally. Stay within the character limit.`;

  // ── Production: uncomment to use Claude ──────────────────────────────────────
  // import Anthropic from "@anthropic-ai/sdk";
  // const client = new Anthropic();
  // const message = await client.messages.create({
  //   model: "claude-opus-4-7",
  //   max_tokens: 1024,
  //   messages: [{ role: "user", content: systemPrompt }],
  // });
  // const rawText = message.content[0].type === "text" ? message.content[0].text : "";
  // const variations_out = JSON.parse(rawText.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
  // return NextResponse.json({ variations: variations_out, tokensUsed: message.usage.input_tokens + message.usage.output_tokens, model: "claude-opus-4-7" });
  // ─────────────────────────────────────────────────────────────────────────────

  const brandName = workspace?.brandName ?? "us";
  const mockVariations = Array.from({ length: variations }, (_, i) => {
    const templates = [
      `🚀 ${prompt}\n\nAt ${brandName}, this is how we see it changing everything. The future is already here.\n\n#Innovation #${brandName.replace(/\s+/g, "")}`,
      `Here's what we've been thinking about at ${brandName}:\n\n${prompt}\n\nWhat's your take? Drop your thoughts 👇\n\n#${brandName.replace(/\s+/g, "")} #Community`,
      `Big idea incoming 💡\n\n${prompt}\n\nWe're building this into everything we do at ${brandName}. Stay tuned.\n\n✨ Follow for more`,
      `The truth about ${prompt}:\n\nMost people get this wrong. At ${brandName}, we've learned the hard way what actually works.\n\nThread 🧵👇`,
      `${prompt} — here's our take at ${brandName}:\n\n→ It starts with the right mindset\n→ Then comes consistent action\n→ Results follow\n\n#Growth #Marketing`,
    ];
    return templates[i % templates.length];
  });

  // Log the system prompt so devs can see what would be sent to Claude
  console.log("[AI Generate] System prompt preview:", systemPrompt.slice(0, 300));

  return NextResponse.json({
    variations: mockVariations,
    tokensUsed: 245,
    model: "claude-opus-4-7",
    brandContext: workspace?.brandName ? { name: workspace.brandName, voice: activeTone } : null,
  });
}
