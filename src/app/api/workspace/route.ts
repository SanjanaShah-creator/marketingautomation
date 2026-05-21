import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          _count: {
            select: { members: true, socialAccounts: true, posts: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json(memberships.map((m: { workspace: object; role: string }) => ({ ...m.workspace, role: m.role })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createWorkspaceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 422 });

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let suffix = 0;

  while (await prisma.workspace.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      slug,
      members: {
        create: { userId: session.user.id, role: "OWNER" },
      },
    },
  });

  return NextResponse.json(workspace, { status: 201 });
}
