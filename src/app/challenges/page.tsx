import React from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ChallengesClient } from "./ChallengesClient";


export default async function ChallengesPage() {
  const session = await getSession();

  const challenges = await prisma.ecoChallenge.findMany({
    orderBy: { points: "desc" },
  });

  let completedMap: Record<string, boolean> = {};
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
