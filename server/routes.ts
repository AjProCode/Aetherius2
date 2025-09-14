import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFinancialAdvice, generateEducationalContent } from "./services/gemini";
import {
  insertFamilySchema,
  insertFamilyMemberSchema,
  insertFamilyGoalSchema,
  insertBudgetSchema,
  insertTransactionSchema,
  insertSmartAlertSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Family routes
  app.get("/api/family/:id", async (req, res) => {
    try {
      const familyData = await storage.getFamilyWithMembers(req.params.id);
      if (!familyData) {
        return res.status(404).json({ message: "Family not found" });
      }
      res.json(familyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family data" });
    }
  });

  app.post("/api/family", async (req, res) => {
    try {
      const validatedData = insertFamilySchema.parse(req.body);
      const family = await storage.createFamily(validatedData);
      res.status(201).json(family);
    } catch (error) {
      res.status(400).json({ message: "Invalid family data" });
    }
  });

  // Family member routes
  app.get("/api/family/:familyId/members", async (req, res) => {
    try {
      const members = await storage.getFamilyMembers(req.params.familyId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch family members" });
    }
  });

  app.post("/api/family/:familyId/members", async (req, res) => {
    try {
      const validatedData = insertFamilyMemberSchema.parse({
        ...req.body,
        familyId: req.params.familyId,
      });
      const member = await storage.createFamilyMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid member data" });
    }
  });

  // Goal routes
  app.get("/api/family/:familyId/goals", async (req, res) => {
    try {
      const goals = await storage.getFamilyGoals(req.params.familyId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/family/:familyId/goals", async (req, res) => {
    try {
      const validatedData = insertFamilyGoalSchema.parse({
        ...req.body,
        familyId: req.params.familyId,
      });
      const goal = await storage.createFamilyGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const goal = await storage.updateFamilyGoal(req.params.id, req.body);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  // Budget routes
  app.get("/api/family/:familyId/budget/:month", async (req, res) => {
    try {
      const budget = await storage.getFamilyBudget(req.params.familyId, req.params.month);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });

  app.post("/api/family/:familyId/budget", async (req, res) => {
    try {
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        familyId: req.params.familyId,
      });
      const budget = await storage.createBudget(validatedData);
      res.status(201).json(budget);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget data" });
    }
  });

  // Transaction routes
  app.get("/api/family/:familyId/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getFamilyTransactions(req.params.familyId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/family/:familyId/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        familyId: req.params.familyId,
      });
      const transaction = await storage.createTransaction(validatedData);
      
      // Check for overspending and create alerts
      if (validatedData.type === "expense") {
        const budget = await storage.getFamilyBudget(req.params.familyId, "2024-11");
        if (budget && budget.categories) {
          const category = validatedData.category as keyof typeof budget.categories;
          const categoryData = budget.categories[category];
          
          if (categoryData) {
            const newSpent = categoryData.spent + parseFloat(validatedData.amount);
            const percentage = (newSpent / categoryData.budget) * 100;
            
            if (percentage > 90) {
              await storage.createAlert({
                familyId: req.params.familyId,
                type: "overspending",
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Budget Alert`,
                message: `You've spent ${percentage.toFixed(1)}% of your ${category} budget`,
                severity: percentage > 100 ? "high" : "medium",
                isRead: false,
                data: { category, percentage: Math.round(percentage) },
              });
            }
          }
        }
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Alert routes
  app.get("/api/family/:familyId/alerts", async (req, res) => {
    try {
      const alerts = await storage.getFamilyAlerts(req.params.familyId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Educational content routes
  app.get("/api/educational-content", async (req, res) => {
    try {
      const type = req.query.type as string;
      const ageGroup = req.query.ageGroup as string;
      const content = await storage.getEducationalContent(type, ageGroup);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational content" });
    }
  });

  app.get("/api/members/:memberId/learning-progress", async (req, res) => {
    try {
      const progress = await storage.getLearningProgress(req.params.memberId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning progress" });
    }
  });

  // Investment routes
  app.get("/api/investments", async (req, res) => {
    try {
      const investments = await storage.getInvestments();
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // Financial services routes
  app.get("/api/family/:familyId/financial-services", async (req, res) => {
    try {
      const services = await storage.getFamilyFinancialServices(req.params.familyId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial services" });
    }
  });

  // AI-powered routes
  app.post("/api/ai/financial-advice", async (req, res) => {
    try {
      const { question, context } = req.body;
      const advice = await generateFinancialAdvice(question, context);
      res.json({ advice });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate financial advice" });
    }
  });

  app.post("/api/ai/educational-content", async (req, res) => {
    try {
      const { topic, ageGroup, difficulty } = req.body;
      const content = await generateEducationalContent(topic, ageGroup, difficulty);
      
      // Save the generated content
      const savedContent = await storage.createEducationalContent({
        title: content.title,
        description: content.description,
        content: content.content,
        type: "lesson",
        category: topic,
        ageGroup,
        duration: content.duration,
        difficulty,
        icon: "brain",
        isAIGenerated: true,
      });
      
      res.status(201).json(savedContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate educational content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
