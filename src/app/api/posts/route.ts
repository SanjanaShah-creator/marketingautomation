import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PostStatus } from "@prisma/client";

const createPostSchema = z.object({
  content: z.string().min(1).max(65536),
  workspaceId: z.string().cuid(),
  type: z.enum(["TEXT", "IMAGE", "VIDEO", "CAROUSEL", "STORY", "REEL", "THREAD", "LINK"]).default("TEXT"),
  scheduledAt: z.string().datetime().optional(),
  targetAccountIds: z.array(z.string().cuid()).min(1),
  mediaUrls: z.array(z.string().url()).default([]),
  aiGenerated: z.boolean().default(false),
  aiPrompt: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const skip = (page - 1) * limit;

  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        workspaceId,
        ...(status ? { status: status as PostStatus } : {}),
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        targets: { include: { socialAccount: { select: { platform: true, username: true } } } },
        hashtags: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.post.count({ where: { workspaceId, ...(status ? { status: status as PostStatus } : {}) } }),
  ]);

  return NextResponse.json({ posts, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const { content, workspaceId, type, scheduledAt, targetAccountIds, mediaUrls, aiGenerated, aiPrompt } = parsed.data;

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: session.user.id } },
  });
  if (!member || member.role === "VIEWER") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const post = await prisma.post.create({
    data: {
      content,
      workspaceId,
      authorId: session.user.id,
      type,
      status: scheduledAt ? "SCHEDULED" : "DRAFT",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      mediaUrls,
      aiGenerated,
      aiPrompt,
      targets: {
        create: targetAccountIds.map((id) => ({
          socialAccountId: id,
          status: scheduledAt ? "SCHEDULED" : "DRAFT",
        })),
      },
    },
    include: {
      targets: { include: { socialAccount: { select: { platform: true, username: true } } } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
