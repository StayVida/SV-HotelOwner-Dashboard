import { useEffect, useState } from "react";
import { fetchActiveBookings, ActiveBookingData } from "@/api/bookings";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { Card } from "@/components/ui/card";
import { BedDouble, Users, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ActiveBookings = () => {
  const [activeBookings, setActiveBookings] = useState<ActiveBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedBooking, setSelectedBooking] = useState<ActiveBookingData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getActiveBookings = async () => {
      try {
        const data = await fetchActiveBookings();
        setActiveBookings(data);
      } catch (error) {
        console.error("Failed to fetch active bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    getActiveBookings();
  }, []);

  const handleBookingClick = (booking: ActiveBookingData) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="relative">
          <div className="relative z-10">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Active Bookings</h2>
          <p className="text-muted-foreground text-lg font-medium font-medium">Currently checked-in guests at your property.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeBookings.length > 0 ? (
          activeBookings.map((booking, index) => (
            <Card
              key={booking.booking_ID + index}
              className="group relative p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur overflow-hidden cursor-pointer"
              onClick={() => handleBookingClick(booking)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex items-start justify-between relative z-10 mb-4">
                <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <BedDouble className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <Badge
                  className={cn(
                    "px-4 py-1.5 font-semibold tracking-wide gradient-primary text-primary-foreground shadow-md"
                  )}
                >
                  {booking.booking_Status}
                </Badge>
              </div>

              <div className="relative z-10 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{booking.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">Room: {booking.RoomNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">Check Out</p>
                      <p className="text-sm font-semibold text-foreground">{new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">Payment Status</p>
                      <p className={cn("text-sm font-semibold", booking.payment_Status === "Pending" ? "text-destructive" : "text-primary")}>
                        {booking.payment_Status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-12 text-center border-dashed border-2 bg-accent/5">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">No Active Bookings</h3>
                <p className="text-muted-foreground font-medium">There are currently no guests checked in.</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <BookingDetailsDialog 
        booking={selectedBooking} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default ActiveBookings;
