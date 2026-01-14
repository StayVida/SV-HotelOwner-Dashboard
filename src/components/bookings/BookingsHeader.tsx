import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const BookingsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">All Bookings</h2>
          <p className="text-muted-foreground text-lg font-medium">Manage and track all guest reservations</p>
        </div>
      </div>
      <Button className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold px-6 py-6 text-base">
        <Calendar className="w-5 h-5 mr-2" />
        New Booking
      </Button>
    </div>
  );
};
