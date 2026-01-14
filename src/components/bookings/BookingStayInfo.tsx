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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-in</p>
            <p className="text-sm font-bold text-foreground">{booking.checkIn}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
            </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-out</p>
            <p className="text-sm font-bold text-foreground">{booking.checkOut}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Payment Status</p>
            <p className="text-sm font-bold text-foreground">{booking.payment_Status}</p>
          </div>
        </div>
      </div>

       <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gross Amount</span>
                <span className="font-semibold">₹{booking["Gross Amount"]}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span className="font-semibold">₹{booking.tax_amount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-semibold">₹{booking.platformFee}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-semibold text-red-500">- ₹{booking.commission}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
                <span>Net Amount (Payout)</span>
                <span className="text-primary">₹{booking["Net Amount"]}</span>
            </div>
             <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Payment Left</span>
                <span className="font-semibold text-orange-500">₹{booking.payment_left}</span>
            </div>
        </div>

    </div>
  );
};
