import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, x-api-key, authorization'
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

export async function onRequestGet(context) {
  const supabase = createClient(
    context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL,
    context.env.VITE_SUPABASE_ANON_KEY || context.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('total_score', { ascending: false });

  if (error) return json({ error: error.message }, { status: 500 });

  return json({
    updatedAt: new Date().toISOString(),
    players: (data || []).map((p) => ({ ...p, region: p.region || 'TR' }))
  });
}

export async function onRequestPost(context) {
  const apiKey = context.request.headers.get('x-api-key');
  const authHeader = context.request.headers.get('authorization')?.replace('Bearer ', '');

  const serverKey = context.env.NEPTIERLIST_API_KEY || context.env.ADMIN_API_TOKEN;

  if (!serverKey) {
    return json({ error: 'Server API key not configured' }, { status: 500 });
  }

  if (apiKey !== serverKey && authHeader !== serverKey) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabaseUrl = context.env.VITE_SUPABASE_URL || context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.VITE_SUPABASE_ANON_KEY || context.env.SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  let members = body.members || body.players;
  if (!Array.isArray(members)) {
    return json({ error: 'members or players array required' }, { status: 400 });
  }

  let upserted = 0;
  let errors = [];

  for (const member of members) {
    const tiers = member.tiers || {};
    const totalScore = member.totalScore != null
      ? Number(member.totalScore)
      : calculateTotalScore(tiers);

    const displayName = member.displayName || member.name || member.username || 'Bilinmeyen';
    const mcUsername = member.minecraftUsername || member.minecraft_username || member.username || '';
    const discordId = String(member.discordId || member.id || '');
    const avatarUrl = member.avatarUrl || member.avatar_url || '';

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

    if (error) {
      errors.push({ player: displayName, error: error.message });
    } else {
      upserted++;
    }
  }

  return json({ ok: true, count: upserted, errors: errors.length ? errors : undefined });
}
