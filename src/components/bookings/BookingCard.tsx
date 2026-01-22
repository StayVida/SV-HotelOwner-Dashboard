import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, Phone, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingData } from "@/api/bookings";

interface BookingCardProps {
  booking: BookingData;
  index: number;
  onViewDetails: (booking: BookingData) => void;
}

export const BookingCard = ({ booking, index, onViewDetails }: BookingCardProps) => {
  return (
    <Card 
      className="group p-5 sm:p-7 hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{booking.name}</h3>
              <Badge
                variant={booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn" ? "default" : "secondary"}
                className={cn(
                  "px-3 sm:px-4 py-1 sm:py-1.5 font-semibold tracking-wide text-xs sm:text-sm",
                  booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn"
                    ? "gradient-primary text-primary-foreground shadow-md" 
                    : ""
                )}
              >
                {booking.booking_Status}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Booking ID: {booking.booking_ID}</p>
          </div>
          
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
            <div className="flex flex-col sm:items-end">
              <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">₹{booking["gross amount"]}</p>
              <p className="text-[10px] sm:text-sm font-semibold text-orange-500">Left: ₹{booking["payment left"]}</p>
            </div>
            <Badge variant="outline" className={cn(
                "text-[10px] sm:text-xs h-6 sm:h-7",
                booking.payment_Status === "Completed" ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
            )}>
                {booking.payment_Status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Room ID</p>
              <p className="text-xs sm:text-sm font-bold text-foreground truncate" title={booking.room_ID}>{booking.room_ID}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Check-in</p>
              <p className="text-xs sm:text-sm font-bold text-foreground">{booking.checkIn}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Check-out</p>
              <p className="text-xs sm:text-sm font-bold text-foreground">{booking.checkOut}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onViewDetails(booking)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10 hover:border-primary transition-all duration-300 w-full sm:w-auto text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
