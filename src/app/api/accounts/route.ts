import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInstagramProfile } from "@/lib/instagram";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });
  if (!membership) return NextResponse.json([]);

  const accounts = await prisma.socialAccount.findMany({
    where: { workspaceId: membership.workspaceId },
    orderBy: { createdAt: "asc" },
  });

  const enriched = await Promise.all(
    accounts.map(async (acc) => {
      let followers = 0;
      let posts = 0;

      if (acc.platform === "INSTAGRAM" && acc.isActive) {
        try {
          const profile = await getInstagramProfile(acc.accessToken);
          followers = profile.followers_count ?? 0;
          posts = profile.media_count ?? 0;
        } catch {
          // Token may be expired — mark inactive
          await prisma.socialAccount.update({
            where: { id: acc.id },
            data: { isActive: false },
          });
        }
      }

      return {
        id: acc.id,
        platform: acc.platform,
        handle: `@${acc.username}`,
        displayName: acc.displayName,
        avatar: acc.avatar,
        followers,
        following: 0,
        posts,
        isActive: acc.isActive,
        lastSync: acc.updatedAt,
        tokenExpiresAt: acc.tokenExpiresAt,
      };
    })
  );

  return NextResponse.json(enriched);
}
