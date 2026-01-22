import { Calendar, Clock, CreditCard } from "lucide-react";
import { BookingDetailsData } from "@/api/bookings";
import { Separator } from "@/components/ui/separator";

interface BookingStayInfoProps {
  booking: BookingDetailsData;
}

export const BookingStayInfo = ({ booking }: BookingStayInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground tracking-tight">Stay & Payment Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Check-in</p>
            <p className="text-sm font-bold text-foreground">{booking.checkIn}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-accent/30 border border-border/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Check-out</p>
            <p className="text-sm font-bold text-foreground">{booking.checkOut}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-accent/30 border border-border/50 sm:col-span-2 lg:col-span-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Payment Type</p>
            <p className="text-sm font-bold text-foreground">{booking.payment_type || "N/A"}</p>
          </div>
        </div>
      </div>

       <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/50 space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
                <span className="text-muted-foreground font-medium">Room Price</span>
                <span className="font-bold">₹{booking["Room Price"]}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">Taxes</span>
                <span className="font-bold">₹{booking.tax_amount}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">Platform Fee</span>
                <span className="font-bold">₹{booking.platformFee}</span>
            </div>
            <Separator className="bg-border/40" />
            <div className="flex justify-between items-center text-base sm:text-xl font-black pt-1">
                <span className="tracking-tight">Gross Amount</span>
                <span className="text-primary tracking-tight">₹{booking["gross amount to be paid by customer"]}</span>
            </div>
             <div className="flex justify-between items-center text-xs sm:text-sm mt-3 pt-2 border-t border-border/30">
                <span className="text-muted-foreground font-medium">Amount Paid</span>
                <span className="font-bold text-green-600">₹{booking["amount paid by customer"]}</span>
            </div>
             <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">Payment Left</span>
                <span className="font-extrabold text-orange-500">₹{booking["payment left to pay customer"]}</span>
            </div>
        </div>

    </div>
  );
};
