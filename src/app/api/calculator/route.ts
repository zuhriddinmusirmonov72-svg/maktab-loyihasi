import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { calculateEcoImpact } from "@/lib/eco-calculator";
import prisma from "@/lib/prisma";

const CalculatorSchema = z.object({
  electricityKwh: z.number().min(0).max(100000),
  waterM3: z.number().min(0).max(10000),
  transportKm: z.number().min(0).max(100000),
  transportType: z.enum([
    "petrol_car",
    "diesel_car",
    "hybrid",
    "ev",
    "bus",
    "metro",
    "bicycle",
  ]),
  wasteKg: z.number().min(0).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CalculatorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Kiritilgan ma'lumotlar noto'g'ri" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const result = calculateEcoImpact(input);

    const session = await getSession();

    if (session) {
      await prisma.ecoCalculation.create({
        data: {
          userId: session.id,
          electricityKwh: input.electricityKwh,
          waterM3: input.waterM3,
          transportKm: input.transportKm,
          transportType: input.transportType,
          wasteKg: input.wasteKg,
          co2Kg: result.totalCo2Kg,
          treeOffset: result.treeOffsetNeeded,
          savingsUzs: result.potentialSavingsUzs,
          recommendations: JSON.stringify(result.recommendations),
        },
      });

      // Update user eco score & award 15 XP
      await prisma.user.update({
        where: { id: session.id },
        data: {
          ecoScore: result.ecoScore,
          xp: { increment: 15 },
        },
      });

      await prisma.activityLog.create({
        data: {
          userId: session.id,
          action: "CALCULATION_DONE",
          details: `Uglerod izi hisoblandi: ${result.totalCo2Kg} kg CO₂/oy`,
        },
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Calculator API error:", error);
    return NextResponse.json(
      { error: "Hisoblashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
