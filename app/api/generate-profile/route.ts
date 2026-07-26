import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = body.prompt || "";

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt description is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your-gemini-api-key-here") {
      return NextResponse.json(generateMockProfile(prompt));
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an expert technical profile writer and career strategist for developers, researchers, and engineers.
Analyze the user's prompt carefully and extract ALL relevant details, roles, dual specializations, and specific technical/research skills.

CRITICAL INSTRUCTIONS:
1. TITLE: Accurately capture their role(s) mentioned in the prompt. If they mention dual roles (e.g. "Full-Stack Software Engineer & Academic Researcher"), include BOTH roles in the title (e.g. "Full-Stack Engineer & Academic Researcher"). Max 8 words.
2. BIO: Write a compelling 3-sentence biography that explicitly highlights ALL key aspects mentioned in the prompt (e.g. engineering expertise, research/data modeling, current projects, open-source goals, AI integration).
3. TECH STACK: Return an array of 5 to 10 specific skills, tools, and methodologies explicitly mentioned or strongly implied in the prompt (e.g. "JavaScript", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM", "Gemini AI API", "Statistical Analysis", "Regression Modeling", "Data Visualization", "Survey Design").

Strict JSON format to return:
{
  "name": "Extracted name if provided in prompt, else null",
  "title": "Exact professional title capturing all user roles",
  "bio": "Comprehensive 3-sentence biography highlighting engineering, research, and project goals",
  "techStack": ["Array of skills, technologies, and methodologies"]
}

Do not use markdown code blocks like \`\`\`json. Return raw JSON text only.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim() || "";

      if (responseText) {
        const cleanedText = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```$/i, "")
          .trim();

        const jsonResult = JSON.parse(cleanedText);

        return NextResponse.json({
          name: jsonResult.name || undefined,
          title: jsonResult.title || extractTitleFromPrompt(prompt),
          bio: jsonResult.bio || generateBioFromPrompt(prompt),
          techStack: Array.isArray(jsonResult.techStack) && jsonResult.techStack.length > 0
            ? jsonResult.techStack
            : extractTechFromText(prompt),
        });
      }
    } catch (geminiError: any) {
      console.warn("Gemini API error, using smart fallback:", geminiError?.message || geminiError);
      return NextResponse.json(generateMockProfile(prompt));
    }

    return NextResponse.json(generateMockProfile(prompt));

  } catch (error: any) {
    console.error("Critical error in /api/generate-profile:", error);
    return NextResponse.json(generateMockProfile(prompt || "Full-Stack Software Engineer & Researcher"));
  }
}

function extractTitleFromPrompt(prompt: string): string {
  const p = prompt.toLowerCase();
  const hasEngineer = p.includes("engineer") || p.includes("developer") || p.includes("full-stack") || p.includes("fullstack");
  const hasResearcher = p.includes("researcher") || p.includes("research") || p.includes("academic");
  const hasAI = p.includes("ai") || p.includes("ml") || p.includes("data");

  if (hasEngineer && hasResearcher) {
    return "Full-Stack Engineer & Academic Researcher";
  }
  if (hasResearcher && hasAI) {
    return "Academic Researcher & AI Data Scientist";
  }
  if (hasEngineer && hasAI) {
    return "Full-Stack AI Software Engineer";
  }
  if (hasResearcher) {
    return "Academic Data Researcher";
  }
  return "Full-Stack Software Engineer";
}

function generateBioFromPrompt(prompt: string): string {
  const title = extractTitleFromPrompt(prompt);
  return `${title} passionate about building high-performance web applications and conducting data-driven research. Specializing in full-stack architecture, statistical modeling, and AI API integrations. Currently developing innovative open-source developer tools and interactive data visualization systems.`;
}

function extractTechFromText(prompt: string): string[] {
  const p = prompt.toLowerCase();
  const knownTech = [
    { key: "javascript", label: "JavaScript" },
    { key: "node.js", label: "Node.js" },
    { key: "node", label: "Node.js" },
    { key: "next.js", label: "Next.js" },
    { key: "nextjs", label: "Next.js" },
    { key: "postgresql", label: "PostgreSQL" },
    { key: "postgres", label: "PostgreSQL" },
    { key: "prisma", label: "Prisma ORM" },
    { key: "gemini", label: "Gemini AI API" },
    { key: "ai api", label: "AI API Integration" },
    { key: "statistical", label: "Statistical Analysis" },
    { key: "survey", label: "Survey Design" },
    { key: "regression", label: "Regression Modeling" },
    { key: "data visualization", label: "Data Visualization" },
    { key: "visualization", label: "Data Visualization" },
    { key: "typescript", label: "TypeScript" },
    { key: "react", label: "React" },
    { key: "python", label: "Python" },
    { key: "docker", label: "Docker" },
    { key: "tailwind", label: "TailwindCSS" },
  ];

  const extracted: string[] = [];
  for (const t of knownTech) {
    if (p.includes(t.key) && !extracted.includes(t.label)) {
      extracted.push(t.label);
    }
  }

  return extracted.length > 0
    ? extracted
    : ["JavaScript", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM", "Statistical Analysis"];
}

function generateMockProfile(prompt: string) {
  let extractedName: string | undefined = undefined;
  const nameMatch = prompt.match(/(?:i am|my name is|im)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    extractedName = nameMatch[1];
  }

  const title = extractTitleFromPrompt(prompt);
  const bio = generateBioFromPrompt(prompt);
  const techStack = extractTechFromText(prompt);

  return {
    name: extractedName,
    title,
    bio,
    techStack,
  };
}
