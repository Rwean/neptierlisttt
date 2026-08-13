const fallbackPlayers = [
  { id: 1, name: 'Marlowww', rank: 'Combat Grandmaster', points: 450, region: 'NA' },
  { id: 2, name: 'ItzRealMe', rank: 'Combat Master', points: 330, region: 'NA' },
  { id: 3, name: 'X Kisisi', rank: 'Combat Master', points: 326, region: 'EU' },
  { id: 4, name: 'Y Kisisi', rank: 'Combat Master', points: 290, region: 'NA' }
];

export async function onRequestGet(context) {
  const stored = context.env.TIERLIST_KV
    ? await context.env.TIERLIST_KV.get('players', 'json')
    : null;

  return Response.json({
    updatedAt: new Date().toISOString(),
    players: stored || fallbackPlayers
  });
}

export async function onRequestPost(context) {
  const token = context.request.headers.get('authorization')?.replace('Bearer ', '');

  if (!context.env.ADMIN_API_TOKEN || token !== context.env.ADMIN_API_TOKEN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await context.request.json();
  if (!Array.isArray(body.players)) {
    return Response.json({ error: 'players array required' }, { status: 400 });
  }

  if (context.env.TIERLIST_KV) {
    await context.env.TIERLIST_KV.put('players', JSON.stringify(body.players));
  }

  return Response.json({ ok: true, count: body.players.length });
}
