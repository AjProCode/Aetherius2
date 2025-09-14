import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface FamilyOverviewProps {
  familyData?: FamilyData;
}

const avatarMap: Record<string, string> = {
  dad: "👨‍💼",
  mom: "👩‍💼", 
  alex: "👦",
  emma: "👧"
};

const statusColors: Record<string, string> = {
  "Top Saver": "bg-yellow-100 text-yellow-800",
  "Learning": "bg-purple-100 text-purple-800",
  "Saving Goal": "bg-blue-100 text-blue-800",
  default: "bg-green-100 text-green-800"
};

export default function FamilyOverview({ familyData }: FamilyOverviewProps) {
  if (!familyData) return null;

  const { family, members } = familyData;

  return (
    <section className="mb-8" data-testid="family-overview">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-family-name">
            {family.name}
          </h2>
          <p className="text-muted-foreground">
            {members.length} members • Total Balance: 
            <span className="font-semibold text-primary ml-1" data-testid="text-total-balance">
              ₹{parseFloat(family.totalBalance).toLocaleString('en-IN')}
            </span>
          </p>
        </div>
        <Button data-testid="button-add-member">
          <i className="fas fa-user-plus mr-2"></i>
          Add Member
        </Button>
      </div>

      {/* Family member cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {members.map((member) => (
          <Card key={member.id} className="card-hover" data-testid={`card-member-${member.id}`}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-primary/10 flex items-center justify-center text-2xl">
                  {avatarMap[member.avatar] || "👤"}
                </div>
                <h3 className="font-semibold text-foreground" data-testid={`text-member-name-${member.id}`}>
                  {member.name}
                  {member.age && ` (${member.age})`}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid={`text-member-role-${member.id}`}>
                  {member.role}
                </p>
                <p className="text-lg font-bold text-primary mt-1" data-testid={`text-member-balance-${member.id}`}>
                  ₹{parseFloat(member.balance).toLocaleString('en-IN')}
                </p>
                <div className="flex justify-center mt-2">
                  <Badge 
                    className={statusColors[member.status] || statusColors.default}
                    data-testid={`badge-member-status-${member.id}`}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Family achievements */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-trophy text-primary-foreground text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-foreground" data-testid="text-achievement-title">
                Family Achievement Unlocked!
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-achievement-description">
                Your family saved ₹15,000 this month - 125% of your goal!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" data-testid="button-view-reward">
              View Reward
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-close-achievement">
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
