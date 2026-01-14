import { User, Phone, MapPin } from "lucide-react";
import { BookingDetailsData } from "@/api/bookings";

interface BookingGuestInfoProps {
  booking: BookingDetailsData;
}

export const BookingGuestInfo = ({ booking }: BookingGuestInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground tracking-tight">Guest Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Guest Name</p>
            <p className="text-sm font-bold text-foreground">{booking.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Phone</p>
            <p className="text-sm font-bold text-foreground">{booking.phone_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50 md:col-span-2">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Room Details</p>
            <p className="text-sm font-bold text-foreground">{booking.room_Type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
