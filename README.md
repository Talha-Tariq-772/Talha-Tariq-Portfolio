# Portfolio (Vite + React + Vercel Functions)

This project is ready for Vercel deployment:
- Frontend: Vite + React (`dist`)
- Backend APIs: Vercel serverless functions in `api/`
  - `POST /api/chat`
  - `POST /api/contact`
  - `POST /api/messages`
  - `GET /api/messages`
  - `GET /api/health`

## Local development
1. Install dependencies:
```bash
npm install
```
2. Create `.env.local` from `.env.example` and fill values.
3. Run client + local API server:
```bash
npm run dev
```

## Vercel deployment
Project includes `vercel.json` with:
- `framework: vite`
- `buildCommand: npm run build`
- `outputDirectory: dist`

### Required environment variables on Vercel
Set these in Vercel Project Settings -> Environment Variables for Production (and Preview where needed):

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=portfolio
MONGODB_COLLECTION=incomming

ALLOWED_ORIGINS=https://talhatariq.online,https://www.talhatariq.online

RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
RECEIVER_EMAIL=tariqtalha772@gmail.com

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

VITE_SITE_URL=https://talhatariq.online
```

### Optional environment variables
```env
# For local only. In production, leave unset so client uses same origin.
VITE_API_BASE_URL=http://localhost:5000
```

## Deploy steps
1. Push this repo to GitHub.
2. Import repo in Vercel.
3. Confirm:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables above.
5. Deploy.
6. Add domains in Vercel:
   - `talhatariq.online`
   - `www.talhatariq.online`

## Post-deploy checks
1. Open `/api/health` and verify `{ "ok": true }`.
2. Test contact form -> `/api/contact` sends email via Resend.
3. Test chatbot -> `/api/chat` returns response from Gemini/fallback.
4. Confirm GTM loads with container `GTM-WFCCLN9J`.
5. In Google Search Console, submit:
   - `https://talhatariq.online/sitemap.xml`

