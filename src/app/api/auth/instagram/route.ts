import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildOAuthUrl } from "@/lib/instagram";

function appUrl() {
  // Use NEXTAUTH_URL if set, otherwise fall back to the Vercel URL
  return (
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")
  );
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
      console.error("[Instagram OAuth] INSTAGRAM_CLIENT_ID or INSTAGRAM_CLIENT_SECRET not set");
      return NextResponse.redirect(`${appUrl()}/accounts?error=instagram_not_configured`);
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(`${appUrl()}/login`);
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      orderBy: { joinedAt: "asc" },
    });
    if (!membership) {
      return NextResponse.redirect(`${appUrl()}/onboarding`);
    }

    const url = new URL(req.url);
    const returnTo = url.searchParams.get("returnTo") ?? "";

    const state = Buffer.from(
      JSON.stringify({ workspaceId: membership.workspaceId, returnTo })
    ).toString("base64url");

    const redirectUri = `${appUrl()}/api/auth/instagram/callback`;
    const oauthUrl = buildOAuthUrl(state, redirectUri);

    const response = NextResponse.redirect(oauthUrl);
    response.cookies.set("ig_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("[Instagram OAuth] initiate error:", err);
    return NextResponse.redirect(`${appUrl()}/accounts?error=instagram_failed`);
  }
}
