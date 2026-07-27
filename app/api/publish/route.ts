import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in with GitHub first." },
        { status: 401 }
      );
    }

    const { markdownContent } = await req.json();

    if (!markdownContent || typeof markdownContent !== "string") {
      return NextResponse.json(
        { error: "Markdown content is required." },
        { status: 400 }
      );
    }

    const accessToken = session.accessToken;
    const username = session.user?.username || session.user?.name;

    if (!username) {
      return NextResponse.json(
        { error: "Unable to retrieve GitHub username from session." },
        { status: 400 }
      );
    }

    const repoUrl = `https://api.github.com/repos/${username}/${username}/contents/README.md`;

    // Step A: Check if README.md file already exists to get its SHA hash
    let sha: string | undefined = undefined;

    try {
      const getFileRes = await fetch(repoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DevProfile-Architect-App",
        },
      });

      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }
    } catch (checkErr) {
      console.warn("README.md check error (file might not exist yet):", checkErr);
    }

    // Step B: Create or Update README.md on GitHub
    const base64Content = Buffer.from(markdownContent).toString("base64");

    const putBody: any = {
      message: "Update README.md via DevProfile Architect",
      content: base64Content,
    };

    if (sha) {
      putBody.sha = sha;
    }

    const updateRes = await fetch(repoUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "DevProfile-Architect-App",
      },
      body: JSON.stringify(putBody),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      console.error("GitHub API error:", updateData);
      return NextResponse.json(
        {
          error: updateData.message || "Failed to push README to GitHub.",
          details: updateData,
        },
        { status: updateRes.status }
      );
    }

    const liveProfileUrl = `https://github.com/${username}`;

    return NextResponse.json({
      success: true,
      message: "README.md successfully published to GitHub!",
      url: liveProfileUrl,
      repo: `${username}/${username}`,
    });

  } catch (error: any) {
    console.error("Critical error in /api/publish:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
