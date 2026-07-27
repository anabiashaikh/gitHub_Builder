import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  let prompt = "";
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt || "";
    const existingExpertise = Array.isArray(body.existingExpertise) ? body.existingExpertise : undefined;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt description is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey !== "your-gemini-api-key-here" && prompt) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are an elite, highly detailed developer profile generator. Your job is to read the user's prompt and generate an exhaustive, highly professional profile.

RULES FOR DYNAMIC GENERATION:
1. TITLE: Combine ALL exact roles/professions mentioned by the user.
2. BIO / ABOUT ME: Generate a DETAILED, EXHAUSTIVE, PROFESSIONAL 2-PARAGRAPH biography (at least 12 to 16 lines of text in total).
3. EXPERTISE: ${
          existingExpertise && existingExpertise.length > 0
            ? `For EACH of these user-provided expertise areas: ${JSON.stringify(existingExpertise)}, generate a detailed 3-4 line paragraph description in the format: "Tag Name — Detailed paragraph description".`
            : 'Generate 3 to 4 detailed domain expertise items in the format "Tag Name — Detailed paragraph description".'
        }
4. TECH STACK: Extract ALL technologies, languages, databases, tools, and methodologies mentioned.

Return strictly raw JSON format without markdown fences:
{
  "name": "Extracted name if present in prompt, else null",
  "title": "Exact dynamic professional title",
  "bio": "Extensive 2-paragraph detailed biography (12-16 lines)",
  "expertise": ["Array of detailed paragraph expertise items"],
  "techStack": ["Array of extracted skills"]
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
            expertise: Array.isArray(jsonResult.expertise) && jsonResult.expertise.length > 0
              ? jsonResult.expertise
              : extractExpertiseDynamic(prompt, existingExpertise),
            techStack: Array.isArray(jsonResult.techStack) && jsonResult.techStack.length > 0
              ? jsonResult.techStack
              : extractSkillsDynamic(prompt),
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API error, running dynamic prompt parser:", geminiError?.message || geminiError);
      }
    }

    return NextResponse.json(generateDynamicProfile(prompt, existingExpertise));
  } catch (error: any) {
    console.error("Critical error in /api/generate-profile:", error);
    return NextResponse.json(generateDynamicProfile("Full-Stack Software Engineer"));
  }
}

function extractNameDynamic(prompt: string): string | undefined {
  const nameMatch = prompt.match(/(?:i am|my name is|im|name:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  return nameMatch ? nameMatch[1] : undefined;
}

function extractTitleDynamic(prompt: string): string {
  const roles: string[] = [];
  const lower = prompt.toLowerCase();

  if (lower.includes("full-stack") || lower.includes("full stack")) roles.push("Full-Stack Software Engineer");
  else if (lower.includes("frontend")) roles.push("Frontend Engineer");
  else if (lower.includes("backend")) roles.push("Backend Engineer");
  else if (lower.includes("software engineer") || lower.includes("developer")) roles.push("Software Engineer");

  if (lower.includes("researcher") || lower.includes("academic") || lower.includes("statistical")) {
    roles.push("Academic Researcher");
  }

  if (lower.includes("ai") || lower.includes("data scientist") || lower.includes("machine learning")) {
    if (!roles.some((r) => r.includes("AI"))) roles.push("AI Integrator");
  }

  return roles.length > 0 ? roles.join(" & ") : "Full-Stack Software Engineer & Academic Researcher";
}

function generateBioDynamic(prompt: string): string {
  const paragraph1 = `I build machine learning and software systems that survive contact with production traffic. Most of my work sits between research and infrastructure: fine-tuning transformers with LoRA and QLoRA, training gradient-boosted models on messy tabular data, and then doing the unglamorous part — quantizing checkpoints, batching requests, wiring feature pipelines, and making sure the thing that scored well in a notebook still scores well at 2 a.m. under load. Lately most of my time goes to LLM applications: retrieval pipelines, evaluation harnesses, distillation, and inference cost work, because that is where the gap between a demo and a dependable product is currently widest.`;

  const paragraph2 = `I care more about measurement than about model choice. Before I train anything I want a held-out evaluation set that reflects real user inputs and a baseline dumb enough to be embarrassing — half the time the baseline wins, and that saves months. I treat data quality, labeling guidelines, and error analysis as first-class engineering work rather than preprocessing, and I would rather ship a smaller model I can monitor, roll back, and explain than a larger one nobody can debug. Reproducibility is non-negotiable: pinned seeds, versioned datasets, tracked experiments, and a training run anyone on the team can reproduce from a single command.`;

  return `${paragraph1}\n\n${paragraph2}`;
}

function extractSkillsDynamic(prompt: string): string[] {
  const skills: string[] = [];

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

function extractExpertiseDynamic(prompt: string, existingExpertise?: string[]): string[] {
  if (existingExpertise && existingExpertise.length > 0) {
    return existingExpertise.map((item) => {
      const tag = item.includes("—") ? item.split("—")[0].trim() : item;
      return `${tag} — Comprehensive engineering expertise focused on architecting, testing, and shipping robust ${tag.toLowerCase()} systems in production environments with high reliability, automated benchmarks, and zero downtime.`;
    });
  }

  return [
    "Model Development & Fine-Tuning — I train and adapt deep learning and gradient-boosted models on complex tabular and unstructured data. Most of my work sits between research and infrastructure: fine-tuning transformers with LoRA and QLoRA, quantizing checkpoints, batching requests, wiring feature pipelines, and making sure models score reliably under 2 a.m. production load.",
    "LLM & Retrieval Applications — Building end-to-end retrieval pipelines, evaluation harnesses, model distillation, and inference cost optimization. I treat data quality, labeling guidelines, and error analysis as first-class engineering work to bridge the gap between a demo and a dependable production product.",
    "Full-Stack & Cloud Architecture — Architecting zero-latency microservices, responsive web applications, and resilient database schemas designed for high throughput, automated testing, and reproducible single-command deployment pipelines."
  ];
}

function generateDynamicProfile(prompt: string, existingExpertise?: string[]) {
  return {
    name: extractNameDynamic(prompt),
    title: extractTitleDynamic(prompt),
    bio: generateBioDynamic(prompt),
    expertise: extractExpertiseDynamic(prompt, existingExpertise),
    techStack: extractSkillsDynamic(prompt),
  };
}
