import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ProjectCreateSchema = z.object({
  title: z.string().min(5, "Loyiha nomi kamida 5 belgidan iborat bo'lishi kerak"),
  description: z.string().min(10, "Tavsif kamida 10 belgidan iborat bo'lishi kerak"),
  problem: z.string().min(10, "Muammo tavsifi kamida 10 belgi bo'lishi kerak"),
  solution: z.string().min(10, "Yechim kamida 10 belgi bo'lishi kerak"),
  category: z.string().min(2),
  imageUrl: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const where: {
      status: string;
      category?: string;
      OR?: Array<{ title?: { contains: string }; description?: { contains: string } }>;
    } = {
      status: "APPROVED",
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (query && query.trim() !== "") {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { votes: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Loyihalarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Loyiha qo'shish uchun tizimga kirish kerak" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = ProjectCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { title, description, problem, solution, category, imageUrl } = parsed.data;

    const defaultImage =
      imageUrl && imageUrl.trim() !== ""
        ? imageUrl
        : "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80";

    const project = await prisma.project.create({
      data: {
        userId: session.id,
        authorName: session.name,
        title,
        description,
        problem,
        solution,
        category,
        imageUrl: defaultImage,
        status: "APPROVED", // Auto-approved for rapid competition review & interactive testing
        votes: 1,
      },
    });

    // Award 50 XP
    await prisma.user.update({
      where: { id: session.id },
      data: { xp: { increment: 50 } },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "PROJECT_CREATED",
        details: `Yangi loyiha e'lon qilindi: ${title}`,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Loyiha saqlashda xatolik" }, { status: 500 });
  }
}
