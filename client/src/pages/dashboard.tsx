import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import FamilyOverview from "@/components/family-overview";
import GoalTracker from "@/components/goal-tracker";
import BudgetTracker from "@/components/budget-tracker";
import EducationalContent from "@/components/educational-content";
import SmartAlerts from "@/components/smart-alerts";
import InvestmentOptions from "@/components/investment-options";
import FinancialServices from "@/components/financial-services";
import AIAssistant from "@/components/ai-assistant";
import MobileNavigation from "@/components/mobile-navigation";

interface FamilyData {
  family: {
    id: string;
    name: string;
    totalBalance: string;
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    age?: number;
    balance: string;
    avatar: string;
    status: string;
  }>;
}

export default function Dashboard() {
  const isMobile = useIsMobile();
  
  const { data: familyData, isLoading } = useQuery({
    queryKey: ["/api/family", "family-1"],
  }) as { data: FamilyData | undefined; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background font-sans min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-coins text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Aetherius</h1>
                <p className="text-sm text-muted-foreground">Family Financial Hub</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#" className="text-foreground hover:text-primary font-medium" data-testid="nav-dashboard">Dashboard</a>
                <a href="#" className="text-muted-foreground hover:text-primary" data-testid="nav-goals">Goals</a>
                <a href="#" className="text-muted-foreground hover:text-primary" data-testid="nav-budget">Budget</a>
                <a href="#" className="text-muted-foreground hover:text-primary" data-testid="nav-learn">Learn</a>
                <a href="#" className="text-muted-foreground hover:text-primary" data-testid="nav-invest">Invest</a>
              </nav>
              
              <div className="flex items-center space-x-3">
                <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-notifications">
                  <i className="fas fa-bell text-lg"></i>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></span>
                </button>
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                  <i className="fas fa-user text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}

      <main className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Family Overview */}
        <FamilyOverview familyData={familyData} />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Goals and Budget */}
          <div className="lg:col-span-2 space-y-6">
            <GoalTracker familyId="family-1" />
            <BudgetTracker familyId="family-1" />
            <EducationalContent />
          </div>

          {/* Right Column - Alerts, Investments, and Quick Actions */}
          <div className="space-y-6">
            <SmartAlerts familyId="family-1" />
            <InvestmentOptions />
            <FinancialServices familyId="family-1" />
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}
