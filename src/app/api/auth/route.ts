import { NextRequest, NextResponse } from "next/server";

// Punto di ingresso del flusso OAuth per Decap CMS: reindirizza a GitHub.
// Richiede le env var GITHUB_OAUTH_CLIENT_ID e GITHUB_OAUTH_CLIENT_SECRET
// (vedi README per come crearle).
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_OAUTH_CLIENT_ID non configurata" },
      { status: 500 },
    );
  }

  const redirectUri = new URL("/api/callback", request.url).toString();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");

  return NextResponse.redirect(authorizeUrl);
}
