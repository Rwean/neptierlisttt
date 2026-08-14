import { makeCollection } from '../_shared.js';

// Hata Bildir formu.
const collection = makeCollection('reports', (body) => {
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();
  if (!message) return null;
  return {
    subject: subject.slice(0, 120) || 'Genel',
    message: message.slice(0, 2000),
    contact: String(body.contact ?? '').trim().slice(0, 120)
  };
});

export const onRequestOptions = collection.onRequestOptions;
export const onRequestGet = collection.onRequestGet;
export const onRequestPost = collection.onRequestPost;
export const onRequestPatch = collection.onRequestPatch;
export const onRequestDelete = collection.onRequestDelete;
