import { User, Phone, MapPin } from "lucide-react";
import { BookingDetailsData } from "@/api/bookings";

interface BookingGuestInfoProps {
  booking: BookingDetailsData;
}

export const BookingGuestInfo = ({ booking }: BookingGuestInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground tracking-tight">Guest Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-accent/30 border border-border/50">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Guest Name</p>
            <p className="text-sm font-bold text-foreground truncate">{booking.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-accent/30 border border-border/50">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Phone</p>
            <p className="text-sm font-bold text-foreground truncate">{booking.phone_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-accent/30 border border-border/50 sm:col-span-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Room Details (ID)</p>
            <p className="text-sm font-bold text-foreground truncate">{booking.room_ID}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
