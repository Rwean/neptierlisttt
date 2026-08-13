# NepTierList

Cloudflare Pages build ayarları:

- Build command: `npm run build`
- Build output: `dist`
- Framework preset: Vite

Discord canlı veri için önerilen yöntem:

1. Discord botu rolleri okur.
2. Bot, Pages Function endpointine güvenli admin token ile tier verisini yollar.
3. Frontend `/api/tiers` üzerinden güncel listeyi çeker.

Gerekli Cloudflare secrets:

- `ADMIN_API_TOKEN`
- `DISCORD_BOT_TOKEN`
- `DISCORD_CLIENT_SECRET`
