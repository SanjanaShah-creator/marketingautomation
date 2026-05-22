import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.enum(["natural", "vivid"]).default("vivid"),
  size: z.enum(["1024x1024", "1024x1792", "1792x1024"]).default("1024x1024"),
  workspaceId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const { prompt, style, size, workspaceId } = parsed.data;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { brandName: true, brandDescription: true, aiCredits: true },
  });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  if (workspace.aiCredits <= 0) return NextResponse.json({ error: "No AI credits remaining" }, { status: 402 });

  // Enrich the prompt with brand context
  const brandHint = workspace.brandName
    ? `, for the brand "${workspace.brandName}"${workspace.brandDescription ? ` (${workspace.brandDescription})` : ""}`
    : "";
  const enrichedPrompt = `${prompt}${brandHint}. High quality, social-media-ready, professional photography style.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: enrichedPrompt,
      n: 1,
      size,
      style,
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    // Deduct 2 credits for image generation (costs more than text)
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { aiCredits: { decrement: 2 } },
    });

    await prisma.aIGeneration.create({
      data: {
        workspaceId,
        userId: session.user.id,
        type: "IMAGE_PROMPT",
        prompt,
        output: imageUrl ?? "",
        model: "dall-e-3",
        tokensUsed: 0,
      },
    });

    return NextResponse.json({
      url: imageUrl,
      revisedPrompt,
      creditsRemaining: workspace.aiCredits - 2,
    });
  } catch (error) {
    console.error("[AI Image]", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
