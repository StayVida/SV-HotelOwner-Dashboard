import { Card } from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UpcomingBookingData } from "@/api/bookings";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentBookingsProps {
  data: UpcomingBookingData[];
  loading: boolean;
  onBookingClick?: (booking: UpcomingBookingData) => void;
}

export function RecentBookings({ data, loading, onBookingClick }: RecentBookingsProps) {
  if (loading) {
    return (
      <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-accent/10 border border-border/50 gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Recent Bookings</h3>
        <p className="text-sm text-muted-foreground font-medium">Latest reservations from your guests</p>
      </div>

      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((booking, index) => (
            <div
              key={booking.booking_ID}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 gap-3 sm:gap-0 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onBookingClick?.(booking)}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300 shrink-0">
                  <BedDouble className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground tracking-tight truncate">{booking.name}</p>
                  <p className="text-sm text-muted-foreground font-medium truncate">Room: {booking.room_NO}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="text-left sm:text-right flex-1 sm:flex-none">
                  <p className="text-sm font-semibold text-foreground whitespace-nowrap">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Check-in</p>
                </div>
                <Badge
                  variant={booking.booking_Status === "CheckIn" ? "default" : "secondary"}
                  className={cn(
                    "px-4 py-1.5 font-semibold tracking-wide",
                    booking.booking_Status === "CheckIn" 
                      ? "gradient-primary text-primary-foreground shadow-md" 
                      : ""
                  )}
                >
                  {booking.booking_Status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-accent/5 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground font-medium">No upcoming bookings found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default RecentBookings;


