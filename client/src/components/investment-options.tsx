import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Investment {
  id: string;
  name: string;
  type: string;
  returns: string;
  risk: string;
  description: string;
  minInvestment: string;
}

const investmentStyles: Record<string, { gradient: string; iconBg: string; icon: string; buttonBg: string }> = {
  sip: {
    gradient: "bg-gradient-to-r from-primary/5 to-accent/5",
    iconBg: "bg-primary",
    icon: "fas fa-chart-line",
    buttonBg: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  fd: {
    gradient: "bg-gradient-to-r from-blue-50 to-cyan-50",
    iconBg: "bg-blue-600",
    icon: "fas fa-university",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  gold: {
    gradient: "bg-gradient-to-r from-yellow-50 to-orange-50",
    iconBg: "bg-yellow-600",
    icon: "fas fa-coins",
    buttonBg: "bg-yellow-600 hover:bg-yellow-700 text-white",
  },
};

export default function InvestmentOptions() {
  const { data: investments, isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-24 bg-muted/50 rounded-lg"></div>
              <div className="h-24 bg-muted/50 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="investment-options">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-investments-title">Investment Options</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-explore-investments">
            Explore All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments?.map((investment) => {
            const style = investmentStyles[investment.type] || investmentStyles.sip;
            const returns = parseFloat(investment.returns);
            const minInvestment = parseFloat(investment.minInvestment);

            return (
              <div
                key={investment.id}
                className={`${style.gradient} rounded-lg p-4 border border-border`}
                data-testid={`investment-card-${investment.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${style.iconBg} rounded-lg flex items-center justify-center`}>
                      <i className={`${style.icon} text-white text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground" data-testid={`text-investment-name-${investment.id}`}>
                        {investment.name}
                      </h4>
                      <p className="text-xs text-muted-foreground" data-testid={`text-investment-type-${investment.id}`}>
                        {investment.type === "sip" 
                          ? "Diversified Equity Fund"
                          : investment.type === "fd"
                          ? "Safe & Guaranteed"
                          : "Start from ₹100"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      investment.type === "sip" 
                        ? "text-green-600"
                        : investment.type === "fd"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`} data-testid={`text-investment-returns-${investment.id}`}>
                      {investment.type === "gold" ? `₹${(6420).toLocaleString('en-IN')}` : `+${returns}%`}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-investment-period-${investment.id}`}>
                      {investment.type === "gold" ? "per gram" : 
                       investment.type === "fd" ? "Annual interest" : "1Y returns"}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-investment-description-${investment.id}`}>
                  {investment.description}
                </p>
                
                <Button
                  className={`w-full ${style.buttonBg} py-2 px-4 rounded-lg text-sm font-medium`}
                  data-testid={`button-invest-${investment.id}`}
                >
                  {investment.type === "sip" 
                    ? "Start SIP"
                    : investment.type === "fd"
                    ? "Open FD"
                    : "Buy Gold"
                  }
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
