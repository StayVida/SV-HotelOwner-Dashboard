import { Card } from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const recentBookings = [
  { id: "BK001", guest: "John Smith", room: "Deluxe Suite 101", checkIn: "2025-10-08", status: "confirmed" },
  { id: "BK002", guest: "Sarah Johnson", room: "Standard Room 205", checkIn: "2025-10-09", status: "pending" },
  { id: "BK003", guest: "Michael Brown", room: "Ocean View 301", checkIn: "2025-10-10", status: "confirmed" },
  { id: "BK004", guest: "Emily Davis", room: "Garden Suite 102", checkIn: "2025-10-12", status: "confirmed" },
];

export function RecentBookings() {
  return (
    <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Recent Bookings</h3>
        <p className="text-sm text-muted-foreground font-medium">Latest reservations from your guests</p>
      </div>

      <div className="space-y-3">
        {recentBookings.map((booking, index) => (
          <div
            key={booking.id}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 gap-3 sm:gap-0"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300 shrink-0">
                <BedDouble className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground tracking-tight truncate">{booking.guest}</p>
                <p className="text-sm text-muted-foreground font-medium truncate">{booking.room}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-none">
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">{booking.checkIn}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Check-in</p>
              </div>
              <Badge
                variant={booking.status === "confirmed" ? "default" : "secondary"}
                className={cn(
                  "px-4 py-1.5 font-semibold tracking-wide",
                  booking.status === "confirmed" 
                    ? "gradient-primary text-primary-foreground shadow-md" 
                    : ""
                )}
              >
                {booking.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentBookings;


