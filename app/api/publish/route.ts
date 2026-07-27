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

    // Step 1: Fetch exact authenticated user login handle directly from GitHub API
    let username = session.user?.username;

    try {
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DevProfile-Architect-App",
        },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.login) {
          username = userData.login;
        }
      }
    } catch (userErr) {
      console.warn("Failed to fetch user login from GitHub API:", userErr);
    }

    if (!username) {
      return NextResponse.json(
        { error: "Unable to retrieve valid GitHub username. Please sign in again." },
        { status: 400 }
      );
    }

    const repoUrl = `https://api.github.com/repos/${username}/${username}/contents/README.md`;

    // Step 2: Check if README.md file already exists to get its SHA hash
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
      console.warn("README.md check error:", checkErr);
    }

    // Step 3: Put/Update README.md on GitHub
    const base64Content = Buffer.from(markdownContent).toString("base64");

    let putBody: any = {
      message: "Update README.md via DevProfile Architect",
      content: base64Content,
    };

    if (sha) {
      putBody.sha = sha;
    }

    let updateRes = await fetch(repoUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "DevProfile-Architect-App",
      },
      body: JSON.stringify(putBody),
    });

    let updateData = await updateRes.json();

    // Step 4: Handle 404 (If repo username/username does not exist on GitHub yet)
    if (updateRes.status === 404) {
      console.log(`Repository ${username}/${username} not found. Attempting automatic creation...`);

      try {
        const createRepoRes = await fetch("https://api.github.com/user/repos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "DevProfile-Architect-App",
          },
          body: JSON.stringify({
            name: username,
            description: "Special repository for my GitHub Profile README",
            auto_init: true,
            private: false,
          }),
        });

        if (createRepoRes.ok || createRepoRes.status === 422) {
          // Wait 1.5 seconds for GitHub to initialize repo
          await new Promise((r) => setTimeout(r, 1500));

          // Retry PUT README.md
          updateRes = await fetch(repoUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
              "User-Agent": "DevProfile-Architect-App",
            },
            body: JSON.stringify({
              message: "Initial README.md via DevProfile Architect",
              content: base64Content,
            }),
          });

          updateData = await updateRes.json();
        }
      } catch (createErr) {
        console.error("Auto repo creation error:", createErr);
      }
    }

    if (!updateRes.ok) {
      console.error("GitHub API error:", updateData);
      return NextResponse.json(
        {
          error:
            updateData.message === "Not Found"
              ? `Special repository '${username}/${username}' was not found. Please create repository '${username}/${username}' on GitHub first or grant repo write permissions.`
              : updateData.message || "Failed to push README to GitHub.",
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
