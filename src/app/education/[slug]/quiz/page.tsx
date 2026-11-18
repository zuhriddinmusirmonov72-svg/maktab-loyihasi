import React from "react";
import prisma from "@/lib/prisma";
import { QuizClient } from "./QuizClient";

const FALLBACK_QUIZZES: Record<string, any> = {
  "ekologiya-asoslari": {
    id: "q1",
    titleUz: "Ekologiya asoslari bo'yicha yakuniy sinov",
    passingScore: 70,
    questions: [
      {
        id: "q1_1",
        order: 1,
        points: 10,
        questionUz: "Biosfera ta'limotiga eng katta ilmiy hissa qo'shgan olim kim?",
        explanationUz: "Eduard Zyuss atamani fanga kiritgan bo'lsa-da, biosferaning yaxlit ilmiy ta'limotini Vladimir Vernadskiy yaratgan.",
        answers: [
          { id: "a1", textUz: "Vladimir Vernadskiy", isCorrect: true },
          { id: "a2", textUz: "Charlz Darvin", isCorrect: false },
          { id: "a3", textUz: "Dmitriy Mendeleyev", isCorrect: false },
          { id: "a4", textUz: "Albert Eynshteyn", isCorrect: false },
        ],
      },
      {
        id: "q1_2",
        order: 2,
        points: 10,
        questionUz: "Barqaror chiqindilarni boshqarishdagi 3R tamoyili nimani anglatadi?",
        explanationUz: "3R: Reduce (Kamaytirish), Reuse (Qayta ishlatish), Recycle (Qayta ishlash).",
        answers: [
          { id: "a5", textUz: "Reduce, Reuse, Recycle", isCorrect: true },
          { id: "a6", textUz: "Read, Run, Rest", isCorrect: false },
          { id: "a7", textUz: "Remove, Reset, Repeat", isCorrect: false },
          { id: "a8", textUz: "Rebuild, Rent, Recover", isCorrect: false },
        ],
      },
    ],
  },
  "yashil-iqtisodiyot": {
    id: "q2",
    titleUz: "Yashil iqtisodiyot va ESG bilimlari sinovi",
    passingScore: 70,
    questions: [
      {
        id: "q2_1",
        order: 1,
        points: 10,
        questionUz: "Sirkulyar iqtisodiyotning chiziqli iqtisodiyotdan tub farqi nimada?",
        explanationUz: "Sirkulyar model materiallarni doimiy aylanmada saqlab, chiqindini dizayn bosqichida bartaraf etadi.",
        answers: [
          { id: "a9", textUz: "Chiqindilarni nollashtirib, materiallarni aylanma siklda saqlash", isCorrect: true },
          { id: "a10", textUz: "Faqat plastik idishlarni ko'mish", isCorrect: false },
          { id: "a11", textUz: "Qazilma yoqilg'i qazib olishni ko'paytirish", isCorrect: false },
          { id: "a12", textUz: "Mahsulot narxini 2 barobar oshirish", isCorrect: false },
        ],
      },
    ],
  },
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let quiz = null;
  let courseTitle = "Ekologik Ta'lim";

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        quizzes: {
          include: {
            questions: {
              orderBy: { order: "asc" },
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    if (course && course.quizzes && course.quizzes.length > 0) {
      quiz = course.quizzes[0];
      courseTitle = course.titleUz;
    }
  } catch (err) {
    console.warn("Quiz DB fetch error, using fallback:", err);
  }

  if (!quiz) {
    quiz = FALLBACK_QUIZZES[slug] || FALLBACK_QUIZZES["ekologiya-asoslari"];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <QuizClient courseSlug={slug} courseTitle={courseTitle} quiz={quiz} />
    </div>
  );
}
