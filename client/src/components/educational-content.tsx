import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  ageGroup: string;
  duration: number;
  difficulty: string;
  icon: string;
  isAIGenerated: boolean;
}

interface LearningProgress {
  id: string;
  memberId: string;
  contentId: string;
  progress: number;
  completed: boolean;
}

export default function EducationalContent() {
  const { data: content, isLoading } = useQuery<EducationalContent[]>({
    queryKey: ["/api/educational-content"],
  });

  // Mock learning progress for demo
  const mockProgress = [
    { memberId: "member-3", name: "Alex", progress: 75, currentLesson: "Basic Investing" },
    { memberId: "member-4", name: "Emma", progress: 45, currentLesson: "Money Basics" },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-muted/50 rounded-lg"></div>
              <div className="h-32 bg-muted/50 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="educational-content">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-education-title">Financial Education</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-all-lessons">
            View All Lessons
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {content?.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className={`rounded-lg p-4 border border-border ${
                item.type === "lesson"
                  ? "bg-gradient-to-br from-primary/10 to-accent/10"
                  : "bg-gradient-to-br from-secondary/10 to-yellow-100"
              }`}
              data-testid={`content-card-${item.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${item.type === "lesson" ? "bg-primary" : "bg-secondary"} rounded-lg flex items-center justify-center`}>
                  <i className={`fas fa-${item.icon} text-white`}></i>
                </div>
                <Badge
                  variant={item.type === "lesson" ? "secondary" : "default"}
                  className={item.type === "lesson" ? "bg-secondary text-secondary-foreground" : "bg-yellow-500 text-white"}
                  data-testid={`badge-content-type-${item.id}`}
                >
                  {item.isAIGenerated ? "AI Recommended" : item.type === "game" ? "Family Game" : "Lesson"}
                </Badge>
              </div>
              
              <h4 className="font-semibold text-foreground mb-2" data-testid={`text-content-title-${item.id}`}>
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3" data-testid={`text-content-description-${item.id}`}>
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <i className={item.type === "lesson" ? "fas fa-clock" : "fas fa-users"}></i>
                  <span data-testid={`text-content-meta-${item.id}`}>
                    {item.type === "lesson" ? `${item.duration} min` : item.ageGroup}
                  </span>
                </div>
                <Button
                  size="sm"
                  className={
                    item.type === "lesson"
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  }
                  data-testid={`button-start-content-${item.id}`}
                >
                  {item.type === "lesson" ? "Start Learning" : "Join Game"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Learning progress */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-semibold text-foreground mb-4" data-testid="text-learning-progress-title">
            Learning Progress
          </h4>
          <div className="space-y-3">
            {mockProgress.map((member) => (
              <div key={member.memberId} className="flex items-center justify-between" data-testid={`progress-member-${member.memberId}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground" data-testid={`text-member-name-${member.memberId}`}>
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-member-lesson-${member.memberId}`}>
                      {member.progress === 100 ? "Completed:" : "Learning:"} {member.currentLesson}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={member.progress} className="w-16" data-testid={`progress-bar-${member.memberId}`} />
                  <span className="text-sm text-muted-foreground" data-testid={`text-progress-percentage-${member.memberId}`}>
                    {member.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
