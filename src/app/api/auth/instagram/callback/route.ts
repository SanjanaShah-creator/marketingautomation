import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForToken, getLongLivedToken, getInstagramProfile } from "@/lib/instagram";

function appUrl(req: NextRequest) {
  return (
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${req.nextUrl.protocol}//${req.nextUrl.host}`)
  );
}

export async function GET(req: NextRequest) {
  const base = appUrl(req);
  const { searchParams } = new URL(req.url);
  const code       = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error      = searchParams.get("error");

  if (error || !code || !stateParam) {
    return NextResponse.redirect(`${base}/accounts?error=instagram_denied`);
  }

  // CSRF — verify state matches cookie
  const cookieState = req.cookies.get("ig_oauth_state")?.value;
  if (!cookieState || cookieState !== stateParam) {
    return NextResponse.redirect(`${base}/accounts?error=invalid_state`);
  }

  let workspaceId: string;
  let returnTo = "";
  try {
    ({ workspaceId, returnTo = "" } = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf-8")));
  } catch {
    return NextResponse.redirect(`${base}/accounts?error=invalid_state`);
  }

  try {
    const redirectUri = `${base}/api/auth/instagram/callback`;

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

    const redirectPath = returnTo === "onboarding"
      ? `${base}/onboarding?connected=instagram`
      : `${base}/accounts?connected=instagram`;
    const res = NextResponse.redirect(redirectPath);
    res.cookies.delete("ig_oauth_state");
    return res;
  } catch (e) {
    console.error("[Instagram OAuth] callback error:", e);
    return NextResponse.redirect(`${base}/accounts?error=instagram_failed`);
  }
}
