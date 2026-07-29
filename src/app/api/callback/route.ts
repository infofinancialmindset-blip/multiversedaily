import { NextRequest, NextResponse } from "next/server";

// Riceve il redirect da GitHub dopo il login, scambia il "code" con un
// access token e lo passa alla finestra popup di Decap CMS via postMessage,
// seguendo il protocollo atteso da decap-cms-backend-github.
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const code = request.nextUrl.searchParams.get("code");

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Credenziali OAuth GitHub non configurate" },
      { status: 500 },
    );
  }

  if (!code) {
    return NextResponse.json({ error: "Codice OAuth mancante" }, { status: 400 });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    },
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return NextResponse.json(
      { error: tokenData.error_description ?? "Autenticazione GitHub fallita" },
      { status: 400 },
    );
  }

  const payload = JSON.stringify({
    token: tokenData.access_token,
    provider: "github",
  });

  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:${payload}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
