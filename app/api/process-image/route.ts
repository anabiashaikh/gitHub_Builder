import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file uploaded." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Process user avatar with Sharp: resize to high quality 400x400 square png
    const processedAvatar = await sharp(buffer)
      .resize(400, 400, { fit: "cover", position: "center" })
      .png()
      .toBuffer();

    // Convert to clean base64 Data URL
    const avatarDataUrl = `data:image/png;base64,${processedAvatar.toString("base64")}`;

    return NextResponse.json({
      avatarUrl: avatarDataUrl,
      success: true,
    });

  } catch (error: any) {
    console.error("Error processing avatar image with Sharp:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image." },
      { status: 500 }
    );
  }
}
