import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FamilyGoal {
  id: string;
  name: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
  category: string;
  icon: string;
  contributors: string[];
}

interface GoalTrackerProps {
  familyId: string;
}

const iconMap: Record<string, string> = {
  plane: "fas fa-plane",
  "shield-alt": "fas fa-shield-alt",
  "graduation-cap": "fas fa-graduation-cap",
};

const categoryColors: Record<string, string> = {
  vacation: "bg-secondary",
  emergency: "bg-green-600",
  education: "bg-accent",
};

export default function GoalTracker({ familyId }: GoalTrackerProps) {
  const { data: goals, isLoading } = useQuery<FamilyGoal[]>({
    queryKey: ["/api/family", familyId, "goals"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-muted/50 rounded-lg"></div>
              <div className="h-20 bg-muted/50 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="goal-tracker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-goals-title">Family Goals</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-add-goal">
            <i className="fas fa-plus mr-1"></i>
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals?.map((goal) => {
            const current = parseFloat(goal.currentAmount);
            const target = parseFloat(goal.targetAmount);
            const percentage = Math.round((current / target) * 100);
            const remaining = target - current;
            const deadline = new Date(goal.deadline);
            const monthsLeft = Math.max(
              0,
              Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
            );

            return (
              <div
                key={goal.id}
                className="bg-muted/50 rounded-lg p-4"
                data-testid={`goal-card-${goal.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${categoryColors[goal.category] || "bg-primary"} rounded-lg flex items-center justify-center`}>
                      <i className={`${iconMap[goal.icon] || "fas fa-target"} text-white`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground" data-testid={`text-goal-name-${goal.id}`}>
                        {goal.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-goal-progress-${goal.id}`}>
                        ₹{current.toLocaleString('en-IN')} of ₹{target.toLocaleString('en-IN')} saved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground" data-testid={`text-goal-percentage-${goal.id}`}>
                      {percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-goal-deadline-${goal.id}`}>
                      {monthsLeft > 0 ? `${monthsLeft} months left` : "Overdue"}
                    </p>
                  </div>
                </div>

                <Progress value={percentage} className="mb-3" data-testid={`progress-goal-${goal.id}`} />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      Contributors: {goal.contributors.length}/4
                    </span>
                    <div className="flex -space-x-2">
                      {goal.contributors.slice(0, 4).map((_, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-contribute-${goal.id}`}
                  >
                    Add ₹5,000
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
