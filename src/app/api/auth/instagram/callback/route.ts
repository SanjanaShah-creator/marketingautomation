import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForToken, getLongLivedToken, getInstagramProfile } from "@/lib/instagram";

const ACCOUNTS_URL = `${process.env.NEXTAUTH_URL}/accounts`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !stateParam) {
    return NextResponse.redirect(`${ACCOUNTS_URL}?error=instagram_denied`);
  }

  // Verify state matches cookie (CSRF protection)
  const cookieState = req.cookies.get("ig_oauth_state")?.value;
  if (!cookieState || cookieState !== stateParam) {
    return NextResponse.redirect(`${ACCOUNTS_URL}?error=invalid_state`);
  }

  let workspaceId: string;
  try {
    ({ workspaceId } = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf-8")));
  } catch {
    return NextResponse.redirect(`${ACCOUNTS_URL}?error=invalid_state`);
  }

  try {
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/instagram/callback`;

    const { access_token: shortToken } = await exchangeCodeForToken(code, redirectUri);
    const { access_token: longToken, expires_in } = await getLongLivedToken(shortToken);
    const profile = await getInstagramProfile(longToken);

    await prisma.socialAccount.upsert({
      where: {
        workspaceId_platform_platformId: {
          workspaceId,
          platform: "INSTAGRAM",
          platformId: profile.id,
        },
      },
      update: {
        accessToken: longToken,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        username: profile.username,
        displayName: profile.name ?? profile.username,
        avatar: profile.profile_picture_url ?? null,
        isActive: true,
      },
      create: {
        workspaceId,
        platform: "INSTAGRAM",
        platformId: profile.id,
        username: profile.username,
        displayName: profile.name ?? profile.username,
        avatar: profile.profile_picture_url ?? null,
        accessToken: longToken,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        isActive: true,
      },
    });

    const res = NextResponse.redirect(`${ACCOUNTS_URL}?connected=instagram`);
    res.cookies.delete("ig_oauth_state");
    return res;
  } catch (e) {
    console.error("[Instagram OAuth] callback error:", e);
    return NextResponse.redirect(`${ACCOUNTS_URL}?error=instagram_failed`);
  }
}
