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
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private families: Map<string, Family> = new Map();
  private familyMembers: Map<string, FamilyMember> = new Map();
  private familyGoals: Map<string, FamilyGoal> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private smartAlerts: Map<string, SmartAlert> = new Map();
  private educationalContent: Map<string, EducationalContent> = new Map();
  private learningProgress: Map<string, LearningProgress> = new Map();
  private investments: Map<string, Investment> = new Map();
  private financialServices: Map<string, FinancialService> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo family
    const family: Family = {
      id: "family-1",
      name: "The Johnson Family",
      totalBalance: "245670",
      createdAt: new Date(),
    };
    this.families.set(family.id, family);

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
    members.forEach(member => this.familyMembers.set(member.id, member));

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
    goals.forEach(goal => this.familyGoals.set(goal.id, goal));

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
    this.budgets.set(budget.id, budget);

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
    alerts.forEach(alert => this.smartAlerts.set(alert.id, alert));

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
    content.forEach(c => this.educationalContent.set(c.id, c));

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
    investmentOptions.forEach(inv => this.investments.set(inv.id, inv));

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
    services.forEach(service => this.financialServices.set(service.id, service));
  }

  async getFamily(id: string): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const id = randomUUID();
    const family: Family = {
      ...insertFamily,
      id,
      createdAt: new Date(),
    };
    this.families.set(id, family);
    return family;
  }

  async getFamilyWithMembers(familyId: string): Promise<{
    family: Family;
    members: FamilyMember[];
  } | undefined> {
    const family = this.families.get(familyId);
    if (!family) return undefined;

    const members = Array.from(this.familyMembers.values()).filter(
      member => member.familyId === familyId && member.isActive
    );

    return { family, members };
  }

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values()).filter(
      member => member.familyId === familyId && member.isActive
    );
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = randomUUID();
    const member: FamilyMember = {
      ...insertMember,
      id,
    };
    this.familyMembers.set(id, member);
    return member;
  }

  async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const member = this.familyMembers.get(id);
    if (!member) return undefined;

    const updatedMember = { ...member, ...updates };
    this.familyMembers.set(id, updatedMember);
    return updatedMember;
  }

  async getFamilyGoals(familyId: string): Promise<FamilyGoal[]> {
    return Array.from(this.familyGoals.values()).filter(
      goal => goal.familyId === familyId && goal.isActive
    );
  }

  async createFamilyGoal(insertGoal: InsertFamilyGoal): Promise<FamilyGoal> {
    const id = randomUUID();
    const goal: FamilyGoal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
    };
    this.familyGoals.set(id, goal);
    return goal;
  }

  async updateFamilyGoal(id: string, updates: Partial<FamilyGoal>): Promise<FamilyGoal | undefined> {
    const goal = this.familyGoals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...updates };
    this.familyGoals.set(id, updatedGoal);
    return updatedGoal;
  }

  async getFamilyBudget(familyId: string, month: string): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(
      budget => budget.familyId === familyId && budget.month === month
    );
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      ...insertBudget,
      id,
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;

    const updatedBudget = { ...budget, ...updates };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async getFamilyTransactions(familyId: string, limit = 50): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.familyId === familyId)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
      .slice(0, limit);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      date: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getFamilyAlerts(familyId: string): Promise<SmartAlert[]> {
    return Array.from(this.smartAlerts.values())
      .filter(alert => alert.familyId === familyId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createAlert(insertAlert: InsertSmartAlert): Promise<SmartAlert> {
    const id = randomUUID();
    const alert: SmartAlert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.smartAlerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<SmartAlert | undefined> {
    const alert = this.smartAlerts.get(id);
    if (!alert) return undefined;

    const updatedAlert = { ...alert, isRead: true };
    this.smartAlerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async getEducationalContent(type?: string, ageGroup?: string): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values()).filter(content => {
      if (type && content.type !== type) return false;
      if (ageGroup && content.ageGroup !== ageGroup && content.ageGroup !== "all") return false;
      return true;
    });
  }

  async createEducationalContent(insertContent: InsertEducationalContent): Promise<EducationalContent> {
    const id = randomUUID();
    const content: EducationalContent = {
      ...insertContent,
      id,
    };
    this.educationalContent.set(id, content);
    return content;
  }

  async getLearningProgress(memberId: string): Promise<LearningProgress[]> {
    return Array.from(this.learningProgress.values()).filter(
      progress => progress.memberId === memberId
    );
  }

  async updateLearningProgress(insertProgress: InsertLearningProgress): Promise<LearningProgress> {
    const existing = Array.from(this.learningProgress.values()).find(
      p => p.memberId === insertProgress.memberId && p.contentId === insertProgress.contentId
    );

    if (existing) {
      const updated = { ...existing, ...insertProgress, lastAccessed: new Date() };
      this.learningProgress.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const progress: LearningProgress = {
      ...insertProgress,
      id,
      lastAccessed: new Date(),
    };
    this.learningProgress.set(id, progress);
    return progress;
  }

  async getInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = randomUUID();
    const investment: Investment = {
      ...insertInvestment,
      id,
    };
    this.investments.set(id, investment);
    return investment;
  }

  async getFamilyFinancialServices(familyId: string): Promise<FinancialService[]> {
    return Array.from(this.financialServices.values()).filter(
      service => service.familyId === familyId
    );
  }

  async createFinancialService(insertService: InsertFinancialService): Promise<FinancialService> {
    const id = randomUUID();
    const service: FinancialService = {
      ...insertService,
      id,
    };
    this.financialServices.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
