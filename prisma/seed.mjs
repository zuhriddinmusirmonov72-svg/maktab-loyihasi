import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ECOGEN AI database...");

  // 1. Clean existing records if any
  await prisma.userChallenge.deleteMany();
  await prisma.ecoChallenge.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.ecoCalculation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const demoPassword = await bcrypt.hash("demo123", 10);

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@ecogen.uz",
      name: "ECOGEN Boshqaruvchi",
      passwordHash: adminPassword,
      role: "ADMIN",
      level: 10,
      xp: 1500,
      ecoScore: 98,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@ecogen.uz",
      name: "Jasur Rahmatov",
      passwordHash: demoPassword,
      role: "USER",
      level: 4,
      xp: 380,
      ecoScore: 88,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentUser1 = await prisma.user.create({
    data: {
      email: "madina@ecogen.uz",
      name: "Madina Aliyeva",
      passwordHash: demoPassword,
      role: "USER",
      level: 5,
      xp: 520,
      ecoScore: 94,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: "azamat@ecogen.uz",
      name: "Azamat Nurmatov",
      passwordHash: demoPassword,
      role: "USER",
      level: 3,
      xp: 290,
      ecoScore: 82,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("Users created: admin@ecogen.uz, demo@ecogen.uz");

  // 4. Badges
  const badges = [
    {
      code: "eco-beginner",
      titleUz: "Eco Boshlang'ich",
      titleRu: "Эко-новичок",
      titleEn: "Eco Beginner",
      descUz: "Platformaga a'zo bo'lib, birinchi ekologik topshiriqni bajarganlik uchun.",
      descRu: "За регистрацию и выполнение первого эко-задания.",
      descEn: "For joining and completing the first eco mission.",
      icon: "Sprout",
      pointsRequired: 50,
    },
    {
      code: "green-thinker",
      titleUz: "Yashil Tafakkur",
      titleRu: "Зеленый мыслитель",
      titleEn: "Green Thinker",
      descUz: "Yashil iqtisodiyot kursini o'qib, kalkulyatordan foydalanganlik uchun.",
      descRu: "За прохождение курса зеленой экономики и расчет эко-следа.",
      descEn: "For completing the green economy course and using the eco calculator.",
      icon: "Brain",
      pointsRequired: 150,
    },
    {
      code: "climate-expert",
      titleUz: "Iqlim Eksperti",
      titleRu: "Эксперт по климату",
      titleEn: "Climate Expert",
      descUz: "Iqlim o'zgarishi bo'yicha barcha testlarni 85% dan yuqori ballga topshirganlik uchun.",
      descRu: "За успешную сдачу всех климатических тестов выше 85%.",
      descEn: "For passing all climate change quizzes with scores above 85%.",
      icon: "Globe",
      pointsRequired: 300,
    },
    {
      code: "ai-explorer",
      titleUz: "AI Tadqiqotchi",
      titleRu: "AI Исследователь",
      titleEn: "AI Explorer",
      descUz: "Sun'iy intellekt ekologik yordamchisi bilan 5 martadan ko'p maslahatlashganlik uchun.",
      descRu: "За активное использование AI-ассистента в эко-исследованиях.",
      descEn: "For engaging with the AI Eco Assistant for personalized advice.",
      icon: "Sparkles",
      pointsRequired: 200,
    },
    {
      code: "eco-champion",
      titleUz: "Eco Chempion",
      titleRu: "Эко-чемпион",
      titleEn: "Eco Champion",
      descUz: "O'zining shaxsiy ekologik loyihasini taqdim etgan va 500+ XP to'plagan lider.",
      descRu: "За создание авторского проекта и достижение 500+ XP.",
      descEn: "For publishing an approved project and accumulating 500+ XP.",
      icon: "Award",
      pointsRequired: 500,
    },
  ];

  const createdBadges = [];
  for (const b of badges) {
    const badge = await prisma.badge.create({ data: b });
    createdBadges.push(badge);
  }

  // Assign initial badges to demo user
  await prisma.userBadge.create({
    data: {
      userId: demoUser.id,
      badgeId: createdBadges[0].id,
    },
  });
  await prisma.userBadge.create({
    data: {
      userId: demoUser.id,
      badgeId: createdBadges[1].id,
    },
  });
  await prisma.userBadge.create({
    data: {
      userId: demoUser.id,
      badgeId: createdBadges[3].id,
    },
  });

  // Assign badge to student 1
  await prisma.userBadge.create({
    data: {
      userId: studentUser1.id,
      badgeId: createdBadges[4].id,
    },
  });

  // 5. Courses and Lessons
  const coursesData = [
    {
      slug: "ekologiya-asoslari",
      titleUz: "Ekologiya asoslari va Tabiat muvozanati",
      titleRu: "Основы экологии и природный баланс",
      titleEn: "Fundamentals of Ecology and Balance of Nature",
      descUz: "Biosfera, biogeokimyoviy sikllar, oziq zanjirlari va insoniyatning atrof-muhitga ta'siri haqida fundamental bilimlar.",
      descRu: "Фундаментальные знания о биосфере, биогеохимических циклах и влиянии человека на окружающую среду.",
      descEn: "Core insights into the biosphere, biogeochemical cycles, food webs, and human environmental footprint.",
      level: "Boshlang'ich",
      duration: "2 soat",
      category: "Ekologiya",
      icon: "Leaf",
      order: 1,
      lessons: [
        {
          titleUz: "Biosfera va uning tarkibiy qismlari",
          titleRu: "Биосфера и её компоненты",
          titleEn: "The Biosphere and its Key Components",
          durationMinutes: 20,
          order: 1,
          contentUz: `# 1-dars: Biosfera va uning tarkibiy qismlari

Biosfera — Yer sayyorasining tirik organizmlar yashaydigan va ular faoliyati bilan o'zgargan qobig'idir. Bu atamani birinchi marta 1875-yilda avstriyalik geolog Eduard Zyuss fanga kiritgan bo'lsa-da, uning hozirgi zamonaviy ta'limotini Vladimir Vernadskiy yaratgan.

## Biosferaning asosiy chegaralari:
1. **Litosfera (yer qobig'i)**: Chuqurligi 3-4 km gacha bo'lgan chuqurliklarda bakteriyalar uchraydi.
2. **Gidrosfera (suv havzalari)**: Dunyo okeanining eng chuqur botig'i (Mariana botig'i, 11 022 m) gacha hayot mavjud.
3. **Atmosfera (havo qobig'i)**: 20-25 km balandlikdagi ozon qatlamigacha tirik organizmlarning sporalari va bakteriyalar yetib boradi.

### Ekologik muvozanat qoidasi
Har bir tirik mavjudot — o'simlik, hasharot, qush yoki mikroorganizm — yagona oziq-ovqat va energiya zanjirining ajralmas bo'g'inidir. Biror bo'g'inning uzilishi butun tizimda to'lqinsimon salbiy inqirozni keltirib chiqaradi.

Bugungi kunda insoniyat resurslarni sayyoramiz qayta tiklay oladiganidan 1.7 barobar tezroq iste'mol qilmoqda. Barqaror yashash — kelgusi avlodlar taqdirini kafolatlashning yagona yo'lidir.`,
          contentRu: `# Урок 1: Биосфера и её компоненты

Биосфера — это оболочка Земли, заселенная живыми организмами и находящаяся под их воздействием. Впервые термин ввел Эдуард Зюсс в 1875 году, а целостное учение создал В. И. Вернадский.

## Границы биосферы:
- Литосфера (до 3-4 км вглубь)
- Гидросфера (вплоть до глубочайших впадин Марианского желоба, ~11 км)
- Атмосфера (до озонового слоя, 20-25 км)

Сохранение экологического баланса требует от человечества перехода к устойчивому потреблению.`,
          contentEn: `# Lesson 1: The Biosphere and its Key Components

The biosphere is the global ecological system integrating all living beings and their relationships. Coined by Eduard Suess and systematized by Vladimir Vernadsky.

## Key Boundaries:
- Lithosphere (down to 3-4 km)
- Hydrosphere (all the way to the deepest ocean trenches at ~11,000 m)
- Atmosphere (up to the protective ozone shield at 20-25 km)

Sustainable resource utilization ensures future generations inherit a thriving living planet.`,
        },
        {
          titleUz: "Biologik xilma-xillik va ekotizim xizmatlari",
          titleRu: "Биоразнообразие и экосистемные услуги",
          titleEn: "Biodiversity and Ecosystem Services",
          durationMinutes: 25,
          order: 2,
          contentUz: `# 2-dars: Biologik xilma-xillik va ekotizim xizmatlari

Biologik xilma-xillik (biodiversity) — bu Yer yuzidagi barcha tirik mavjudotlarning xilma-xilligi, jumladan genetik, tur va ekotizimlar rang-barangligidir.

## Ekotizimlar bizga nima beradi?
1. **Ta'minlovchi xizmatlar**: Toza ichimlik suvi, oziq-ovqat, yog'och, dorivor giyohlar va tabiiy tolalar.
2. **Boshqaruvchi xizmatlar**: Iqlimni mo'tadillashtirish, suv toshqinlarini oldini olish, suvni tabiiy filtrlash, havoni tozalash.
3. **Qo'llab-quvvatlovchi xizmatlar**: Tuproq hosil bo'lishi, changlatish (asalarilar va qushlar orqali hosilning 75% i bog'liq), fotosintez.
4. **Madaniy xizmatlar**: Rekreatsiya, estetik zavq, ekoturizm va ruhiy xotirjamlik.

O'zbekistonning "Qizil kitobi" ga kiritilgan nodir turlarni muhofaza qilish — Markaziy Osiyo cho'l va tog' ekotizimlarini asrashda hal qiluvchi rol o'ynaydi.`,
          contentRu: `# Урок 2: Биоразнообразие и экосистемные услуги

Биоразнообразие включает разнообразие генов, видов и целых экосистем.

Основные сервисы природы:
- Обеспечивающие (вода, пища, древесина)
- Регулирующие (климат, опыление, круговорот воды)
- Культурные и оздоровительные.`,
          contentEn: `# Lesson 2: Biodiversity and Ecosystem Services

Biodiversity underpins all life on Earth. Nature provides four major ecosystem services: provisioning, regulating, supporting, and cultural values. Protecting endangered species in Central Asian arid and mountain biomes is crucial.`,
        },
        {
          titleUz: "Antropogen omillar va global ekologik tahdidlar",
          titleRu: "Антропогенные факторы и экологические угрозы",
          titleEn: "Anthropogenic Factors and Global Threats",
          durationMinutes: 20,
          order: 3,
          contentUz: `# 3-dars: Antropogen omillar va global ekologik tahdidlar

Inson faoliyati (antropogen omillar) so'nggi 150 yil ichida tabiat tarixidagi eng tez sur'atli o'zgarishlarni keltirib chiqardi:
- **Plastik ifloslanish**: Har yili 400 million tonnadan ortiq plastik ishlab chiqariladi, uning 85% i chiqindi poligonlariga yoki okeanlarga tushadi.
- **O'rmonlarning qisqarishi**: Har yili 10 million gektar o'rmon maydonlari kesilmoqda.
- **Suv tanqisligi**: Dunyo aholisining uchdan bir qismi toza ichimlik suvi taqchilligidan aziyat chekmoqda.

Har birimiz o'z kundalik hayotimizda "3R" qoidasiga (Reduce — Kamaytirish, Reuse — Qayta ishlatish, Recycle — Qayta ishlash) amal qilishimiz zarur.`,
          contentRu: `# Урок 3: Антропогенные факторы и экологические угрозы

Человеческая деятельность ускорила деградацию почв, пластиковое загрязнение и потерю биосферы. Принцип 3R (Reduce, Reuse, Recycle) — практический ответ каждого гражданина.`,
          contentEn: `# Lesson 3: Anthropogenic Factors and Global Threats

Human activity has driven massive plastic accumulation, deforestation, and water stress. Applying the 3R principle (Reduce, Reuse, Recycle) is our collective imperative.`,
        },
      ],
      quiz: {
        titleUz: "Ekologiya asoslari bo'yicha yakuniy sinov",
        titleRu: "Итоговый тест: Основы экологии",
        titleEn: "Ecology Fundamentals Mastery Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "Biosfera ta'limotiga eng katta ilmiy hissa qo'shgan olim kim?",
            questionRu: "Какой ученый внес ключевой вклад в целостное учение о биосфере?",
            questionEn: "Which scientist made the foundational contribution to modern biosphere doctrine?",
            explanationUz: "Eduard Zyuss atamani fanga kiritgan bo'lsa-da, biosferaning yaxlit ilmiy ta'limotini Vladimir Vernadskiy yaratgan.",
            explanationRu: "Термин ввел Зюсс, но целостное учение создал Владимир Вернадский.",
            explanationEn: "While Suess coined the term, Vladimir Vernadsky developed the comprehensive scientific doctrine of the biosphere.",
            answers: [
              { textUz: "Vladimir Vernadskiy", textRu: "Владимир Вернадский", textEn: "Vladimir Vernadsky", isCorrect: true },
              { textUz: "Charlz Darvin", textRu: "Чарльз Дарвин", textEn: "Charles Darwin", isCorrect: false },
              { textUz: "Dmitriy Mendeleyev", textRu: "Дмитрий Менделеев", textEn: "Dmitri Mendeleev", isCorrect: false },
              { textUz: "Albert Eynshteyn", textRu: "Альберт Эйнштейн", textEn: "Albert Einstein", isCorrect: false },
            ],
          },
          {
            order: 2,
            points: 10,
            questionUz: "Qaysi xizmat 'Ekotizimning ta'minlovchi xizmatlari' ga kiradi?",
            questionRu: "Что относится к 'обеспечивающим услугам экосистем'?",
            questionEn: "Which service falls directly under 'Provisioning Ecosystem Services'?",
            explanationUz: "Toza ichimlik suvi, oziq-ovqat va yog'och ta'minlovchi (provisioning) xizmatlar hisoblanadi.",
            explanationRu: "Пресная вода, пища и сырье — это обеспечивающие сервисы.",
            explanationEn: "Fresh water, food crops, and raw timber are provisioning services.",
            answers: [
              { textUz: "Ichimlik suvi va oziq-ovqat yetkazib berish", textRu: "Снабжение пресной водой и продовольствием", textEn: "Fresh water and food supply", isCorrect: true },
              { textUz: "Fotosintez jarayoni", textRu: "Процесс фотосинтеза", textEn: "Photosynthesis process", isCorrect: false },
              { textUz: "Ekoturizm va dam olish", textRu: "Экотуризм и отдых", textEn: "Ecotourism and recreation", isCorrect: false },
              { textUz: "Havoni tabiiy changlatish", textRu: "Опыление ветром", textEn: "Wind pollination", isCorrect: false },
            ],
          },
          {
            order: 3,
            points: 10,
            questionUz: "Barqaror chiqindilarni boshqarishdagi 3R tamoyili nimani anglatadi?",
            questionRu: "Что означает экологический принцип 3R?",
            questionEn: "What does the 3R sustainability framework stand for?",
            explanationUz: "3R: Reduce (Kamaytirish), Reuse (Qayta ishlatish), Recycle (Qayta ishlash).",
            explanationRu: "Reduce (Сократить), Reuse (Повторно использовать), Recycle (Переработать).",
            explanationEn: "Reduce, Reuse, Recycle.",
            answers: [
              { textUz: "Reduce, Reuse, Recycle", textRu: "Reduce, Reuse, Recycle (Сокращай, Используй снова, Перерабатывай)", textEn: "Reduce, Reuse, Recycle", isCorrect: true },
              { textUz: "Read, Run, Rest", textRu: "Read, Run, Rest", textEn: "Read, Run, Rest", isCorrect: false },
              { textUz: "Remove, Reset, Repeat", textRu: "Remove, Reset, Repeat", textEn: "Remove, Reset, Repeat", isCorrect: false },
              { textUz: "Rebuild, Rent, Recover", textRu: "Rebuild, Rent, Recover", textEn: "Rebuild, Rent, Recover", isCorrect: false },
            ],
          },
        ],
      },
    },
    {
      slug: "yashil-iqtisodiyot",
      titleUz: "Yashil Iqtisodiyot va Sirkulyar Modellar",
      titleRu: "Зеленая экономика и циркулярные модели",
      titleEn: "Green Economy and Circular Business Models",
      descUz: "Chiziqli iqtisodiyotdan sirkulyar tizimlarga o'tish, ESG standartlari, uglerod bozori va yashil investitsiyalar.",
      descRu: "Переход от линейной экономики к замкнутому циклу, стандарты ESG и зеленые инвестиции.",
      descEn: "Transitioning from linear to circular systems, ESG standards, carbon credits, and green finance.",
      level: "O'rta",
      duration: "3 soat",
      category: "Iqtisodiyot",
      icon: "TrendingUp",
      order: 2,
      lessons: [
        {
          titleUz: "Sirkulyar (aylanma) iqtisodiyot tamoyillari",
          titleRu: "Принципы циклической экономики",
          titleEn: "Principles of the Circular Economy",
          durationMinutes: 25,
          order: 1,
          contentUz: `# Sirkulyar iqtisodiyot: "Ishlat — tashla" dan "Qayta yarat" ga

An'anaviy chiziqli iqtisodiyot "Olish — Ishlab chiqarish — Chiqitga chiqarish" (Take - Make - Dispose) modeliga tayanadi. Bu esa xomashyo zaxiralarining tugashiga va atrof-muhitning ifloslanishiga olib keladi.

## Sirkulyar iqtisodiyotning 3 ta asosiy ustuni:
1. **Chiqindi va ifloslanishni dizayn bosqichidayoq bartaraf etish**: Mahsulot yaratilayotganda uni qismlarga ajratish va qayta ishlash imkoniyati ko'zda tutiladi.
2. **Mahsulot va materiallarni eng yuqori foydali qiymatda ushlab turish**: Ta'mirlash, modernizatsiya qilish va almashish platformalari (sharing economy).
3. **Tabiiy tizimlarni qayta tiklash**: Ishlab chiqarish jarayonida atrof-muhitga zarar yetkazish o'rniga tuproq va suvni yaxshilash.`,
          contentRu: `# Циркулярная экономика

В отличие от линейной модели («добыть — произвести — выбросить»), экономика замкнутого цикла исключает отходы уже на этапе проектирования, продлевает жизнь материалам и восстанавливает природу.`,
          contentEn: `# The Circular Economy

Moving beyond the extractive 'take-make-waste' paradigm towards regenerative design, lifecycle extension, and continuous material loops.`,
        },
        {
          titleUz: "ESG standartlari va Yashil investitsiyalar",
          titleRu: "Стандарты ESG и зеленые инвестиции",
          titleEn: "ESG Standards and Green Financing",
          durationMinutes: 30,
          order: 2,
          contentUz: `# ESG: Environmental, Social, and Governance

Xalqaro moliya institutlari (Jahon banki, YeTTB, OTB) korxonalarga kredit va sarmoya ajratishda ESG ko'rsatkichlariga qat'iy e'tibor qaratmoqda:
- **E (Environmental)**: Korxonaning uglerod izi, energiya samaradorligi, suv sarfi va chiqindilarni utilizatsiya qilishi.
- **S (Social)**: Ishchilar xavfsizligi, adolatli maosh, mahalliy aholi farovonligiga qo'shilgan hissa.
- **G (Governance)**: Korporativ boshqaruv shaffofligi, korrupsiyaga qarshi nazorat va hisobdorlik.

O'zbekistonda yashil obligatsiyalar (Green Bonds) emissiyasi mamlakatning qayta tiklanuvchi energiya loyihalarini moliyalashtirishda yangi davrni ochib berdi.`,
          contentRu: `# ESG и зеленые финансы

Environmental, Social, Governance — три столпа оценки устойчивости бизнеса. Инвесторы выбирают компании с низким углеродным следом и открытым управлением.`,
          contentEn: `# ESG & Sustainable Investment

Environmental, Social, and Governance metrics dictate institutional capital allocation. Green bonds empower utility-scale decarbonization projects.`,
        },
      ],
      quiz: {
        titleUz: "Yashil iqtisodiyot va ESG bilimlari sinovi",
        titleRu: "Тест: Зеленая экономика и ESG",
        titleEn: "Green Economy & ESG Mastery Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "Sirkulyar iqtisodiyotning chiziqli iqtisodiyotdan tub farqi nimada?",
            questionRu: "В чем главное отличие циклической экономики от линейной?",
            questionEn: "What is the primary distinction of circular economy compared to linear?",
            explanationUz: "Sirkulyar model materiallarni doimiy aylanmada saqlab, chiqindini dizayn bosqichida bartaraf etadi.",
            explanationRu: "Циклический подход ликвидирует отходы на стадии проектирования и сохраняет ресурсы в обороте.",
            explanationEn: "Circular systems eliminate waste by design and circulate products and materials continuously.",
            answers: [
              { textUz: "Chiqindilarni nollashtirib, materiallarni aylanma siklda saqlash", textRu: "Устранение отходов и сохранение ресурсов в бесконечном цикле", textEn: "Eliminating waste and keeping resources in continuous loops", isCorrect: true },
              { textUz: "Faqatgina plastik idishlarni ko'mish", textRu: "Захоронение пластиковых отходов", textEn: "Burying plastic waste in landfills", isCorrect: false },
              { textUz: "Qazilma yoqilg'i qazib olishni ko'paytirish", textRu: "Увеличение добычи угля и нефти", textEn: "Increasing extraction of fossil fuels", isCorrect: false },
              { textUz: "Mahsulot narxini 2 barobar qimmat qilish", textRu: "Удвоение цены товаров", textEn: "Doubling product consumer prices", isCorrect: false },
            ],
          },
          {
            order: 2,
            points: 10,
            questionUz: "ESG qisqartmasidagi 'E' harfi nimani bildiradi?",
            questionRu: "Что означает буква 'E' в аббревиатуре ESG?",
            questionEn: "What does 'E' signify in the ESG framework?",
            explanationUz: "E — Environmental (Atrof-muhit va ekologik mas'uliyat).",
            explanationRu: "E — Environmental (Окружающая среда).",
            explanationEn: "E stands for Environmental factors.",
            answers: [
              { textUz: "Environmental (Atrof-muhit)", textRu: "Environmental (Экология и окружающая среда)", textEn: "Environmental", isCorrect: true },
              { textUz: "Economic (Iqtisodiyot)", textRu: "Economic (Экономика)", textEn: "Economic", isCorrect: false },
              { textUz: "Education (Ta'lim)", textRu: "Education (Образование)", textEn: "Education", isCorrect: false },
              { textUz: "Energy (Elektr quvvati)", textRu: "Energy (Энергетика)", textEn: "Energy", isCorrect: false },
            ],
          },
        ],
      },
    },
    {
      slug: "ai-va-ekologiya",
      titleUz: "Sun'iy Intellekt va Ekologik Tizimlar",
      titleRu: "Искусственный интеллект и экология",
      titleEn: "Artificial Intelligence in Environmental Systems",
      descUz: "Kompyuter ko'rish orqali o'rmonlar monitoringi, sun'iy yo'ldosh tahlili, aqlli gridlar va resurslarni optimallashtirish.",
      descRu: "Компьютерное зрение для мониторинга лесов, спутниковый анализ и умные энергосети.",
      descEn: "Computer vision for deforestation tracking, satellite multispectral analytics, and smart grid optimization.",
      level: "Ilg'or",
      duration: "2.5 soat",
      category: "Texnologiya",
      icon: "Cpu",
      order: 3,
      lessons: [
        {
          titleUz: "Sun'iy intellekt orqali atrof-muhit monitoringi",
          titleRu: "Эко-мониторинг с помощью искусственного интеллекта",
          titleEn: "AI-Powered Environmental Remote Sensing",
          durationMinutes: 25,
          order: 1,
          contentUz: `# AI qanday qilib sayyoramizni asrab qolishda yordam bermoqda?

Sun'iy intellekt va mashinaviy o'rganish (Machine Learning) ekologik ma'lumotlarni sekundlar ichida tahlil qilish imkonini beradi:
1. **Sentinel va Landsat sun'iy yo'ldosh tasvirlarini tahlil qilish**: Muzliklarning erish sur'ati, Orol dengizi tubining o'zgarishi va cho'llanish jarayonini avtomatlashtirilgan xaritalash.
2. **Bioakustik datchiklar orqali o'rmonlarni asrash**: O'rmonlarda o'rnatilgan aqlli mikrofonlar zanjirli arra tovushini yoki noqonuniy ovchilarni darhol aniqlab, soqchilarga signal yuboradi.
3. **Aqlli sug'orish tizimlari (Smart Irrigation)**: Tuproq namligi va ob-havo bashoratini tahlil qilib, suv sarfini 40-50% ga qisqartiradi.`,
          contentRu: `# Как искусственный интеллект спасает планету

От спутникового анализа динамики Аральского моря до акустических нейросетей против браконьеров в заповедниках — ИИ трансформирует экологический менеджмент.`,
          contentEn: `# How AI Protects Planetary Boundaries

From satellite-based desertification telemetry in the Aral Sea basin to neural audio detectors for illegal logging, artificial intelligence is revolutionizing planetary stewardship.`,
        },
      ],
      quiz: {
        titleUz: "AI va ekologiya bo'yicha amaliy test",
        titleRu: "Тест: ИИ в экологии",
        titleEn: "AI in Ecology Practical Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "Aqlli sug'orish tizimlarida sun'iy intellekt qanday asosiy vazifani bajaradi?",
            questionRu: "Какую ключевую роль играет ИИ в умных системах орошения?",
            questionEn: "What is the primary role of AI in precision agricultural irrigation?",
            explanationUz: "Tuproq namligi va iqlimiy datchiklar ma'lumotlarini tahlil qilib, suvni kerakli miqdorda aniq va tejamkor yo'naltiradi.",
            explanationRu: "Анализирует датчики влажности почвы и оптимизирует точечный расход воды.",
            explanationEn: "It analyzes real-time soil moisture and weather inputs to precisely optimize water conservation.",
            answers: [
              { textUz: "Datchiklar asosida kerakli paytda aniq suv sarfini hisoblash va tejash", textRu: "Оптимизация полива на основе данных датчиков и экономия воды", textEn: "Optimizing water delivery via sensor feedback to prevent waste", isCorrect: true },
              { textUz: "Faqat suv nasoslarini qo'lda yoqish", textRu: "Ручное включение насоса", textEn: "Manual switch operation", isCorrect: false },
              { textUz: "Suvga kimyoviy bo'yoq qo'shish", textRu: "Добавление красителей в воду", textEn: "Adding chemical dyes to water", isCorrect: false },
              { textUz: "Traktorlarni bezash", textRu: "Декорация техники", textEn: "Tractor decoration", isCorrect: false },
            ],
          },
        ],
      },
    },
    {
      slug: "iqlim-ozgarishi-va-markaziy-osiyo",
      titleUz: "Iqlim O'zgarishi va Orol Dengizi Fojiasi",
      titleRu: "Изменение климата и трагедия Арала",
      titleEn: "Climate Change and the Aral Sea Crisis",
      descUz: "Orolqum cho'li, chang bo'ronlari, Markaziy Osiyoda muzliklarning erishi va hududiy moslashuv strategiyalari.",
      descRu: "Пустыня Аралкум, соляные бури, таяние ледников Тянь-Шаня и адаптация региона.",
      descEn: "Aralkum desert formation, salt storms, Tien Shan deglaciation, and regional adaptation.",
      level: "Boshlang'ich",
      duration: "2 soat",
      category: "Iqlim",
      icon: "Sun",
      order: 4,
      lessons: [
        {
          titleUz: "Orol dengizining qurishi va Orolqum ekotizimi",
          titleRu: "Высыхание Аральского моря и пустыня Аралкум",
          titleEn: "Aral Sea Desiccation and Aralkum Desert",
          durationMinutes: 25,
          order: 1,
          contentUz: `# Orol fojiasi: 20-asrning eng yirik ekologik halokati

Orol dengizi bir paytlar dunyodagi to'rtinchi eng katta ko'l edi (maydoni 68 000 km²). 1960-yillardan boshlab Amudaryo va Sirdaryo suvlarining paxta maydonlarini sug'orishga me'yordan ortiq yo'naltirilishi natijasida dengiz sathi keskin kamaydi.

## Oqibatlar:
- Qurigan tubda 5.5 million gektarlik yangi cho'l — **Orolqum** vujudga keldi.
- Har yili shamol orqali atmosferaga 100 million tonnadan ziyod zaharli tuz va chang ko'tarilib, minglab kilometrlarga (hatto Skandinaviyagacha) yetib bormoqda.
- Hududda mikroiqlim qattiq kontinentallashdi: yozlar yanada issiq va quruq, qishlar qattiq sovuqqa aylandi.

## Yechim — Yashil qoplamalar:
O'zbekiston hukumati tashabbusi bilan dengizning qurigan tubida 2 million gektarga yaqin maydonda **saksovul** va cho'l o'simliklari ekilmoqda. Saksovul qum va tuz ko'chishining oldini oluvchi eng qudratli tabiiy to'siqdir.`,
          contentRu: `# Трагедия Арала

Высыхание Аральского моря создало пустыню Аралкум площадью 5.5 млн га. Посадка саксаула — главный научно обоснованный барьер против пыле-солевых бурь.`,
          contentEn: `# The Aral Sea Disaster

Once the fourth largest lake worldwide, its shrinkage birthed the Aralkum desert. Planting 2M+ hectares of saxaul halophytes forms an indispensable bio-shield against toxic dust storms.`,
        },
      ],
      quiz: {
        titleUz: "Markaziy Osiyo iqlimi bo'yicha sinov",
        titleRu: "Тест: Климат Центральной Азии",
        titleEn: "Central Asia Climate Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "Orol dengizining qurigan tubida tuz va qum bo'ronlariga qarshi qaysi o'simlik ommaviy ekilmoqda?",
            questionRu: "Какое растение высаживают на дне Арала для сдерживания соляных бурь?",
            questionEn: "Which indigenous plant is extensively seeded on the dry Aral seabed to halt dust storms?",
            explanationUz: "Saksovul (Haloxylon) chuqur ildiz tizimi bilan qumni mahkam ushlab, tuz bo'ronlarini to'xtatadi.",
            explanationRu: "Саксаул образует мощную корневую систему и укрепляет засоленные пески.",
            explanationEn: "Saxaul plants develop deep roots that bind sandy-saline soils and suppress toxic storms.",
            answers: [
              { textUz: "Saksovul (Haloxylon)", textRu: "Саксаул (Haloxylon)", textEn: "Saxaul (Haloxylon)", isCorrect: true },
              { textUz: "Bambuk", textRu: "Бамбук", textEn: "Bamboo", isCorrect: false },
              { textUz: "Makkajo'xori", textRu: "Кукуруза", textEn: "Corn", isCorrect: false },
              { textUz: "Qarag'ay", textRu: "Сосна", textEn: "Pine tree", isCorrect: false },
            ],
          },
        ],
      },
    },
    {
      slug: "qayta-tiklanuvchi-energiya",
      titleUz: "Qayta Tiklanuvchi Energiya Tizimlari",
      titleRu: "Возобновляемая энергетика",
      titleEn: "Renewable Energy Systems",
      descUz: "Quyosh fotoelektr stansiyalari, shamol turbinalari, yashil vodorod va energiyani saqlash tizimlari (BESS).",
      descRu: "Солнечные и ветровые электростанции, зеленый водород и накопители энергии.",
      descEn: "Solar photovoltaics, wind farms, green hydrogen, and battery energy storage systems (BESS).",
      level: "O'rta",
      duration: "3 soat",
      category: "Energetika",
      icon: "Zap",
      order: 5,
      lessons: [
        {
          titleUz: "Quyosh va shamol energiyasining imkoniyatlari",
          titleRu: "Потенциал солнечной и ветровой энергии",
          titleEn: "Solar and Wind Energy Potential",
          durationMinutes: 25,
          order: 1,
          contentUz: `# Quyosh energiyasi: O'zbekistonning cheksiz yashil xazinasi

O'zbekistonda yiliga 300 dan ortiq quyoshli kunlar kuzatiladi. Bu mamlakatimizni quyosh fotoelektr stansiyalari (FES) uchun dunyodagi eng qulay hududlardan biriga aylantiradi.

Navoiy, Samarqand, Jizzax, Buxoro va Surxondaryo viloyatlarida ulkan gigavatt quvvatli quyosh va shamol elektr stansiyalari barpo etilmoqda.`,
          contentRu: `# Солнечный потенциал Узбекистана

Более 300 солнечных дней в году обеспечивают Узбекистану уникальное преимущество для развития солнечной генерации.`,
          contentEn: `# Uzbekistan's Solar Advantage

Boasting over 300 sunny days annually, Uzbekistan is deploying gigawatt-scale solar PV and wind farms across Navoi, Samarkand, and Bukhara.`,
        },
      ],
      quiz: {
        titleUz: "Qayta tiklanuvchi energiya sinovi",
        titleRu: "Тест: Возобновляемая энергия",
        titleEn: "Renewable Energy Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "O'zbekistonda yiliga o'rtacha necha kun quyoshli hisoblanadi?",
            questionRu: "Сколько в среднем солнечных дней в году в Узбекистане?",
            questionEn: "On average, how many sunny days does Uzbekistan experience per year?",
            explanationUz: "O'zbekistonda yiliga 300 dan ortiq quyoshli kun bo'lib, quyosh energiyasi uchun ulkan salohiyat mavjud.",
            explanationRu: "В Узбекистане более 300 солнечных дней в году.",
            explanationEn: "Uzbekistan receives more than 300 sunny days each year.",
            answers: [
              { textUz: "300 dan ortiq kun", textRu: "Более 300 дней", textEn: "Over 300 days", isCorrect: true },
              { textUz: "120 kun", textRu: "120 дней", textEn: "120 days", isCorrect: false },
              { textUz: "50 kun", textRu: "50 дней", textEn: "50 days", isCorrect: false },
              { textUz: "Faqat yoz faslida (90 kun)", textRu: "Только летом (90 дней)", textEn: "Only in summer (90 days)", isCorrect: false },
            ],
          },
        ],
      },
    },
    {
      slug: "ekologik-innovatsiyalar",
      titleUz: "Ekologik Innovatsiyalar va Startaplar",
      titleRu: "Эко-инновации и стартапы",
      titleEn: "Eco Innovations and Climate Tech Startups",
      descUz: "Bioplastiklar, chiqindisiz ishlab chiqarish (Zero Waste), aqlli shahar texnologiyalari va yashil arxitektura.",
      descRu: "Биопластики, безотходное производство, умные города и зеленая архитектура.",
      descEn: "Bioplastics, zero-waste manufacturing, smart cities, and biophilic architectural design.",
      level: "Ilg'or",
      duration: "2 soat",
      category: "Innovatsiya",
      icon: "Sparkles",
      order: 6,
      lessons: [
        {
          titleUz: "Climate Tech: Yashil startaplar qanday daromad qiladi?",
          titleRu: "Climate Tech: Как зарабатывают зеленые стартапы",
          titleEn: "Climate Tech Business Models",
          durationMinutes: 20,
          order: 1,
          contentUz: `# Yashil startaplar va Climate Tech

Ekologik loyihalar shunchaki xayriya emas, balki milliardlab dollarlik yangi bozor hisoblanadi:
1. Chiqindilardan qurilish materiallari (ekoplitalar, kompozit yog'och).
2. Qishloq xo'jaligi chiqindilaridan biogaz va organik o'g'itlar.
3. Energiya tejamkor aqlli uy datchiklari va platformalari.`,
          contentRu: `# Climate Tech

Экологические инновации создают многомиллиардные рынки: от переработки биоотходов до умных энергоэффективных систем.`,
          contentEn: `# Climate Tech Revolution

Ecological innovation transforms sustainability into high-growth enterprise ventures, delivering both planet-positive returns and financial viability.`,
        },
      ],
      quiz: {
        titleUz: "Ekologik innovatsiyalar bo'yicha sinov",
        titleRu: "Тест: Эко-инновации",
        titleEn: "Eco Innovations Quiz",
        passingScore: 70,
        questions: [
          {
            order: 1,
            points: 10,
            questionUz: "'Zero Waste' (Chiqindisiz) konsepsiyasining asosiy maqsadi nima?",
            questionRu: "Какова ключевая цель концепции Zero Waste?",
            questionEn: "What is the core target of the Zero Waste philosophy?",
            explanationUz: "Hech qanday chiqindini poligonlarga yoki yoqish zavodlariga yubormasdan to'liq qayta ishlash.",
            explanationRu: "Исключить захоронение и сжигание отходов за счет переработки и повторного использования.",
            explanationEn: "Diverting all waste from landfills and incinerators through reuse and recycling.",
            answers: [
              { textUz: "Chiqindilarni poligonlarga tashlamasdan to'liq aylanmada qayta ishlatish", textRu: "Полный отказ от свалок путем переработки", textEn: "Total diversion of waste from landfills through circularity", isCorrect: true },
              { textUz: "Chiqindini daryoga oqizish", textRu: "Сброс отходов в реки", textEn: "Dumping waste in rivers", isCorrect: false },
              { textUz: "Chiqindini yerga ko'mish", textRu: "Закапывание в землю", textEn: "Burying in soil", isCorrect: false },
              { textUz: "Plastikdan umuman foydalanmasdan faqat yog'och kesish", textRu: "Вырубка деревьев вместо пластика", textEn: "Cutting trees instead of plastics", isCorrect: false },
            ],
          },
        ],
      },
    },
  ];

  for (const c of coursesData) {
    const { lessons, quiz, ...courseFields } = c;
    const course = await prisma.course.create({ data: courseFields });

    for (const l of lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          ...l,
        },
      });

      // Mark first lesson as completed by demo user
      if (c.slug === "ekologiya-asoslari" && l.order === 1) {
        await prisma.userProgress.create({
          data: {
            userId: demoUser.id,
            lessonId: lesson.id,
            completed: true,
          },
        });
      }
    }

    if (quiz) {
      const { questions, ...quizFields } = quiz;
      const createdQuiz = await prisma.quiz.create({
        data: {
          courseId: course.id,
          ...quizFields,
        },
      });

      for (const q of questions) {
        const { answers, ...qFields } = q;
        const createdQ = await prisma.question.create({
          data: {
            quizId: createdQuiz.id,
            ...qFields,
          },
        });

        for (const a of answers) {
          await prisma.answer.create({
            data: {
              questionId: createdQ.id,
              ...a,
            },
          });
        }
      }

      // Add demo quiz result for demo user on first course
      if (c.slug === "ekologiya-asoslari") {
        await prisma.quizResult.create({
          data: {
            userId: demoUser.id,
            quizId: createdQuiz.id,
            score: 100,
            totalQuestions: 3,
            correctAnswers: 3,
            passed: true,
          },
        });
      }
    }
  }

  // 6. Community Ecological Projects
  const sampleProjects = [
    {
      authorName: "Jasur Rahmatov",
      userId: demoUser.id,
      title: "Toshkent shahri uchun aqlli quyoshli avtobus bekatlari",
      description: "Bekat tomlariga o'rnatilgan quyosh panellari orqali avtonom yoritish, telefon quvvatlash va havo sifati monitorlari.",
      problem: "Toshkentda jamoat transporti bekatlarida yozda jazirama issiq, elektr tarmog'iga ulanmagan hududlarda esa qorong'ilik va noqulaylik yuzaga keladi.",
      solution: "Har bir bekatga 2 kVt quyosh panellari, litiy batareyalar, xiralashgan soyabon va PM2.5 havo tozaligi sensorlarini o'rnatish.",
      category: "Quyosh energiyasi",
      imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      status: "APPROVED",
      votes: 142,
    },
    {
      authorName: "Madina Aliyeva",
      userId: studentUser1.id,
      title: "Orol dengizi tubida saksovul ekish dronlari",
      description: "Orolqumning borish qiyin bo'lgan qumli hududlariga urug' qutilarini aniq tashlaydigan ekologik dronlar tizimi.",
      problem: "Qurigan dengiz tubining millionlab gektarlarida qo'lda ko'chat ekish haddan tashqari sekin va xavfli.",
      solution: "Maxsus GPS koordinatalari bo'yicha bio-o'g'itli saksovul urug' kapsulalarini otuvchi qishloq xo'jaligi dronlarini joriy etish.",
      category: "Iqlim va O'rmonlar",
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600&auto=format&fit=crop&q=80",
      status: "APPROVED",
      votes: 218,
    },
    {
      authorName: "Azamat Nurmatov",
      userId: studentUser2.id,
      title: "Samarqand bog'larida tomchilatib sug'orish IoT datchiklari",
      description: "Tuproq chuqurligidagi namlikni o'lchovchi arzon simsiz sensorlar orqali bog'dorchilikda suv sarfini 60% tejash.",
      problem: "An'anaviy ariqdan sug'orishda suvning 50% dan ko'prog'i bug'lanib yoki behuda ketadi.",
      solution: "LoRaWAN orqali ishlovchi datchiklar va mobil ilova orqali avtomatlashtirilgan klapanlar.",
      category: "Suvni tejash",
      imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
      status: "APPROVED",
      votes: 95,
    },
    {
      authorName: "Gulnoza Karimova",
      userId: null,
      title: "Plastik chiqindilardan ekologik yo'lak koshinlari (Ecotiles)",
      description: "Mahalliy nooziq-ovqat plastik chiqindilarini maydalab, qum bilan aralashtirib pishiq va uzoq muddatli yo'l plitalari tayyorlash.",
      problem: "Shahar poligonlariga har kuni o'nlab tonna qayta ishlanmaydigan qattiq plastik tushmoqda.",
      solution: "Polietilen va polipropilen qoldiqlarini 200°C da eritib, press ostida estetik va arzon plitalar ishlab chiqarish.",
      category: "Qayta ishlash",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      status: "APPROVED",
      votes: 110,
    },
  ];

  for (const p of sampleProjects) {
    await prisma.project.create({ data: p });
  }

  // 7. Weekly Eco Challenges
  const challenges = [
    {
      titleUz: "Plastik xaltalardan 7 kun voz kechish",
      titleRu: "7 дней без пластиковых пакетов",
      titleEn: "7-Day Plastic Bag Free Challenge",
      descUz: "Xaridlarga faqat matoli ekoxalta (shoper) bilan boring va bir martalik paketlardan saqlaning.",
      descRu: "Используйте тканевую экосумку (шоппер) при покупках и откажитесь от пакетов.",
      descEn: "Use reusable canvas tote bags for shopping and decline single-use plastics.",
      points: 25,
      category: "waste",
      icon: "ShoppingBag",
      isWeekly: true,
    },
    {
      titleUz: "Dush vaqtini 5 daqiqadan oshirmaslik",
      titleRu: "Быстрый душ до 5 минут",
      titleEn: "5-Minute Shower Challenge",
      descUz: "Kundalik suv sarfini kamaytirish uchun dushda suvni oqizib qo'ymang.",
      descRu: "Сократите время душа до 5 минут для сохранения водных ресурсов.",
      descEn: "Keep daily showers under 5 minutes to conserve critical fresh water.",
      points: 20,
      category: "water",
      icon: "Droplets",
      isWeekly: true,
    },
    {
      titleUz: "Xonani tark etganda chiroqlarni o'chirish",
      titleRu: "Выключайте свет при выходе",
      titleEn: "Switch Off Lights Challenge",
      descUz: "Keraksiz xonalardagi chiroqlar va quvvatlagichlarni tarmoqdan uzing.",
      descRu: "Выключайте освещение и отключайте зарядные устройства из розеток.",
      descEn: "Turn off lights and unplug vampire electronics when leaving rooms.",
      points: 20,
      category: "energy",
      icon: "Zap",
      isWeekly: true,
    },
    {
      titleUz: "Haftada 2 kun jamoat transporti yoki velosiped",
      titleRu: "Общественный транспорт или велосипед",
      titleEn: "Low-Carbon Commute Challenge",
      descUz: "Shaxsiy avtomobil o'rniga metro, avtobus yoki velosipeddan foydalaning.",
      descRu: "Используйте метро, автобус или велосипед вместо личного авто.",
      descEn: "Commute via subway, bus, or bicycle instead of personal vehicle.",
      points: 30,
      category: "transport",
      icon: "Bike",
      isWeekly: true,
    },
  ];

  for (const ch of challenges) {
    const createdCh = await prisma.ecoChallenge.create({ data: ch });
    if (ch.category === "waste" || ch.category === "energy") {
      await prisma.userChallenge.create({
        data: {
          userId: demoUser.id,
          challengeId: createdCh.id,
          completed: true,
        },
      });
    }
  }

  // 8. Demo Eco Calculation for demo user
  await prisma.ecoCalculation.create({
    data: {
      userId: demoUser.id,
      electricityKwh: 220,
      waterM3: 12,
      transportKm: 450,
      transportType: "petrol_car",
      wasteKg: 18,
      co2Kg: 284.5,
      treeOffset: 14,
      savingsUzs: 320000,
      recommendations: "Quyosh suv isitgichidan foydalanish, LED lampalarga to'liq o'tish va haftada 2 kun jamoat transportidan foydalanish tavsiya etiladi.",
    },
  });

  // 9. Demo activity logs
  await prisma.activityLog.create({
    data: {
      userId: demoUser.id,
      action: "COURSE_COMPLETED",
      details: "Ekologiya asoslari kursining 1-darsini yakunladi",
    },
  });
  await prisma.activityLog.create({
    data: {
      userId: demoUser.id,
      action: "QUIZ_PASSED",
      details: "Ekologiya asoslari testidan 100% ball oldi",
    },
  });
  await prisma.activityLog.create({
    data: {
      userId: demoUser.id,
      action: "PROJECT_CREATED",
      details: "Yangi loyiha qo'shildi: Toshkent shahri uchun aqlli quyoshli avtobus bekatlari",
    },
  });

  console.log("Database seeded successfully with rich multilingual data!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
