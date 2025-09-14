import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

interface SmartAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

interface SmartAlertsProps {
  familyId: string;
}

const alertStyles: Record<string, { bg: string; border: string; icon: string; iconColor: string }> = {
  overspending: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "fas fa-exclamation-triangle",
    iconColor: "text-red-600",
  },
  scam: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "fas fa-shield-alt",
    iconColor: "text-yellow-600",
  },
  achievement: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "fas fa-chart-line",
    iconColor: "text-green-600",
  },
  goal_progress: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "fas fa-bullseye",
    iconColor: "text-blue-600",
  },
};

const alertTextColors: Record<string, { title: string; message: string; button: string }> = {
  overspending: {
    title: "text-red-800",
    message: "text-red-600",
    button: "text-red-700 hover:text-red-800",
  },
  scam: {
    title: "text-yellow-800",
    message: "text-yellow-600",
    button: "text-yellow-700 hover:text-yellow-800",
  },
  achievement: {
    title: "text-green-800",
    message: "text-green-600",
    button: "text-green-700 hover:text-green-800",
  },
  goal_progress: {
    title: "text-blue-800",
    message: "text-blue-600",
    button: "text-blue-700 hover:text-blue-800",
  },
};

export default function SmartAlerts({ familyId }: SmartAlertsProps) {
  const queryClient = useQueryClient();
  
  const { data: alerts, isLoading } = useQuery<SmartAlert[]>({
    queryKey: ["/api/family", familyId, "alerts"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("PATCH", `/api/alerts/${alertId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family", familyId, "alerts"] });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-muted/50 rounded-lg"></div>
              <div className="h-16 bg-muted/50 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadAlerts = alerts?.filter(alert => !alert.isRead) || [];

  return (
    <Card data-testid="smart-alerts">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-alerts-title">Smart Alerts</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-alert-settings">
            <i className="fas fa-cog"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unreadAlerts.length === 0 ? (
            <div className="text-center py-6">
              <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
              <p className="text-muted-foreground" data-testid="text-no-alerts">
                All caught up! No new alerts.
              </p>
            </div>
          ) : (
            unreadAlerts.map((alert) => {
              const style = alertStyles[alert.type] || alertStyles.achievement;
              const textColor = alertTextColors[alert.type] || alertTextColors.achievement;

              return (
                <div
                  key={alert.id}
                  className={`${style.bg} border ${style.border} rounded-lg p-4`}
                  data-testid={`alert-card-${alert.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${style.icon} ${style.iconColor} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${textColor.title}`} data-testid={`text-alert-title-${alert.id}`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm ${textColor.message} mb-2`} data-testid={`text-alert-message-${alert.id}`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          className={`${textColor.button} text-sm font-medium`}
                          data-testid={`button-alert-action-${alert.id}`}
                        >
                          {alert.type === "overspending" 
                            ? "Review Transactions" 
                            : alert.type === "scam"
                            ? "Learn More"
                            : "Celebrate"
                          }
                        </button>
                        <button
                          onClick={() => markAsReadMutation.mutate(alert.id)}
                          className="text-muted-foreground hover:text-foreground text-sm"
                          data-testid={`button-mark-read-${alert.id}`}
                        >
                          Mark as read
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
