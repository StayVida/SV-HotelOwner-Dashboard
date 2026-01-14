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
      className="group p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{booking.name}</h3>
                <Badge
                  variant={booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn" ? "default" : "secondary"}
                  className={cn(
                    "px-4 py-1.5 font-semibold tracking-wide",
                    booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn"
                      ? "gradient-primary text-primary-foreground shadow-md" 
                      : ""
                  )}
                >
                  {booking.booking_Status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Booking ID: {booking.booking_ID}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary tracking-tight">₹{booking["Gross Amount"]}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                 <Badge variant="outline" className={cn(
                     "text-xs",
                     booking.payment_Status === "Completed" ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                 )}>
                     {booking.payment_Status}
                 </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Room ID</p>
                <p className="text-sm font-bold text-foreground truncate" title={booking.room_ID}>{booking.room_ID}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-in</p>
                <p className="text-sm font-bold text-foreground">{booking.checkIn}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-out</p>
                <p className="text-sm font-bold text-foreground">{booking.checkOut}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Phone</p>
                <p className="text-sm font-bold text-foreground truncate">{booking.phone_number}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => onViewDetails(booking)}
              variant="outline"
              className="border-primary/20 hover:bg-primary/10 hover:border-primary transition-all duration-300 w-full md:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
