const categoryOrder = ['sword', 'crystal', 'diapot', 'nethpot', 'axe', 'uhc', 'smp', 'mace', 'ogv'];

const rankByScore = [
  { min: 3600, rank: 'Savaş Büyük Ustası' },
  { min: 2600, rank: 'Savaş Ustası' },
  { min: 1600, rank: 'Usta Oyuncu' },
  { min: 800, rank: 'Tecrübeli Oyuncu' },
  { min: 1, rank: 'Oyuncu' }
];

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      'access-control-allow-origin': '*',
      ...(init.headers || {})
    }
  });
}

function getTierLabel(member, category) {
  return member.tiers?.[category]?.tier?.toUpperCase() || '-';
}

function getRank(totalScore) {
  return rankByScore.find((item) => totalScore >= item.min)?.rank || 'Oyuncu';
}

function getAccent(index) {
  const accents = ['#e7b84e', '#9fb4b8', '#b06f4f', '#7587a5', '#4da3c7', '#7fb069'];
  return accents[index % accents.length];
}

function toPlayer(member, index) {
  return {
    id: member.discordId,
    discordId: member.discordId,
    name: member.displayName || member.username || 'Bilinmeyen Oyuncu',
    username: member.username || '',
    rank: getRank(Number(member.totalScore || 0)),
    points: Number(member.totalScore || 0),
    region: 'TR',
    avatar: member.avatarUrl || member.displayName?.[0]?.toUpperCase() || member.username?.[0]?.toUpperCase() || '?',
    avatarUrl: member.avatarUrl || '',
    accent: getAccent(index),
    tiers: categoryOrder.map((category) => getTierLabel(member, category))
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, x-api-key'
    }
  });
}

export async function onRequestPost(context) {
  const apiKey = context.request.headers.get('x-api-key');

  if (!context.env.NEPTIERLIST_API_KEY) {
    return json({ error: 'Server API key is not configured' }, { status: 500 });
  }

  if (apiKey !== context.env.NEPTIERLIST_API_KEY) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(body.members)) {
    return json({ error: 'members array required' }, { status: 400 });
  }

  const players = body.members
    .map(toPlayer)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'tr'));

  if (context.env.TIERLIST_KV) {
    await context.env.TIERLIST_KV.put('players', JSON.stringify(players));
    await context.env.TIERLIST_KV.put('discord-tier-payload', JSON.stringify(body));
    await context.env.TIERLIST_KV.put('discord-tier-updated-at', body.updatedAt || new Date().toISOString());
  }

  return json({ ok: true, count: players.length });
}
