import { makeCollection } from '../_shared.js';

// Tier testi / listeye giriş başvurusu.
const collection = makeCollection('applications', (body) => {
  const player = String(body.player ?? '').trim();
  const kit = String(body.kit ?? '').trim();
  if (!player || !kit) return null;
  return {
    player: player.slice(0, 60),
    kit: kit.slice(0, 40),
    discord: String(body.discord ?? '').trim().slice(0, 60),
    experience: String(body.experience ?? '').trim().slice(0, 1000)
  };
});

export const onRequestOptions = collection.onRequestOptions;
export const onRequestGet = collection.onRequestGet;
export const onRequestPost = collection.onRequestPost;
export const onRequestPatch = collection.onRequestPatch;
export const onRequestDelete = collection.onRequestDelete;
