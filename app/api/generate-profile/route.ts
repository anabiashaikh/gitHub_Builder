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

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(generateMockProfile(prompt));
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an elite executive technical copywriter specializing in GitHub README bios and developer resumes for Silicon Valley Principal Engineers and CTOs.
Given the user's input description, craft an ultra-professional, 3-sentence technical biography.

Bio Structure Guidelines:
- Sentence 1: Core specialization, engineering experience, and technical domain (e.g., "Senior Software Engineer specializing in resilient cloud-native microservices and high-throughput web architectures.").
- Sentence 2: Engineering achievements, performance optimization, and architectural philosophy (e.g., "Passionate about modular design systems, zero-downtime deployments, and optimizing end-to-end system latency.").
- Sentence 3: Current technical focus, technology leadership, or open-source commitment (e.g., "Currently architecting scalable distributed systems and contributing to open-source developer tooling.").

Tone: Executive, authoritative, precise, and highly professional. Avoid generic greetings, conversational filler, or informal language.

Strict JSON format:
{
  "name": "User's name if specified in prompt, else null",
  "title": "Executive Technical Title (Max 6 words, e.g., 'Senior Full Stack Architect | Cloud & UI')",
  "bio": "The ultra-professional 3-sentence executive bio text",
  "techStack": ["Array of 5 to 8 specific relevant technologies"]
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
          title: jsonResult.title || "Senior Software Engineer",
          bio: jsonResult.bio || "Senior Software Engineer specializing in high-performance web applications and resilient digital architecture. Passionate about developer tooling, design systems, and scalable cloud infrastructure. Currently architecting mission-critical web platforms.",
          techStack: Array.isArray(jsonResult.techStack) && jsonResult.techStack.length > 0
            ? jsonResult.techStack
            : extractTechFromText(prompt),
        });
      }
    } catch (geminiError: any) {
      console.warn("Gemini API error, using executive generator fallback:", geminiError?.message || geminiError);
      return NextResponse.json(generateMockProfile(prompt));
    }

    return NextResponse.json(generateMockProfile(prompt));

  } catch (error: any) {
    console.error("Critical error in /api/generate-profile:", error);
    return NextResponse.json(generateMockProfile(prompt || "Senior Software Engineer"));
  }
}

function extractTechFromText(prompt: string): string[] {
  const p = prompt.toLowerCase();
  const knownTech = [
    { key: "typescript", label: "TypeScript" },
    { key: "javascript", label: "JavaScript" },
    { key: "react native", label: "React Native" },
    { key: "react", label: "React" },
    { key: "next.js", label: "Next.js" },
    { key: "nextjs", label: "Next.js" },
    { key: "next", label: "Next.js" },
    { key: "vue", label: "Vue.js" },
    { key: "angular", label: "Angular" },
    { key: "node", label: "Node.js" },
    { key: "express", label: "Express.js" },
    { key: "python", label: "Python" },
    { key: "django", label: "Django" },
    { key: "fastapi", label: "FastAPI" },
    { key: "rust", label: "Rust" },
    { key: "golang", label: "Go" },
    { key: "go", label: "Go" },
    { key: "flutter", label: "Flutter" },
    { key: "dart", label: "Dart" },
    { key: "swift", label: "Swift" },
    { key: "kotlin", label: "Kotlin" },
    { key: "java", label: "Java" },
    { key: "docker", label: "Docker" },
    { key: "kubernetes", label: "Kubernetes" },
    { key: "aws", label: "AWS" },
    { key: "firebase", label: "Firebase" },
    { key: "figma", label: "Figma" },
    { key: "tailwind", label: "TailwindCSS" },
    { key: "webgl", label: "WebGL" },
    { key: "three.js", label: "Three.js" },
    { key: "graphql", label: "GraphQL" },
    { key: "mongodb", label: "MongoDB" },
    { key: "postgresql", label: "PostgreSQL" },
  ];

  const extracted: string[] = [];
  for (const t of knownTech) {
    if (p.includes(t.key) && !extracted.includes(t.label)) {
      extracted.push(t.label);
    }
  }

  return extracted.length > 0
    ? extracted
    : ["TypeScript", "React", "Node.js", "TailwindCSS"];
}

function generateMockProfile(prompt: string) {
  const p = prompt.toLowerCase();
  
  let extractedName: string | undefined = undefined;
  const nameMatch = prompt.match(/(?:i am|my name is|im)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    extractedName = nameMatch[1];
  }

  const techStack = extractTechFromText(prompt);

  if (p.includes("frontend") || p.includes("ui") || p.includes("react") || p.includes("webgl")) {
    return {
      name: extractedName,
      title: "Senior Frontend Engineer & UI/UX Architect",
      bio: "Senior Frontend Engineer specializing in ultra-low latency web applications, modular design systems, and modern React ecosystems. Driven by performance optimization, accessible UI design, and fluid interactive user experiences. Currently pioneering scalable frontend architectures and developer tooling for high-traffic platforms.",
      techStack,
    };
  }

  if (p.includes("backend") || p.includes("node") || p.includes("python") || p.includes("go") || p.includes("rust")) {
    return {
      name: extractedName,
      title: "Principal Backend & Systems Architect",
      bio: "Principal Systems Architect specializing in resilient distributed services, cloud-native infrastructure, and high-throughput backend APIs. Focused on database optimization, zero-downtime deployment pipelines, and sub-millisecond query performance. Dedicated to building mission-critical enterprise systems and open-source tools.",
      techStack,
    };
  }

  if (p.includes("mobile") || p.includes("flutter") || p.includes("react native") || p.includes("ios") || p.includes("android")) {
    return {
      name: extractedName,
      title: "Senior Mobile Application Architect",
      bio: "Senior Mobile Engineer specializing in cross-platform mobile architectures, native performance tuning, and fluid user interfaces. Experienced in offline-first state management, secure mobile protocols, and automated CI/CD app publishing. Currently building next-generation mobile applications for global scale.",
      techStack,
    };
  }

  if (p.includes("ai") || p.includes("ml") || p.includes("data") || p.includes("python")) {
    return {
      name: extractedName,
      title: "Senior AI / ML Systems Engineer",
      bio: "AI Systems Engineer specializing in production machine learning pipelines, large language model integration, and high-performance data processing. Focused on bridging cutting-edge neural architectures with scalable enterprise cloud backend services. Dedicated to driving algorithmic efficiency and automated intelligent workflows.",
      techStack,
    };
  }

  if (p.includes("designer") || p.includes("figma") || p.includes("ux")) {
    return {
      name: extractedName,
      title: "Lead Product Designer & Frontend Architect",
      bio: "Lead Product Designer & Frontend Architect bridging design systems with high-fidelity React component engineering. Focused on micro-interactions, cohesive visual design systems, and rapid prototyping workflows. Dedicated to creating intuitive digital products that harmonize aesthetic beauty with engineering rigor.",
      techStack,
    };
  }

  return {
    name: extractedName,
    title: "Senior Full Stack Engineer & Software Architect",
    bio: "Senior Full Stack Engineer with expertise in end-to-end cloud applications, robust REST/GraphQL APIs, and responsive web platforms. Committed to clean code design, automated testing pipelines, and seamless developer experience. Currently leading full-stack engineering initiatives and architecting scalable web solutions.",
    techStack,
  };
}
