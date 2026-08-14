import { makeCollection } from '../_shared.js';

// Tier Göç talebi (bir platformdan gelen tier'ın taşınması).
const collection = makeCollection('migrations', (body) => {
  const player = String(body.player ?? '').trim();
  const fromPlatform = String(body.fromPlatform ?? '').trim();
  const kit = String(body.kit ?? '').trim();
  const tier = String(body.tier ?? '').trim();
  if (!player || !fromPlatform) return null;
  return {
    player: player.slice(0, 60),
    fromPlatform: fromPlatform.slice(0, 60),
    kit: kit.slice(0, 40),
    tier: tier.slice(0, 10),
    proof: String(body.proof ?? '').trim().slice(0, 300)
  };
});

export const onRequestOptions = collection.onRequestOptions;
export const onRequestGet = collection.onRequestGet;
export const onRequestPost = collection.onRequestPost;
export const onRequestPatch = collection.onRequestPatch;
export const onRequestDelete = collection.onRequestDelete;
