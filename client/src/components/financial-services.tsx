import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialService {
  id: string;
  type: string;
  name: string;
  status: string;
  amount: string;
  monthlyPayment: string;
  details: any;
}

interface FinancialServicesProps {
  familyId: string;
}

const serviceIcons: Record<string, string> = {
  insurance: "fas fa-shield-alt",
  loan: "fas fa-home",
  credit_score: "fas fa-chart-bar",
  personal_loan: "fas fa-hand-holding-usd",
};

const serviceColors: Record<string, string> = {
  insurance: "bg-green-600",
  loan: "bg-blue-600",
  credit_score: "bg-green-600",
  personal_loan: "bg-accent",
};

export default function FinancialServices({ familyId }: FinancialServicesProps) {
  const { data: services, isLoading } = useQuery<FinancialService[]>({
    queryKey: ["/api/family", familyId, "financial-services"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-muted/30 rounded-lg"></div>
              <div className="h-12 bg-muted/30 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add personal loan option if not in services
  const allServices = [
    ...(services || []),
    {
      id: "personal-loan",
      type: "personal_loan",
      name: "Personal Loan",
      status: "pre-approved",
      amount: "500000",
      monthlyPayment: "0",
      details: { eligibility: "Pre-approved up to ₹5L" },
    },
  ];

  return (
    <Card data-testid="financial-services">
      <CardHeader>
        <CardTitle data-testid="text-services-title">Financial Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allServices.map((service) => {
            const isSpecial = service.type === "credit_score" || service.type === "personal_loan";
            
            return (
              <div
                key={service.id}
                className={`${
                  isSpecial && service.type === "credit_score"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    : "bg-muted/30"
                } rounded-lg p-4 ${isSpecial && service.type === "credit_score" ? "border" : ""}`}
                data-testid={`service-card-${service.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${serviceColors[service.type]} rounded-lg flex items-center justify-center`}>
                      <i className={`${serviceIcons[service.type]} text-white text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground" data-testid={`text-service-name-${service.id}`}>
                        {service.name}
                      </h4>
                      <p className="text-xs text-muted-foreground" data-testid={`text-service-details-${service.id}`}>
                        {service.type === "insurance" 
                          ? `${service.details?.policies || 3} policies active`
                          : service.type === "loan"
                          ? `₹${parseFloat(service.monthlyPayment).toLocaleString('en-IN')}/month EMI`
                          : service.type === "credit_score"
                          ? `${service.details?.rating} • Last updated: ${service.details?.lastUpdated}`
                          : service.details?.eligibility
                        }
                      </p>
                    </div>
                  </div>
                  
                  {service.type === "credit_score" ? (
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600" data-testid={`text-credit-score-${service.id}`}>
                        {service.amount}
                      </p>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-service-action-${service.id}`}
                    >
                      {service.type === "personal_loan" ? "Apply" : service.type === "loan" ? "Details" : "Manage"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
