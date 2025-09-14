import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: string;
  month: string;
  totalBudget: string;
  totalSpent: string;
  categories: {
    food: { budget: number; spent: number };
    transport: { budget: number; spent: number };
    entertainment: { budget: number; spent: number };
    shopping: { budget: number; spent: number };
    utilities: { budget: number; spent: number };
    healthcare: { budget: number; spent: number };
  };
}

interface BudgetTrackerProps {
  familyId: string;
}

const categoryIcons: Record<string, string> = {
  food: "fas fa-utensils",
  transport: "fas fa-car",
  entertainment: "fas fa-gamepad",
  shopping: "fas fa-shopping-cart",
  utilities: "fas fa-home",
  healthcare: "fas fa-heart",
};

const categoryColors: Record<string, string> = {
  food: "bg-secondary",
  transport: "bg-blue-600",
  entertainment: "bg-purple-600",
  shopping: "bg-green-600",
  utilities: "bg-yellow-600",
  healthcare: "bg-red-600",
};

export default function BudgetTracker({ familyId }: BudgetTrackerProps) {
  const currentMonth = "2024-11";
  
  const { data: budget, isLoading } = useQuery<Budget>({
    queryKey: ["/api/family", familyId, "budget", currentMonth],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted/50 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted/30 rounded-lg"></div>
              <div className="h-16 bg-muted/30 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!budget) return null;

  const totalBudget = parseFloat(budget.totalBudget);
  const totalSpent = parseFloat(budget.totalSpent);
  const remaining = totalBudget - totalSpent;
  const percentage = (totalSpent / totalBudget) * 100;

  return (
    <Card data-testid="budget-tracker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-budget-title">November Budget</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-budget-details">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Budget overview */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-spent">
                ₹{totalSpent.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-xl font-semibold text-foreground" data-testid="text-total-budget">
                ₹{totalBudget.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <Progress value={percentage} className="mb-2" data-testid="progress-total-budget" />

          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium" data-testid="text-remaining-budget">
              ₹{remaining.toLocaleString('en-IN')} remaining
            </span>
            <span className="text-muted-foreground" data-testid="text-budget-percentage">
              {percentage.toFixed(1)}% used
            </span>
          </div>
        </div>

        {/* Spending categories */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(budget.categories || {}).map(([category, data]) => {
            if (!data || data.budget === 0) return null;
            
            const categoryPercentage = (data.spent / data.budget) * 100;
            
            return (
              <div
                key={category}
                className="bg-muted/30 rounded-lg p-3"
                data-testid={`category-card-${category}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <i className={`${categoryIcons[category]} ${categoryColors[category].replace('bg-', 'text-')}`}></i>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {category}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground" data-testid={`text-category-spent-${category}`}>
                    ₹{data.spent.toLocaleString('en-IN')}
                  </span>
                </div>
                <Progress 
                  value={categoryPercentage} 
                  className={`h-2 ${categoryColors[category]}`}
                  data-testid={`progress-category-${category}`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
