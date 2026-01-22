import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const BookingsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4 relative">
      <div className="absolute -top-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative z-10 space-y-1 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">All Bookings</h2>
        <p className="text-muted-foreground text-sm sm:text-lg font-medium max-w-md mx-auto sm:mx-0">Manage and track guest reservations</p>
      </div>
      <div className="relative z-10 w-full sm:w-auto">
        <Button className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold h-12 sm:h-14 sm:px-8 text-sm sm:text-base w-full sm:w-auto">
          <Calendar className="w-5 h-5 mr-2" />
          New Booking
        </Button>
      </div>
    </div>
  );
};
