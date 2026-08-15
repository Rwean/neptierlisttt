const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, x-api-key'
};

const TIER_POINTS = {
  LT3: 10, HT3: 20, LT2: 30, HT2: 40, LT1: 50, HT1: 60
};
const CATEGORIES = ['sword', 'crystal', 'diapot', 'nethpot', 'axe', 'uhc', 'smp', 'mace', 'ogv'];

function calculateTotalScore(tiers) {
  if (!tiers) return 0;
  return CATEGORIES.reduce((sum, cat) => {
    const tier = typeof tiers[cat] === 'string' ? tiers[cat] : (tiers[cat]?.tier || 'LT3');
    return sum + (TIER_POINTS[String(tier).toUpperCase()] || 0);
  }, 0);
}

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: { ...corsHeaders, ...(init.headers || {}) }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const apiKey = context.request.headers.get('x-api-key');

  const serverKey = context.env.NEPTIERLIST_API_KEY || context.env.ADMIN_API_TOKEN;
  if (!serverKey) {
    return json({ error: 'Server API key is not configured' }, { status: 500 });
  }
  if (apiKey !== serverKey) {
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

  const supabaseUrl = context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.VITE_SUPABASE_ANON_KEY || context.env.SUPABASE_ANON_KEY;

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(supabaseUrl, supabaseKey);

  let upserted = 0;
  const errors = [];

  for (const member of body.members) {
    const tiers = member.tiers || {};
    const totalScore = member.totalScore != null
      ? Number(member.totalScore)
      : calculateTotalScore(tiers);

    const displayName = member.displayName || member.username || 'Bilinmeyen';
    const mcUsername = member.minecraftUsername || member.username || '';
    const discordId = String(member.discordId || '');
    const avatarUrl = member.avatarUrl || '';

    const payload = {
      discord_id: discordId || null,
      minecraft_username: mcUsername,
      display_name: displayName,
      avatar_url: avatarUrl,
      region: 'TR',
      total_score: totalScore,
      tiers: tiers,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('players')
      .upsert(payload, { onConflict: 'discord_id' });

    if (error) errors.push({ player: displayName, error: error.message });
    else upserted++;
  }

  return json({ ok: true, count: upserted, errors: errors.length ? errors : undefined });
}
