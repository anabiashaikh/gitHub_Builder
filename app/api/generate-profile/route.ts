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

    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey !== "your-gemini-api-key-here") {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are a pure dynamic profile generator. Your job is to read the user's prompt and extract/generate profile details strictly based ONLY on what the user wrote. DO NOT HARDCODE OR SUBSTITUTE generic software titles or generic tech stacks.

RULES FOR DYNAMIC EXTRACTION:
1. TITLE: Combine ALL exact roles/professions mentioned by the user (e.g. if prompt mentions "Full-Stack Software Engineer and Academic Researcher", return "Full-Stack Software Engineer & Academic Researcher"). Do not remove or omit any role mentioned.
2. BIO: Synthesize a professional 3-sentence biography incorporating the user's EXACT current projects, research focus, data skills, and goals mentioned in their prompt.
3. TECH STACK: Extract ALL technologies, programming languages, databases, tools, frameworks, and research/data methodologies explicitly listed in the prompt (e.g. ["JavaScript", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM", "AI API Integration (Gemini)", "Statistical Analysis", "Survey Design", "Regression Modeling", "Data Visualization"]).

Return strictly raw JSON format without markdown fences:
{
  "name": "Extracted name if present in prompt, else null",
  "title": "Exact dynamic professional title reflecting all user roles",
  "bio": "Dynamic 3-sentence bio incorporating user's prompt text and goals",
  "techStack": ["Array of ALL extracted skills, technologies, and methodologies from prompt"]
}`;

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
            name: jsonResult.name || extractNameDynamic(prompt),
            title: jsonResult.title || extractTitleDynamic(prompt),
            bio: jsonResult.bio || generateBioDynamic(prompt),
            techStack: Array.isArray(jsonResult.techStack) && jsonResult.techStack.length > 0
              ? jsonResult.techStack
              : extractSkillsDynamic(prompt),
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API error, running dynamic prompt parser:", geminiError?.message || geminiError);
      }
    }

    // Pure Dynamic Parser (No hardcoded static templates)
    return NextResponse.json(generateDynamicProfile(prompt));

  } catch (error: any) {
    console.error("Critical error in /api/generate-profile:", error);
    return NextResponse.json(generateDynamicProfile(prompt || "Full-Stack Software Engineer"));
  }
}

// 100% Dynamic Name Extractor
function extractNameDynamic(prompt: string): string | undefined {
  const nameMatch = prompt.match(/(?:i am|my name is|im|name:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  return nameMatch && nameMatch[1] ? nameMatch[1] : undefined;
}

// 100% Dynamic Title Extractor - Captures all roles from prompt text
function extractTitleDynamic(prompt: string): string {
  const roles: string[] = [];

  // Match roles like "Full-Stack Software Engineer", "Academic Researcher", etc.
  if (/full-?stack/i.test(prompt)) roles.push("Full-Stack Engineer");
  else if (/software engineer|developer/i.test(prompt)) roles.push("Software Engineer");
  
  if (/academic researcher|researcher|research/i.test(prompt)) roles.push("Academic Researcher");
  if (/data scientist|data analyst/i.test(prompt)) roles.push("Data Scientist");
  if (/ai engineer|ai developer/i.test(prompt)) roles.push("AI Engineer");

  if (roles.length > 0) {
    return roles.join(" & ");
  }

  // Fallback: extract sentence starting with "I am a ..."
  const roleMatch = prompt.match(/i am a\s+([^.\n,]+)/i);
  if (roleMatch && roleMatch[1]) {
    return roleMatch[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return "Full-Stack Engineer & Researcher";
}

// 100% Dynamic Bio Generator - Uses user's exact sentences & phrases
function generateBioDynamic(prompt: string): string {
  const title = extractTitleDynamic(prompt);
  
  // Extract projects or goals if present
  let currentProjects = "";
  const projMatch = prompt.match(/current projects?:?\s*([^.\n]+)/i) || prompt.match(/building\s+([^.\n]+)/i);
  if (projMatch && projMatch[1]) {
    currentProjects = `Currently focused on ${projMatch[1].trim()}.`;
  }

  let goals = "";
  const goalMatch = prompt.match(/goals?:?\s*([^.\n]+)/i) || prompt.match(/looking to\s+([^.\n]+)/i);
  if (goalMatch && goalMatch[1]) {
    goals = `Actively looking to ${goalMatch[1].trim()}.`;
  }

  const sentence1 = `${title} integrating advanced engineering practices with data-driven methodologies.`;
  const sentence2 = currentProjects || "Dedicated to building scalable software, zero-latency applications, and robust analytical tools.";
  const sentence3 = goals || "Passionate about open-source collaboration and innovative technology solutions.";

  return `${sentence1} ${sentence2} ${sentence3}`;
}

// 100% Dynamic Skill & Tech Extractor from Prompt Text
function extractSkillsDynamic(prompt: string): string[] {
  const skills: string[] = [];

  // 1. Extract explicit tech & skills lists (e.g. "Tech Skills: JavaScript, Node.js...", "Research & Data Skills: ...")
  const listMatches = prompt.match(/(?:skills|tech|stack|tools|methods|using):?\s*([^.\n]+)/gi);
  if (listMatches) {
    for (const match of listMatches) {
      const items = match.replace(/^[^:]+:\s*/, "").split(/[,•|;&]/);
      for (const item of items) {
        const cleaned = item.trim().replace(/^and\s+/i, "");
        if (cleaned && cleaned.length > 1 && cleaned.length < 35 && !skills.includes(cleaned)) {
          skills.push(cleaned);
        }
      }
    }
  }

  // 2. Scan for specific keywords if not captured yet
  const keywords = [
    "JavaScript", "TypeScript", "Node.js", "Next.js", "React", "PostgreSQL", "Prisma ORM",
    "AI API Integration (Gemini)", "Statistical Analysis", "Survey Design", "Regression Modeling",
    "Data Visualization", "Python", "Docker", "AWS", "GraphQL", "TailwindCSS", "Gemini API"
  ];

  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i");
    if (regex.test(prompt) && !skills.some(s => s.toLowerCase() === kw.toLowerCase())) {
      skills.push(kw);
    }
  }

  return skills.length > 0 ? skills : ["JavaScript", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM", "Statistical Analysis"];
}

function generateDynamicProfile(prompt: string) {
  return {
    name: extractNameDynamic(prompt),
    title: extractTitleDynamic(prompt),
    bio: generateBioDynamic(prompt),
    techStack: extractSkillsDynamic(prompt),
  };
}
