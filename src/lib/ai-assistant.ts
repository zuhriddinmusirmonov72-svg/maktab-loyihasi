import { Language } from "./types";

interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `Sen "ECOGEN AI" — xalqaro darajadagi zamonaviy ekologik intellekt platformasining bosh sun'iy intellekt maslahatchisisan.
Sening maqsading: foydalanuvchilarga ekologiya, yashil iqtisodiyot, iqlim o'zgarishi, qayta tiklanuvchi energiya (ayniqsa O'zbekiston va Markaziy Osiyo sharoitida), suvni tejash, chiqindilarni qayta ishlash va ekologik startaplar bo'yicha ilmiy asoslangan, chuqur va amaliy tavsiyalar berish.

Qoidalar:
1. Har doim foydalanuvchi so'ragan tilda (o'zbek, rus yoki ingliz) professional va muloyim javob ber.
2. Faqat umumiy gaplar aytma — aniq raqamlar, amaliy qadamlar, iqtisodiy foyda va ekologik samara ko'rsat.
3. O'zbekistonning iqlimiy xususiyatlarini (yiliga 300+ quyoshli kun, suv taqchilligi, Orol fojiasi, tomchilatib sug'orish) hisobga ol.
4. Javoblaringni Markdown formatida (sarlavhalar, ro'yxatlar, qalin shriftlar) chiroyli strukturala.`;

export async function generateAiResponse(
  messages: ChatMessageInput[],
  language: Language = "uz"
): Promise<{ reply: string; isFallback: boolean }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct";

  if (apiKey && apiKey.trim() !== "") {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://ecogen-ai.uz",
          "X-Title": "ECOGEN AI Platform",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return { reply: content, isFallback: false };
        }
      }
    } catch (err) {
      console.warn("OpenRouter API call failed, switching to expert fallback:", err);
    }
  }

  // Autonomous expert fallback engine
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const fallbackReply = generateExpertFallback(lastUserMessage, language);

  return { reply: fallbackReply, isFallback: true };
}

function generateExpertFallback(query: string, lang: Language): string {
  const q = query.toLowerCase();

  // 1. Solar energy & Inverters
  if (q.includes("quyosh") || q.includes("panel") || q.includes("solnechn") || q.includes("solar")) {
    if (lang === "ru") {
      return `### ☀️ Экспертная оценка солнечной энергетики (Узбекистан)

Узбекистан обладает более **300 солнечными днями в году**, что делает фотоэлектрические станции одним из самых рентабельных зеленых вложений:

1. **Технические параметры для частного дома (5 кВт):**
   - **Площадь кровли:** 25–30 м²
   - **Выработка:** 7 000 – 8 500 кВт⋅ч в год
   - **Стоимость комплекта (панели Tier-1 + гибридный инвертор):** ~35 – 45 млн сум
2. **Экономический эффект:**
   - Покрытие 80–100% потребностей домохозяйства.
   - Срок окупаемости: **3.5 – 5 лет** при действующих тарифах.
   - Государственная программа компенсаций и продажа излишков в сеть по "зеленому тарифу".
3. **Экологический вклад:**
   - Предотвращение выброса **~4.2 тонн CO₂** ежегодно (эквивалентно посадке 190 деревьев).`;
    }
    if (lang === "en") {
      return `### ☀️ Solar Energy & Photovoltaics Assessment

With **over 300 sunny days annually**, Uzbekistan presents world-class solar irradiation (1,700–1,900 kWh/m²):

1. **Residential 5 kW System Benchmark:**
   - **Roof footprint:** 25–30 m²
   - **Annual Generation:** 7,200 – 8,500 kWh
   - **System Cost (Tier-1 Monocrystalline + Hybrid Inverter):** ~$3,000 – $3,600
2. **Economic Viability:**
   - Payback horizon: **3.5 to 4.8 years**.
   - Net-metering surplus power feed-in tariffs.
3. **Carbon Abatement:**
   - Mitigates **4.2 metric tons of CO₂** annually.`;
    }
    return `### ☀️ Quyosh energetikasi va Fotoelektr stansiyalari tahlili

O'zbekistonda yiliga **300 dan ortiq quyoshli kun** bo'lib, quyosh nurlanishi darajasi (1 m² ga 1800 kVt⋅soat) juda yuqori:

1. **Xonadon uchun 5 kVt quvvatli quyosh stansiyasi hisobi:**
   - **Zarur tom maydoni:** 25–30 m²
   - **Yillik elektr ishlab chiqarish:** 7 500 – 8 500 kVt⋅soat
   - **Taxminiy xarajat (Monokristall panellar + gibrid inverter):** 38–48 mln so'm
2. **Iqtisodiy foyda:**
   - Uyning barcha elektr ehtiyojini (konditsioner, muzlatkich, yoritish) to'liq qoplaydi.
   - Ortiqcha elektrni davlat tarmog'iga har 1 kVt⋅soati uchun 1000 so'mdan sotish imkoniyati mavjud.
   - O'zini oqlash muddati: **3.5 – 4.5 yil**.
3. **Ekologik samara:**
   - Yiliga atmosferaga **~4.3 tonna CO₂** chiqishining oldini oladi (bu 200 ta daraxt ekish bilan teng).`;
  }

  // 2. Water conservation & Drip irrigation
  if (q.includes("suv") || q.includes("sug'orish") || q.includes("voda") || q.includes("water") || q.includes("kapel")) {
    if (lang === "ru") {
      return `### 💧 Управление водными ресурсами и капельное орошение

В условиях аридного климата Центральной Азии рациональное водопользование — вопрос стратегической безопасности:

1. **Капельное орошение:**
   - Экономия поливной воды: **от 40% до 65%**.
   - Повышение урожайности за счет точечной подачи удобрений (фертигации): **+25–30%**.
   - Окупаемость на хлопковых и садовых полях: 1.5–2 сезона.
2. **Домашнее водосбережение:**
   - Установка аэраторов на краны (расход падает с 12 л/мин до 5 л/мин).
   - Двухрежимные смывные бачки и датчики утечек.`;
    }
    return `### 💧 Suv resurslarini tejash va Tomchilatib sug'orish tizimlari

Markaziy Osiyoda muzliklar erishi va daryolar oqimining kamayishi sharoitida suvni tejash strategik ahamiyatga ega:

1. **Qishloq xo'jaligida tomchilatib sug'orish:**
   - **Suv tejamkorligi:** An'anaviy ariq sug'orishga nisbatan **50–65% suv tejaladi**.
   - **Hosil unumdorligi:** O'g'itlarni to'g'ridan-to'g'ri ildizga yetkazish (fertigatsiya) orqali hosil 25–35% oshadi.
   - **Davlat subsidiyasi:** O'zbekistonda tejamkor sug'orish tizimlarini o'rnatgan fermerlarga har bir gektar uchun davlat tomonidan subsidiya va imtiyozli kreditlar ajratiladi.
2. **Kundalik xonadon odatlari:**
   - Kranlarga **aerator moslamalari** o'rnatish orqali bosimni pasaytirmasdan suv sarfini 40% tejash mumkin.
   - Tish tozalash va idish yuvishda suvni ochiq qoldirmaslik bir oilada oyiga 1.5–2 m³ toza suvni saqlab qoladi.`;
  }

  // 3. Aral Sea & Climate change
  if (q.includes("orol") || q.includes("aral") || q.includes("iqlim") || q.includes("klimat") || q.includes("climate") || q.includes("saksovul")) {
    return `### 🌍 Orol fojiasi, Iqlim o'zgarishi va Saksovul ekotizimi

Orol dengizining qurishi 20-asrning eng yirik antropogen fojeasi bo'lib, uning tubida 5.5 mln gektarlik **Orolqum cho'li** vujudga keldi:

1. **Saksovulning mo''jizaviy kuchi:**
   - Bir tup voyaga yetgan saksovul **4 tonnagacha ko'chma qum va zaharli tuzlarni** o'z ildizida ushlab qoladi.
   - Saksovul tuproqqa chuqur ildiz otib (10–15 metr), o'ta sho'rlangan va suvsiz muhitda yashay oladi.
   - So'nggi yillarda O'zbekiston hukumati tomonidan 1.8 million gektardan ortiq qurigan dengiz tubiga yashil qoplamalar ekildi.
2. **Iqlim o'zgarishi Markaziy Osiyoga qanday ta'sir qilmoqda?**
   - Tyanshan va Pomir tog'laridagi muzliklar so'nggi 50 yilda 30% ga qisqardi.
   - Chang-qum bo'ronlari soni keskin ortdi.
3. **Bosh vazifamiz:** Yashil belbog'lar (Green Belt) barpo etish va "Yashil Makon" umummilliy loyihasida faol ishtirok etish.`;
  }

  // 4. Waste & Recycling business
  if (q.includes("chiqindi") || q.includes("plastik") || q.includes("musor") || q.includes("otxod") || q.includes("waste") || q.includes("recycle") || q.includes("biznes")) {
    return `### ♻️ Chiqindilarni qayta ishlash va Yashil biznes imkoniyatlari

Bugungi kunda chiqindilar muammo emas, balki yuqori daromad keltiruvchi xomashyo hisoblanadi:

1. **PET va HDPE plastiklarini qayta ishlash:**
   - **Xomashyo:** Ishlatilgan ichimlik idishlari, kimyoviy vosita baklashkalari.
   - **Mahsulot:** Poliefir tolasi (sintepon, tekstil iplari) yoki texnik granulalar.
   - **Boshlang'ich investitsiya:** 120 – 180 mln so'm (maydalagich, yuvish vannasi, quritgich).
   - **Rentabellik:** 30–45%, o'zini oqlash muddati 8–12 oy.
2. **Organik chiqindilardan biogumus va o'g'it:**
   - Kaliforniya qizil yomg'ir chuvalchanglari yordamida biochiqindilarni qayta ishlash.
   - Organik dehqonchilik uchun eng talabgir o'g'it, xarajatlari minimal.
3. **Ekotashabbus:** Korxonangizda chiqindilarni manbasidayoq (qog'oz, shisha, plastik, organik) saralashni yo'lga qo'ying.`;
  }

  // Default intelligent assistant response
  return `### 🌱 ECOGEN AI — Barqaror Kelajak Tavsiyalari

Savolingiz uchun tashakkur! Ekologik intellekt tizimimiz quyidagi ustuvor amaliy yo'nalishlarni tavsiya qiladi:

1. **Energiya samaradorligi:**
   - Maishiy texnikalarni A+++ toifasiga yangilash va invertorli motorlardan foydalanish.
   - Xonadon va korxonalarda quyosh panellarini joriy etish.
2. **Suv resurslarini asrash:**
   - Qishloq xo'jaligida tomchilatib va yomg'irlatib sug'orishga to'liq o'tish.
   - Oqova suvlarni ikkilamchi tozalab, sug'orishga qayta yo'naltirish.
3. **Sirkulyar iste'mol odatlari:**
   - Bir martalik plastiklardan (paketlar, idishlar) voz kechib, qayta ishlatiladigan ekologik materiallarga o'tish.
   - Shaxsiy uglerod izingizni platformamizdagi **Ekologik Kalkulyator** orqali doimiy hisoblab borish.

Qo'shimcha aniq savol berishingiz mumkin — masalan: *Quyosh stansiyasi hisobi*, *Tomchilatib sug'orish xarajatlari* yoki *Orolbo'yi loyihalari*!`;
}
