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
      <div className="relative overflow-hidden rounded-2xl border border-border/50 p-4 sm:p-5 bg-gradient-to-r from-accent/20 to-accent/5">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 text-center sm:text-left min-w-0 w-full sm:w-auto">
            <Avatar className="h-14 w-14 sm:h-12 sm:w-12 shrink-0 border-2 border-primary/20">
              <AvatarFallback className="text-base sm:text-sm font-bold">
                {booking.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 w-full sm:w-auto">
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight truncate mb-1">{booking.name}</DialogTitle>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                 <p className="text-xs sm:text-sm text-muted-foreground font-semibold">ID: {booking.booking_ID}</p>
                  <Badge variant="outline" className="text-[10px] sm:text-xs bg-background/50 h-5 sm:h-6">{booking.hotel_name}</Badge>
                  <Badge variant="outline" className="text-[10px] sm:text-xs bg-background/50 h-5 sm:h-6">Room: {booking.RoomNumber}</Badge>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <Badge
                className={cn(
                "px-5 py-2 font-bold tracking-wider text-xs sm:text-sm uppercase w-full sm:w-auto text-center justify-center",
                booking.booking_Status === "Confirmed" || booking.booking_Status === "CheckIn"
                    ? "gradient-primary text-primary-foreground shadow-lg" 
                    : "bg-yellow-500 text-white shadow-lg"
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
