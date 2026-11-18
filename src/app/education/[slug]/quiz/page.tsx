import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuizClient } from "./QuizClient";


export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

  if (!course || course.quizzes.length === 0) {
    notFound();
  }

  const quiz = course.quizzes[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <QuizClient courseSlug={slug} courseTitle={course.titleUz} quiz={quiz} />
    </div>
  );
}
