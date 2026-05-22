import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildOAuthUrl } from "@/lib/instagram";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL!));
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });
  if (!membership) {
    return NextResponse.redirect(new URL("/onboarding", process.env.NEXTAUTH_URL!));
  }

  const state = Buffer.from(
    JSON.stringify({ workspaceId: membership.workspaceId })
  ).toString("base64url");

  const response = NextResponse.redirect(buildOAuthUrl(state));
  // Store state in a short-lived cookie for CSRF protection
  response.cookies.set("ig_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300, // 5 minutes
    path: "/",
  });
  return response;
}
