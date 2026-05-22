const IG_GRAPH = "https://graph.instagram.com/v21.0";

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });
  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }
  return res.json() as Promise<{ access_token: string; user_id: string }>;
}

export async function getLongLivedToken(shortToken: string) {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    access_token: shortToken,
  });
  const res = await fetch(`${IG_GRAPH}/access_token?${params}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Long-lived token exchange failed: ${err}`);
  }
  return res.json() as Promise<{ access_token: string; token_type: string; expires_in: number }>;
}

export async function getInstagramProfile(accessToken: string) {
  const fields = "id,username,name,followers_count,media_count,profile_picture_url";
  const res = await fetch(`${IG_GRAPH}/me?fields=${fields}&access_token=${accessToken}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Profile fetch failed: ${err}`);
  }
  return res.json() as Promise<{
    id: string;
    username: string;
    name?: string;
    followers_count?: number;
    media_count?: number;
    profile_picture_url?: string;
  }>;
}

export function buildOAuthUrl(state: string, redirectUri: string) {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: "instagram_business_basic",
    response_type: "code",
    state,
  });
  return `https://api.instagram.com/oauth/authorize?${params}`;
}
