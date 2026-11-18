import React from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ChallengesClient } from "./ChallengesClient";

const FALLBACK_CHALLENGES = [
  {
    id: "ch1",
    titleUz: "Plastik xaltalardan 7 kun voz kechish",
    descUz: "Xaridlarga faqat matoli ekoxalta (shoper) bilan boring va bir martalik paketlardan saqlaning.",
    points: 25,
    category: "waste",
    icon: "ShoppingBag",
  },
  {
    id: "ch2",
    titleUz: "Dush vaqtini 5 daqiqadan oshirmaslik",
    descUz: "Kundalik suv sarfini kamaytirish uchun dushda suvni oqizib qo'ymang.",
    points: 20,
    category: "water",
    icon: "Droplets",
  },
  {
    id: "ch3",
    titleUz: "Xonani tark etganda chiroqlarni o'chirish",
    descUz: "Keraksiz xonalardagi chiroqlar va quvvatlagichlarni tarmoqdan uzing.",
    points: 20,
    category: "energy",
    icon: "Zap",
  },
  {
    id: "ch4",
    titleUz: "Haftada 2 kun jamoat transporti yoki velosiped",
    descUz: "Shaxsiy avtomobil o'rniga metro, avtobus yoki velosipeddan foydalaning.",
    points: 30,
    category: "transport",
    icon: "Bike",
  },
];

export default async function ChallengesPage() {
  let session = null;
  try {
    session = await getSession();
  } catch {}

  let challenges = FALLBACK_CHALLENGES;
  let completedMap: Record<string, boolean> = {
    ch1: true,
    ch3: true,
  };

  try {
    const dbChallenges = await prisma.ecoChallenge.findMany({
      orderBy: { points: "desc" },
    });
    if (dbChallenges && dbChallenges.length > 0) {
      challenges = dbChallenges;
    }

    if (session) {
      const userChallenges = await prisma.userChallenge.findMany({
        where: {
          userId: session.id,
          completed: true,
        },
      });
      userChallenges.forEach((uc) => {
        completedMap[uc.challengeId] = true;
      });
    }
  } catch (err) {
    console.warn("DB lookup error in challenges, using fallback:", err);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <ChallengesClient
        initialChallenges={challenges}
        initialCompleted={completedMap}
        isAuthenticated={Boolean(session)}
      />
    </div>
  );
}
