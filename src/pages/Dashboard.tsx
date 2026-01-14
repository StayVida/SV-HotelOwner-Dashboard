import { useEffect, useState } from "react";
import StatsOverview from "@/components/dashboard/StatsOverview";
import RecentBookings from "@/components/dashboard/RecentBookings";
import { fetchMonthlyBookings, MonthlyBookingsData, fetchUpcomingBookings, UpcomingBookingData } from "@/api/bookings";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";

const Dashboard = () => {
  const [stats, setStats] = useState<MonthlyBookingsData | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  
  // Dialog state
  const [selectedBooking, setSelectedBooking] = useState<UpcomingBookingData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchMonthlyBookings();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const getUpcomingBookings = async () => {
      try {
        const data = await fetchUpcomingBookings();
        setUpcomingBookings(data);
      } catch (error) {
        console.error("Failed to fetch upcoming bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    getStats();
    getUpcomingBookings();
  }, []);

  const handleBookingClick = (booking: UpcomingBookingData) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground text-lg font-medium">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        <StatsOverview data={stats} loading={loading} />

        <RecentBookings 
          data={upcomingBookings} 
          loading={bookingsLoading}
          onBookingClick={handleBookingClick}
        />

        <BookingDetailsDialog 
          booking={selectedBooking}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
  );
};

export default Dashboard;
