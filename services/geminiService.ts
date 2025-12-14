import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisRequest, AnalysisResult, RiskLevel, EffortLevel } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectTitle: { type: Type.STRING, description: "A short, 3-5 word title derived from the requirements." },
    understanding: { type: Type.STRING, description: "Executive summary of the requirements." },
    functionalComplexity: { type: Type.STRING, description: "Analysis of functional complexity." },
    nonFunctionalConstraints: { type: Type.STRING, description: "Analysis of non-functional constraints (performance, security, etc)." },
    riskLevel: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
    riskJustification: { type: Type.STRING, description: "Why this risk level was assigned." },
    highRiskModules: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific modules that are high risk." },
    effort: { type: Type.STRING, enum: [EffortLevel.LOW, EffortLevel.MEDIUM, EffortLevel.HIGH] },
    architectureRecommendation: { type: Type.STRING, description: "Recommended architecture pattern." },
    techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended technologies." },
    automationStrategy: { type: Type.STRING, description: "CI/CD and testing automation recommendations." },
    qualityGates: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific quality gates before release." },
    finalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable next steps." },
  },
  required: [
    "projectTitle",
    "understanding",
    "functionalComplexity",
    "nonFunctionalConstraints",
    "riskLevel",
    "riskJustification",
    "effort",
    "architectureRecommendation",
    "techStack",
    "automationStrategy",
    "qualityGates",
    "finalRecommendations"
  ],
};

export const analyzeRequirements = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    Act as an AI-powered Delivery Risk & Effort Estimation Engine.
    
    Input Data:
    - Business Requirements: ${request.requirements}
    - Expected Timelines: ${request.timelines}
    - Constraints: ${request.constraints}

    Your tasks:
    1. Analyze the business requirements deeply.
    2. Identify functional complexity and non-functional constraints.
    3. Estimate development effort and delivery risk level.
    4. Highlight high-risk modules.
    5. Recommend suitable application architecture and tech stack.
    6. Suggest test strategy and quality gates.
    7. Ensure business alignment and practical recommendations.

    Return the result strictly as a structured JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert Senior Technical Architect and Delivery Manager with 20+ years of experience in enterprise software delivery.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated.");

    const data = JSON.parse(text);

    return {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};