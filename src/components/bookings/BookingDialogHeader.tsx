import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BookingDetailsData } from "@/api/bookings";

interface BookingDialogHeaderProps {
  booking: BookingDetailsData;
}

export const BookingDialogHeader = ({ booking }: BookingDialogHeaderProps) => {
  return (
    <DialogHeader>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 p-5 bg-gradient-to-r from-accent/20 to-accent/5">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-sm font-semibold">
                {booking.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-bold tracking-tight truncate">{booking.name}</DialogTitle>
              <div className="flex items-center gap-2">
                 <p className="text-sm text-muted-foreground truncate font-medium">Booking ID: {booking.booking_ID}</p>
                  <Badge variant="outline" className="text-xs">{booking.hotel_name}</Badge>
                  <Badge variant="outline" className="text-xs">Room: {booking.room_NO}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
                className={cn(
                "px-4 py-1.5 font-semibold tracking-wide",
                booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn"
                    ? "gradient-primary text-primary-foreground shadow-md" 
                    : "bg-yellow-500 text-white shadow-md"
                )}
            >
                {booking.booking_Status}
            </Badge>
          </div>
        </div>
      </div>
    </DialogHeader>
  );
};
