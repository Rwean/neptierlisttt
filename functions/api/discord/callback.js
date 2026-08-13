export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code || !context.env.DISCORD_CLIENT_ID || !context.env.DISCORD_CLIENT_SECRET) {
    return Response.redirect('/', 302);
  }

  const redirectUri = `${url.origin}/api/discord/callback`;
  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: context.env.DISCORD_CLIENT_ID,
      client_secret: context.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  });

  if (!tokenResponse.ok) {
    return Response.redirect('/?login=failed', 302);
  }

  return Response.redirect('/?login=discord', 302);
}
