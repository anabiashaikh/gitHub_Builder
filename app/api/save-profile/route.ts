import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      title,
      bio,
      location,
      portfolioUrl,
      githubUsername,
      techStack,
      avatarUrl,
      templateId,
    } = body;

    if (!name || !title || !bio) {
      return NextResponse.json(
        { error: "Name, title, and bio are required fields." },
        { status: 400 }
      );
    }

    const techStackJson = JSON.stringify(
      Array.isArray(techStack) ? techStack : []
    );

    // Save profile record into Prisma database
    const savedProfile = await prisma.profile.create({
      data: {
        name,
        title,
        bio,
        location: location || "",
        portfolioUrl: portfolioUrl || "",
        githubUsername: githubUsername || "",
        techStack: techStackJson,
        compositeImageUrl: avatarUrl || "",
        templateId: templateId || "default",
      },
    });

    const totalCount = await prisma.profile.count();

    return NextResponse.json({
      success: true,
      message: "Profile successfully saved to database!",
      profile: {
        ...savedProfile,
        techStack: JSON.parse(savedProfile.techStack),
      },
      savedProfilesCount: totalCount,
    });

  } catch (error: any) {
    console.error("Error saving profile to Prisma DB:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save profile database record." },
      { status: 500 }
    );
  }
}
