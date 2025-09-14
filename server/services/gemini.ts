import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "" 
});

export async function generateFinancialAdvice(
  question: string, 
  context?: {
    familyId?: string;
    currentGoals?: string[];
    budgetUsage?: number;
    totalBalance?: string;
    memberCount?: number;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are Aetherius, an AI financial advisor specialized in family financial literacy and planning. 
You provide practical, actionable advice for Indian families focusing on:
- Budgeting and expense management
- Savings strategies and goal planning
- Investment options suitable for families
- Financial education for different age groups
- Scam protection and financial security
- Insurance and loan guidance

Always provide advice in Indian Rupees (₹) and consider Indian financial products and regulations.
Keep responses conversational, encouraging, and family-focused.`;

    let contextualPrompt = question;
    
    if (context) {
      contextualPrompt = `Family Context:
${context.currentGoals ? `- Current Goals: ${context.currentGoals.join(', ')}` : ''}
${context.budgetUsage ? `- Current Budget Usage: ${context.budgetUsage}%` : ''}
${context.totalBalance ? `- Family Balance: ₹${context.totalBalance}` : ''}
${context.memberCount ? `- Family Members: ${context.memberCount}` : ''}

Question: ${question}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contextualPrompt,
    });

    return response.text || "I'm sorry, I couldn't generate advice at the moment. Please try asking your question differently.";
  } catch (error) {
    console.error("Failed to generate financial advice:", error);
    throw new Error("Unable to generate financial advice. Please check your connection and try again.");
  }
}

export async function generateEducationalContent(
  topic: string,
  ageGroup: string,
  difficulty: string
): Promise<{
  title: string;
  description: string;
  content: string;
  duration: number;
}> {
  try {
    const systemPrompt = `You are an expert financial education content creator for the Aetherius platform.
Create engaging, age-appropriate financial education content for Indian families.
Focus on practical learning that can be applied immediately.

Age Groups:
- children (5-12): Simple concepts, stories, and games
- teens (13-18): Real-world scenarios, digital money, career planning
- adults (18+): Investment strategies, tax planning, insurance
- all: Content suitable for family learning together

Difficulty Levels:
- beginner: Basic concepts and terminology
- intermediate: Practical applications and strategies  
- advanced: Complex planning and optimization

Always use Indian context, currency (₹), and financial products.`;

    const contentPrompt = `Create educational content about "${topic}" for ${ageGroup} at ${difficulty} level.

Provide a JSON response with:
- title: Catchy, educational title
- description: 2-3 sentence summary
- content: Detailed lesson content (500-800 words)
- duration: Estimated reading time in minutes

Make it engaging, practical, and actionable for Indian families.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            content: { type: "string" },
            duration: { type: "number" }
          },
          required: ["title", "description", "content", "duration"]
        }
      },
      contents: contentPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from model");
    }

    const data = JSON.parse(rawJson);
    
    // Validate the response structure
    if (!data.title || !data.description || !data.content || !data.duration) {
      throw new Error("Invalid content structure received");
    }

    return data;
  } catch (error) {
    console.error("Failed to generate educational content:", error);
    throw new Error("Unable to generate educational content. Please try again with a different topic.");
  }
}

export async function analyzeSpendingPattern(
  transactions: Array<{
    amount: string;
    category: string;
    type: string;
    date: string;
  }>,
  budgetLimits: Record<string, number>
): Promise<{
  insights: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}> {
  try {
    const systemPrompt = `You are a financial analyst specializing in family spending patterns and budget optimization.
Analyze spending data and provide actionable insights for Indian families.
Focus on practical recommendations that can improve financial health.`;

    const analysisPrompt = `Analyze this family's spending pattern:

Transactions: ${JSON.stringify(transactions.slice(0, 20))} // Last 20 transactions
Budget Limits: ${JSON.stringify(budgetLimits)}

Provide analysis in JSON format:
- insights: Array of 3-5 key observations about spending patterns
- recommendations: Array of 3-5 specific, actionable recommendations  
- riskLevel: "low", "medium", or "high" based on overspending risk

Focus on Indian family financial context and provide practical advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            insights: { 
              type: "array",
              items: { type: "string" }
            },
            recommendations: { 
              type: "array", 
              items: { type: "string" }
            },
            riskLevel: { 
              type: "string",
              enum: ["low", "medium", "high"]
            }
          },
          required: ["insights", "recommendations", "riskLevel"]
        }
      },
      contents: analysisPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from model");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Failed to analyze spending pattern:", error);
    throw new Error("Unable to analyze spending pattern. Please try again.");
  }
}

export async function detectPotentialScam(
  transactionDetails: {
    amount: string;
    description: string;
    recipient: string;
    method: string;
    timestamp: string;
  }
): Promise<{
  isScamLikely: boolean;
  confidence: number;
  reasons: string[];
  recommendations: string[];
}> {
  try {
    const systemPrompt = `You are a financial security expert specializing in scam detection for Indian families.
Analyze transaction details to identify potential scams and fraudulent activities.
Consider common Indian scam patterns, UPI frauds, and financial scams.`;

    const scamPrompt = `Analyze this transaction for potential scam indicators:

Transaction Details:
- Amount: ₹${transactionDetails.amount}
- Description: ${transactionDetails.description}
- Recipient: ${transactionDetails.recipient}
- Method: ${transactionDetails.method}
- Time: ${transactionDetails.timestamp}

Provide analysis in JSON format:
- isScamLikely: Boolean indicating if this appears to be a scam
- confidence: Number 0-100 indicating confidence level
- reasons: Array of specific reasons why this might be a scam
- recommendations: Array of actions the user should take

Focus on Indian scam patterns and provide practical safety advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            isScamLikely: { type: "boolean" },
            confidence: { type: "number" },
            reasons: { 
              type: "array",
              items: { type: "string" }
            },
            recommendations: { 
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["isScamLikely", "confidence", "reasons", "recommendations"]
        }
      },
      contents: scamPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from model");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Failed to detect potential scam:", error);
    throw new Error("Unable to analyze transaction for scam indicators. Please review manually.");
  }
}

export async function generateFamilyGoalPlan(
  goal: {
    name: string;
    targetAmount: string;
    timeframe: string;
    priority: "high" | "medium" | "low";
  },
  familyFinances: {
    monthlyIncome: string;
    monthlyExpenses: string;
    currentSavings: string;
    memberCount: number;
  }
): Promise<{
  monthlyContribution: number;
  strategies: string[];
  timeline: string;
  feasibilityScore: number;
  recommendations: string[];
}> {
  try {
    const systemPrompt = `You are a family financial planning expert specializing in goal-based savings for Indian families.
Create realistic, actionable savings plans that consider family dynamics and Indian financial products.
Provide practical strategies that families can implement immediately.`;

    const planPrompt = `Create a savings plan for this family goal:

Goal Details:
- Name: ${goal.name}
- Target Amount: ₹${goal.targetAmount}
- Timeframe: ${goal.timeframe}
- Priority: ${goal.priority}

Family Finances:
- Monthly Income: ₹${familyFinances.monthlyIncome}
- Monthly Expenses: ₹${familyFinances.monthlyExpenses}
- Current Savings: ₹${familyFinances.currentSavings}
- Family Members: ${familyFinances.memberCount}

Provide a JSON response with:
- monthlyContribution: Required monthly savings amount
- strategies: Array of specific saving strategies
- timeline: Realistic timeline description
- feasibilityScore: Score 1-100 indicating how achievable this goal is
- recommendations: Array of actionable recommendations

Consider Indian investment options like SIPs, FDs, PPF, etc.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            monthlyContribution: { type: "number" },
            strategies: { 
              type: "array",
              items: { type: "string" }
            },
            timeline: { type: "string" },
            feasibilityScore: { type: "number" },
            recommendations: { 
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["monthlyContribution", "strategies", "timeline", "feasibilityScore", "recommendations"]
        }
      },
      contents: planPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from model");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Failed to generate family goal plan:", error);
    throw new Error("Unable to generate goal plan. Please try again with different parameters.");
  }
}
