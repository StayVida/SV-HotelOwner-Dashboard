import { StatCard } from "@/components/StatCard";
import { BedDouble, Calendar, DollarSign, Users } from "lucide-react";
import { MonthlyBookingsData } from "@/api/bookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface StatsOverviewProps {
  data: MonthlyBookingsData | null;
  loading: boolean;
}

export function StatsOverview({ data, loading }: StatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-7 border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Bookings"
        value={data?.totalMonthlyBookings ?? 0}
        icon={Calendar}
        trend={data?.bookingDifference ?? "No data"}
        trendUp={data?.bookingDifference?.startsWith("+") ?? true}
      />
      <StatCard
        title="Available Rooms"
        value={data?.AvailableRooms ?? 0}
        icon={BedDouble}
        trend={`${data?.roomsOccupied ?? 0} rooms occupied`}
        trendUp={true}
      />
      <StatCard
        title="Total Guests"
        value={data?.totalGuests ?? 0}
        icon={Users}
        trend={data?.guestDifference ?? "No data"}
        trendUp={data?.guestDifference?.startsWith("+") ?? true}
      />
      <StatCard
        title="Total Revenue"
        value={`₹${data?.totalRevenue?.toLocaleString() ?? "0"}`}
        icon={DollarSign}
        trend={data?.revenueDifference ?? "No data"}
        trendUp={data?.revenueDifference?.startsWith("+") ?? true}
      />
    </div>
  );
}

export default StatsOverview;


