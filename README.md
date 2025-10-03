# Portal RT Cilosari Barat RT01/RW08 — Next.js + Firebase (v4, PWA + Export)
## Jalankan Lokal
```
npm install
cp .env.example .env.local   # isi dari Firebase Console
npm run dev
```
Buka http://localhost:3000

## Deploy ke Vercel
- Framework: Next.js
- Build: `npm run build`
- Output: `.next`
- ENV: `NEXT_PUBLIC_FIREBASE_*` dari Firebase

## Admin
- Buat akun di Authentication → salin UID
- Firestore: `users/{UID}` dengan `role:"admin"` dan biodata

## Koleksi
- pengumuman, agenda, laporan, umkm, iuran
- iuran fields: uid, kategori (rt|karangtaruna|pkk), bulan, jumlah, metode (tunai|transfer|ewallet), status, buktiUrl, ts

## PWA
- `public/manifest.json` + icons
- `next.config.js` (next-pwa) → otomatis service worker production
