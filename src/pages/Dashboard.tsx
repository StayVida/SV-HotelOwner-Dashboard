import StatsOverview from "@/components/dashboard/StatsOverview";
import RecentBookings from "@/components/dashboard/RecentBookings";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground text-lg font-medium">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        <StatsOverview />

        <RecentBookings />
      </div>
  );
};

export default Dashboard;
