export default function MobileNavigation() {
  return (
    <div className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50" data-testid="mobile-navigation">
      <div className="flex justify-around py-2">
        <button className="flex flex-col items-center p-2 text-primary" data-testid="mobile-nav-home">
          <i className="fas fa-home text-lg"></i>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center p-2 text-muted-foreground" data-testid="mobile-nav-goals">
          <i className="fas fa-bullseye text-lg"></i>
          <span className="text-xs mt-1">Goals</span>
        </button>
        <button className="flex flex-col items-center p-2 text-muted-foreground" data-testid="mobile-nav-budget">
          <i className="fas fa-chart-pie text-lg"></i>
          <span className="text-xs mt-1">Budget</span>
        </button>
        <button className="flex flex-col items-center p-2 text-muted-foreground" data-testid="mobile-nav-learn">
          <i className="fas fa-graduation-cap text-lg"></i>
          <span className="text-xs mt-1">Learn</span>
        </button>
      </div>
    </div>
  );
}
