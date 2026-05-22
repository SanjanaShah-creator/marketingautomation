import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });
  if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const account = await prisma.socialAccount.findFirst({
    where: { id, workspaceId: membership.workspaceId },
  });
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.socialAccount.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
