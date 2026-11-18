# 🌿 ECOGEN AI — Next-Generation Ecological Intelligence Platform

> **"Bugungi innovatsiya — ertangi yashil kelajak."**

**ECOGEN AI** — sun’iy intellekt, yashil iqtisodiyot, iqlim o‘zgarishi va zamonaviy interaktiv ta’limni bitta yaxlit raqamli ekotizimga birlashtirgan xalqaro darajadagi professional web-platforma.

---

## 🚀 Tezkor Ishga Tushirish (Quick Start)

Loyiha hozirda mahalliy serverda ishga tushirilgan:
👉 **[http://localhost:3000](http://localhost:3000)**

### 👑 Musobaqa Hakamlari uchun Demo Rejim (1-bosishda kirish):
Sayt yuqorisida maxsus **Demo Panel** o'rnatilgan bo'lib, quyidagi hisoblarga birgina tugma orqali kirishingiz mumkin:
- **Demo Talaba**: `demo@ecogen.uz` (Parol: `demo123`, Daraja: 4, 380 XP, 88 Eco Score)
- **Boshqaruvchi (Admin)**: `admin@ecogen.uz` (Parol: `admin123`, Daraja: 10, 1500 XP)

---

## 🛠 Texnologiyalar Steki

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts, Canvas-Confetti
- **Backend**: Next.js Server Actions & API Routes, Node.js, Prisma ORM, Zod validation
- **Ma'lumotlar bazasi**: SQLite (mahalliy nol-konfiguratsiya sinovi uchun), PostgreSQL (Neon/Supabase/Vercel Postgres uchun to'liq moslangan)
- **Autentifikatsiya**: JWT (jose) asosidagi xavfsiz HTTP-only session cookie'lar, bcryptjs parollarni xesh qilish, Role-Based Access Control (`USER`, `ADMIN`)
- **Sun'iy Intellekt**: OpenRouter API (`OPENROUTER_API_KEY`) va avtonom aqlli ekologik tahlil modeli (fallback rejimi — internet yoki API kaliti bo'lmaganda ham 100% amaliy ilmiy maslahatlar beradi)
- **Ko'p tillilik (i18n)**: O'zbek tili (asosiy), Rus tili va Ingliz tili (butun tizim bo'ylab)
- **Dizayn**: Apple, Linear va Stripe darajasidagi premium minimalizm, Glassmorphism, Dark/Light rejim

---

## 🌐 Platformaning Asosiy Modullari

### 1. Bosh Sahifa (Landing Page)
- 3D interaktiv Yer shari (Canvas zarrachalari va orbital animatsiyalar)
- 4 ta ustun: *Green Economy*, *Artificial Intelligence*, *Climate Change*, *Smart Education*
- Haqiqiy bazadan olingan jonli statistik ko'rsatkichlar
- Uglerod kalkulyatori va AI maslahatchisi prevyulari
- FAQ va Call-to-Action bloklari

### 2. AI Eco Assistant (AI Yordamchi)
- Zamonaviy chat interfeysi: savol-javoblar, Enter orqali yuborish, Shift+Enter yangi qator
- Tezkor tavsiya chiplari (Quyosh panellari hisobi, Tomchilatib sug'orish, Plastik qayta ishlash)
- Markdown formatlash, javoblardan nusxa olish (Copy)
- Rate limiting va xavfsiz server tomonida chaqiruv

### 3. Green Economy (Yashil Iqtisodiyot)
- **Shaxsiy Ekologik Kalkulyator**: Elektr (kVt⋅soat), Suv (m³), Transport turi va masofasi (km), Maishiy chiqindi (kg).
- Recharts asosidagi taqsimot va sohaviy grafiklar
- BMT (UNEP) va O'zbekiston energetika tizimi koeffitsiyentlariga asoslangan metodologiya
- **Green Business Ideas**: Quyosh servisi, polimer-qum koshinlar (Ecotiles), aqlli sug'orish datchiklari, biogumus, organik qadoqlash (muammo, yechim, resurslar, xarajat, o'zini oqlash muddati)

### 4. Climate Change (Iqlim O'zgarishi)
- **Climate Dashboard**: 1960–2026 yillar dinamikasi (Global harorat anomaliyasi, CO₂ ppm, Orol dengizi sathi, Qayta tiklanuvchi energiya GW)
- **O'zbekistonning Eko-Xaritasi**: 14 ta hudud (Qoraqalpog'iston/Orolbo'yi, Navoiy, Buxoro, Toshkent va h.k.) bo'yicha quyosh salohiyati, suv resurslari bosimi, yashil qoplamalar va ustuvor loyihalar
- Orol fojiasi va saksovul ekotizimi bo'yicha ilmiy materiallar

### 5. Smart Education (Ta'lim Akademiyasi)
- 6 ta fundamental kurs:
  1. *Ekologiya asoslari va Tabiat muvozanati*
  2. *Yashil Iqtisodiyot va Sirkulyar Modellar*
  3. *Sun'iy Intellekt va Ekologik Tizimlar*
  4. *Iqlim O'zgarishi va Orol Dengizi Fojiasi*
  5. *Qayta Tiklanuvchi Energiya Tizimlari*
  6. *Ekologik Innovatsiyalar va Startaplar*
- Darslar va materiallar
- **Interaktiv Quiz Tizimi**: Savollar, 4 ta variant, ballar, to'g'ri/noto'g'ri javoblarning ilmiy tushuntirishi, konfetti nishonlash animatsiyasi
- **Gamifikatsiya va Leaderboard**: XP to'plash, darajalar (Level 1..10), nishonlar (*Eco Beginner*, *Green Thinker*, *Climate Expert*, *AI Explorer*, *Eco Champion*)

### 6. User Dashboard (Shaxsiy Kabinet)
- Shaxsiy profil, daraja, XP, Eco Impact Score
- Qo'lga kiritilgan nishonlar tokchasi
- Shaxsiy uglerod izi hisob-kitoblari tarixi
- **Eko Hisobotni Chop Etish (PDF / Print)**: Musobaqa yoki shaxsiy monitoring uchun barcha natijalarni qulay chop etish

### 7. Admin Panel (Boshqaruv Paneli)
- Faqat `ADMIN` roli uchun himoyalangan (`/admin`)
- Foydalanuvchilar ro'yxati, rollarni boshqarish (`USER` <-> `ADMIN`), o'chirish
- Loyihalar moderatsiyasi (*Approved*, *Pending*, *Rejected*)
- O'quv rejalari va tizim statistikasi monitoringi

### 8. Eco Challenges (Haftalik Topshiriqlar)
- 1 hafta plastik xaltasiz xarid qilish, dush vaqtini 5 daqiqadan oshirmaslik, chiroqlarni o'chirish, kam uglerodli qatnov
- 1-bosishda topshiriqni bajarish va progress bar orqali kuzatish

---

## ⚙️ Loyihani Noldan Sozlash va Ishga Tushirish

```bash
# 1. Qaramliklarni o'rnatish
pnpm install

# 2. Ma'lumotlar bazasini sinxronlash
npx prisma db push

# 3. Bazani tayyor ma'lumotlar bilan to'ldirish (Seed)
node prisma/seed.mjs

# 4. Mahalliy serverni ishga tushirish
npx next dev -p 3000
```

---

## 📄 Litsenziya va Mualliflik

ECOGEN AI platformasi xalqaro ekologik musobaqalar, hakatonlar va Barqaror Rivojlanish Maqsadlari (UN SDGs) uchun ishlab chiqilgan.
© 2026 ECOGEN AI. Barcha huquqlar himoyalangan.
