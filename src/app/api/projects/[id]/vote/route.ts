import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });

    return NextResponse.json({ success: true, votes: project.votes });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Ovoz berishda xatolik" }, { status: 500 });
  }
}
