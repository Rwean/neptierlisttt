export async function onRequestGet(context) {
  const clientId = context.env.DISCORD_CLIENT_ID;
  const url = new URL(context.request.url);
  const redirectUri = `${url.origin}/api/discord/callback`;

  if (!clientId) {
    return Response.redirect('/', 302);
  }

  const discordUrl = new URL('https://discord.com/oauth2/authorize');
  discordUrl.searchParams.set('client_id', clientId);
  discordUrl.searchParams.set('redirect_uri', redirectUri);
  discordUrl.searchParams.set('response_type', 'code');
  discordUrl.searchParams.set('scope', 'identify guilds');

  return Response.redirect(discordUrl.toString(), 302);
}
