import {
  type Family,
  type InsertFamily,
  type FamilyMember,
  type InsertFamilyMember,
  type FamilyGoal,
  type InsertFamilyGoal,
  type Budget,
  type InsertBudget,
  type Transaction,
  type InsertTransaction,
  type SmartAlert,
  type InsertSmartAlert,
  type EducationalContent,
  type InsertEducationalContent,
  type LearningProgress,
  type InsertLearningProgress,
  type Investment,
  type InsertInvestment,
  type FinancialService,
  type InsertFinancialService,
  families,
  familyMembers,
  familyGoals,
  budgets,
  transactions,
  smartAlerts,
  educationalContent,
  learningProgress,
  investments,
  financialServices,
} from "../shared/schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Family operations
  getFamily(id: string): Promise<Family | undefined>;
  createFamily(family: InsertFamily): Promise<Family>;
  getFamilyWithMembers(familyId: string): Promise<{
    family: Family;
    members: FamilyMember[];
  } | undefined>;

  // Family member operations
  getFamilyMembers(familyId: string): Promise<FamilyMember[]>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined>;

  // Goal operations
  getFamilyGoals(familyId: string): Promise<FamilyGoal[]>;
  createFamilyGoal(goal: InsertFamilyGoal): Promise<FamilyGoal>;
  updateFamilyGoal(id: string, updates: Partial<FamilyGoal>): Promise<FamilyGoal | undefined>;

  // Budget operations
  getFamilyBudget(familyId: string, month: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | undefined>;

  // Transaction operations
  getFamilyTransactions(familyId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Alert operations
  getFamilyAlerts(familyId: string): Promise<SmartAlert[]>;
  createAlert(alert: InsertSmartAlert): Promise<SmartAlert>;
  markAlertAsRead(id: string): Promise<SmartAlert | undefined>;

  // Educational content operations
  getEducationalContent(type?: string, ageGroup?: string): Promise<EducationalContent[]>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;
  getLearningProgress(memberId: string): Promise<LearningProgress[]>;
  updateLearningProgress(progress: InsertLearningProgress): Promise<LearningProgress>;

  // Investment operations
  getInvestments(): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;

  // Financial service operations
  getFamilyFinancialServices(familyId: string): Promise<FinancialService[]>;
  createFinancialService(service: InsertFinancialService): Promise<FinancialService>;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class PostgreSQLStorage implements IStorage {
  private isSeeded = false;

  constructor() {
    this.ensureSeedData();
  }

  private async ensureSeedData() {
    if (this.isSeeded) return;
    
    try {
      // Check if data already exists
      const existingFamily = await db.select().from(families).where(eq(families.id, "family-1")).limit(1);
      if (existingFamily.length > 0) {
        this.isSeeded = true;
        return;
      }
      
      await this.seedData();
      this.isSeeded = true;
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  private async seedData() {
    // Create demo family
    await db.insert(families).values({
      id: "family-1",
      name: "The Johnson Family",
      totalBalance: "245670",
    });

    // Create family members
    const members: FamilyMember[] = [
      {
        id: "member-1",
        familyId: "family-1",
        name: "Dad",
        role: "Family Head",
        age: 42,
        balance: "85430",
        avatar: "dad",
        status: "+₹2,500",
        isActive: true,
      },
      {
        id: "member-2",
        familyId: "family-1",
        name: "Mom",
        role: "Co-Manager",
        age: 38,
        balance: "67240",
        avatar: "mom",
        status: "Saving Goal",
        isActive: true,
      },
      {
        id: "member-3",
        familyId: "family-1",
        name: "Alex",
        role: "Student",
        age: 16,
        balance: "8500",
        avatar: "alex",
        status: "Learning",
        isActive: true,
      },
      {
        id: "member-4",
        familyId: "family-1",
        name: "Emma",
        role: "Junior Saver",
        age: 12,
        balance: "3200",
        avatar: "emma",
        status: "Top Saver",
        isActive: true,
      },
    ];
    await db.insert(familyMembers).values(members);

    // Create family goals
    const goals: FamilyGoal[] = [
      {
        id: "goal-1",
        familyId: "family-1",
        name: "Family Vacation to Goa",
        description: "Summer vacation for the whole family",
        targetAmount: "75000",
        currentAmount: "45000",
        deadline: new Date("2025-06-01"),
        category: "vacation",
        icon: "plane",
        contributors: ["member-1", "member-2", "member-3", "member-4"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "goal-2",
        familyId: "family-1",
        name: "Emergency Fund",
        description: "6 months of expenses",
        targetAmount: "100000",
        currentAmount: "85000",
        deadline: new Date("2025-12-31"),
        category: "emergency",
        icon: "shield-alt",
        contributors: ["member-1", "member-2"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "goal-3",
        familyId: "family-1",
        name: "Children's Education Fund",
        description: "Long-term education savings",
        targetAmount: "500000",
        currentAmount: "125000",
        deadline: new Date("2030-12-31"),
        category: "education",
        icon: "graduation-cap",
        contributors: ["member-1", "member-2"],
        isActive: true,
        createdAt: new Date(),
      },
    ];
    await db.insert(familyGoals).values(goals);

    // Create budget
    const budget: Budget = {
      id: "budget-1",
      familyId: "family-1",
      month: "2024-11",
      totalBudget: "95000",
      totalSpent: "78450",
      categories: {
        food: { budget: 25000, spent: 22340 },
        transport: { budget: 20000, spent: 18700 },
        entertainment: { budget: 15000, spent: 12450 },
        shopping: { budget: 27000, spent: 24960 },
        utilities: { budget: 8000, spent: 0 },
        healthcare: { budget: 0, spent: 0 },
      },
    };
    await db.insert(budgets).values(budget);

    // Create alerts
    const alerts: SmartAlert[] = [
      {
        id: "alert-1",
        familyId: "family-1",
        type: "overspending",
        title: "Shopping Budget Alert",
        message: "You've spent 92% of your shopping budget (₹24,960/₹27,000)",
        severity: "high",
        isRead: false,
        data: { category: "shopping", percentage: 92 },
        createdAt: new Date(),
      },
      {
        id: "alert-2",
        familyId: "family-1",
        type: "scam",
        title: "Scam Alert Blocked",
        message: "Suspicious transaction attempt blocked for ₹15,000",
        severity: "high",
        isRead: false,
        data: { amount: 15000 },
        createdAt: new Date(),
      },
      {
        id: "alert-3",
        familyId: "family-1",
        type: "achievement",
        title: "Great Job!",
        message: "You're ahead of your savings goal by ₹3,200 this month",
        severity: "low",
        isRead: false,
        data: { amount: 3200 },
        createdAt: new Date(),
      },
    ];
    await db.insert(smartAlerts).values(alerts);

    // Create educational content
    const content: EducationalContent[] = [
      {
        id: "content-1",
        title: "Smart Investment Strategies for Families",
        description: "Learn how to diversify your family's investment portfolio with our AI-guided course.",
        content: "Comprehensive guide to family investing...",
        type: "lesson",
        category: "investing",
        ageGroup: "adults",
        duration: 15,
        difficulty: "intermediate",
        icon: "brain",
        isAIGenerated: true,
      },
      {
        id: "content-2",
        title: "Budget Challenge Week",
        description: "Compete with your family members to see who can stick to their budget best!",
        content: "Interactive budget challenge game...",
        type: "game",
        category: "budgeting",
        ageGroup: "all",
        duration: 30,
        difficulty: "beginner",
        icon: "puzzle-piece",
        isAIGenerated: false,
      },
    ];
    await db.insert(educationalContent).values(content);

    // Create investments
    const investmentOptions: Investment[] = [
      {
        id: "inv-1",
        familyId: "family-1",
        name: "Diversified Equity Fund",
        type: "sip",
        amount: "0",
        returns: "12.8",
        risk: "medium",
        description: "Start with ₹1,000/month for long-term wealth building",
        minInvestment: "1000",
      },
      {
        id: "inv-2",
        familyId: "family-1",
        name: "Fixed Deposit",
        type: "fd",
        amount: "0",
        returns: "7.2",
        risk: "low",
        description: "Minimum ₹5,000 • 1-5 years tenure",
        minInvestment: "5000",
      },
      {
        id: "inv-3",
        familyId: "family-1",
        name: "Digital Gold",
        type: "gold",
        amount: "0",
        returns: "8.5",
        risk: "medium",
        description: "Hedge against inflation • Easy to buy/sell",
        minInvestment: "100",
      },
    ];
    await db.insert(investments).values(investmentOptions);

    // Create financial services
    const services: FinancialService[] = [
      {
        id: "service-1",
        familyId: "family-1",
        type: "insurance",
        name: "Life Insurance",
        status: "active",
        amount: "1000000",
        monthlyPayment: "2500",
        details: { policies: 3, coverage: "Life, Health, Term" },
      },
      {
        id: "service-2",
        familyId: "family-1",
        type: "loan",
        name: "Home Loan",
        status: "active",
        amount: "2500000",
        monthlyPayment: "28450",
        details: { remaining: "18,50,000", tenure: "15 years" },
      },
      {
        id: "service-3",
        familyId: "family-1",
        type: "credit_score",
        name: "Credit Score",
        status: "active",
        amount: "785",
        monthlyPayment: "0",
        details: { rating: "Excellent", lastUpdated: "Nov 15" },
      },
    ];
    await db.insert(financialServices).values(services);
  }

  async getFamily(id: string): Promise<Family | undefined> {
    const result = await db.select().from(families).where(eq(families.id, id)).limit(1);
    return result[0];
  }

  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const result = await db.insert(families).values(insertFamily).returning();
    return result[0];
  }

  async getFamilyWithMembers(familyId: string): Promise<{
    family: Family;
    members: FamilyMember[];
  } | undefined> {
    const familyResult = await db.select().from(families).where(eq(families.id, familyId)).limit(1);
    if (familyResult.length === 0) return undefined;

    const membersResult = await db.select().from(familyMembers).where(
      and(eq(familyMembers.familyId, familyId), eq(familyMembers.isActive, true))
    );

    return { family: familyResult[0], members: membersResult };
  }

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).where(
      and(eq(familyMembers.familyId, familyId), eq(familyMembers.isActive, true))
    );
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const result = await db.insert(familyMembers).values(insertMember).returning();
    return result[0];
  }

  async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const result = await db.update(familyMembers).set(updates).where(eq(familyMembers.id, id)).returning();
    return result[0];
  }

  async getFamilyGoals(familyId: string): Promise<FamilyGoal[]> {
    return await db.select().from(familyGoals).where(
      and(eq(familyGoals.familyId, familyId), eq(familyGoals.isActive, true))
    );
  }

  async createFamilyGoal(insertGoal: InsertFamilyGoal): Promise<FamilyGoal> {
    const result = await db.insert(familyGoals).values(insertGoal).returning();
    return result[0];
  }

  async updateFamilyGoal(id: string, updates: Partial<FamilyGoal>): Promise<FamilyGoal | undefined> {
    const result = await db.update(familyGoals).set(updates).where(eq(familyGoals.id, id)).returning();
    return result[0];
  }

  async getFamilyBudget(familyId: string, month: string): Promise<Budget | undefined> {
    const result = await db.select().from(budgets).where(
      and(eq(budgets.familyId, familyId), eq(budgets.month, month))
    ).limit(1);
    return result[0];
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const result = await db.insert(budgets).values(insertBudget).returning();
    return result[0];
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | undefined> {
    const result = await db.update(budgets).set(updates).where(eq(budgets.id, id)).returning();
    return result[0];
  }

  async getFamilyTransactions(familyId: string, limit = 50): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.familyId, familyId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(insertTransaction).returning();
    return result[0];
  }

  async getFamilyAlerts(familyId: string): Promise<SmartAlert[]> {
    return await db.select().from(smartAlerts)
      .where(eq(smartAlerts.familyId, familyId))
      .orderBy(desc(smartAlerts.createdAt));
  }

  async createAlert(insertAlert: InsertSmartAlert): Promise<SmartAlert> {
    const result = await db.insert(smartAlerts).values(insertAlert).returning();
    return result[0];
  }


  async getEducationalContent(type?: string, ageGroup?: string): Promise<EducationalContent[]> {
    const conditions = [];
    if (type) conditions.push(eq(educationalContent.type, type));
    if (ageGroup) conditions.push(eq(educationalContent.ageGroup, ageGroup));
    
    if (conditions.length > 0) {
      return await db.select().from(educationalContent).where(and(...conditions));
    }
    
    return await db.select().from(educationalContent);
  }

  async createEducationalContent(insertContent: InsertEducationalContent): Promise<EducationalContent> {
    const result = await db.insert(educationalContent).values(insertContent).returning();
    return result[0];
  }

  async getLearningProgress(memberId: string): Promise<LearningProgress[]> {
    return await db.select().from(learningProgress).where(eq(learningProgress.memberId, memberId));
  }

  async updateLearningProgress(insertProgress: InsertLearningProgress): Promise<LearningProgress> {
    const existing = await db.select().from(learningProgress).where(
      and(
        eq(learningProgress.memberId, insertProgress.memberId),
        eq(learningProgress.contentId, insertProgress.contentId)
      )
    ).limit(1);

    if (existing.length > 0) {
      const result = await db.update(learningProgress)
        .set({ ...insertProgress, lastAccessed: new Date() })
        .where(eq(learningProgress.id, existing[0].id))
        .returning();
      return result[0];
    }

    const result = await db.insert(learningProgress).values(insertProgress).returning();
    return result[0];
  }

  async getInvestments(): Promise<Investment[]> {
    return await db.select().from(investments);
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const result = await db.insert(investments).values(insertInvestment).returning();
    return result[0];
  }

  async getFamilyFinancialServices(familyId: string): Promise<FinancialService[]> {
    return await db.select().from(financialServices).where(eq(financialServices.familyId, familyId));
  }

  async createFinancialService(insertService: InsertFinancialService): Promise<FinancialService> {
    const result = await db.insert(financialServices).values(insertService).returning();
    return result[0];
  }

  async markAlertAsRead(id: string): Promise<SmartAlert | undefined> {
    const result = await db.update(smartAlerts)
      .set({ isRead: true })
      .where(eq(smartAlerts.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new PostgreSQLStorage();
