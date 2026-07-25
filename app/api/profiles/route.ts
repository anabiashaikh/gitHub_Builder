import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formattedProfiles = profiles.map((p) => ({
      ...p,
      techStack: JSON.parse(p.techStack || "[]"),
    }));

    return NextResponse.json({ profiles: formattedProfiles });
  } catch (error: any) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ profiles: [] });
  }
}
