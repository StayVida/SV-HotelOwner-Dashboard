import { StatCard } from "@/components/StatCard";
import { BedDouble, Calendar, DollarSign, Users } from "lucide-react";

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Bookings"
        value={156}
        icon={Calendar}
        trend="+12% from last month"
        trendUp={true}
      />
      <StatCard
        title="Available Rooms"
        value={24}
        icon={BedDouble}
        trend="8 rooms occupied"
        trendUp={true}
      />
      <StatCard
        title="Total Guests"
        value={342}
        icon={Users}
        trend="+8% from last month"
        trendUp={true}
      />
      <StatCard
        title="Revenue"
        value="$45.2K"
        icon={DollarSign}
        trend="+15% from last month"
        trendUp={true}
      />
    </div>
  );
}

export default StatsOverview;


