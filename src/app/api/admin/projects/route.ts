import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const { projectId, status } = await req.json();

    if (!projectId || !status) {
      return NextResponse.json({ error: "Ma'lumotlar to'liq emas" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch {
    return NextResponse.json({ error: "Xatolik" }, { status: 403 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Loyiha ID talab qilinadi" }, { status: 400 });
    }

    await prisma.project.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "O'chirishda xatolik" }, { status: 403 });
  }
}
