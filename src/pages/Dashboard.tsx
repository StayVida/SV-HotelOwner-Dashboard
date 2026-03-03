import { useEffect, useState } from "react";
import StatsOverview from "@/components/dashboard/StatsOverview";
import RecentBookings from "@/components/dashboard/RecentBookings";
import { fetchMonthlyBookings, MonthlyBookingsData, fetchUpcomingBookings, UpcomingBookingData } from "@/api/bookings";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { fetchHotels, HotelData } from "@/api/hotel";
import { AlertTriangle, Clock } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState<MonthlyBookingsData | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [statusBannerVisible, setStatusBannerVisible] = useState(true);

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

    const getHotelStatus = async () => {
      try {
        const hotels = await fetchHotels();
        if (hotels && hotels.length > 0) {
          setHotel(hotels[0]);
        }
      } catch (error) {
        console.error("Failed to fetch hotel status:", error);
      }
    };

    getStats();
    getUpcomingBookings();
    getHotelStatus();
  }, []);

  const handleBookingClick = (booking: UpcomingBookingData) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const isPending = hotel?.status?.toLowerCase() === "pending";
  const isRejected = hotel?.status?.toLowerCase() === "rejected";
  const showBanner = statusBannerVisible && (isPending || isRejected);

  return (
    <div className="space-y-8 animate-fade-in">

      {showBanner && (
        <div
          className={`relative flex items-start gap-4 rounded-xl border px-5 py-4 shadow-sm ${isPending
              ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
              : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
            }`}
        >
          <div className={`mt-0.5 shrink-0 ${isPending ? "text-amber-500" : "text-red-500"}`}>
            {isPending ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${isPending ? "text-amber-800 dark:text-amber-300" : "text-red-800 dark:text-red-300"}`}>
              {isPending ? "Verification Pending" : "Hotel Rejected"}
            </p>
            <p className={`text-sm mt-0.5 ${isPending ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400"}`}>
              {isPending
                ? "Your hotel is under review. Admin will verify you soon."
                : hotel?.remark
                  ? `Reason: ${hotel.remark}`
                  : "Your hotel registration was rejected. Please contact support for more details."}
            </p>
          </div>
        </div>
      )}

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
