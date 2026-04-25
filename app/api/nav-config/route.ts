import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const route = searchParams.get("route") || "/";
  const session = await getServerSession(authOptions);
  const role = (session?.user?.role as "ADMIN" | "USER") || "USER";

  const config = await prisma.navConfig.findUnique({
    where: { route_role: { route, role } },
  });

  if (!config) return NextResponse.json(null);
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { route, role, navLinks, buttons, showAddButton } = body;

  const config = await prisma.navConfig.upsert({
    where: { route_role: { route, role } },
    update: { navLinks, buttons, showAddButton },
    create: { route, role, navLinks, buttons, showAddButton },
  });

  return NextResponse.json(config);
}