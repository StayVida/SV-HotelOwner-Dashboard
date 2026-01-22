import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "@/api/bookings";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingsFilter } from "@/components/bookings/BookingsFilter";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { BookingData } from "@/api/bookings";

const Bookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("checkin-asc");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  const handleViewDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const filteredAndSorted = useMemo(() => {
    if (!bookings) return [];

    const matchesSearch = (b: typeof bookings[0]) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.booking_ID.toLowerCase().includes(q) ||
        b.room_ID.toLowerCase().includes(q)
      );
    };

    const matchesStatus = (b: typeof bookings[0]) =>
      statusFilter === "all" ? true : b.booking_Status === statusFilter;

    const matchesPaymentStatus = (b: typeof bookings[0]) =>
      paymentStatusFilter === "all" ? true : b.payment_Status === paymentStatusFilter;

    const sorted = [...bookings]
      .filter((b) => matchesSearch(b) && matchesStatus(b) && matchesPaymentStatus(b))
      .sort((a, b) => {
        switch (sortBy) {
          case "checkin-asc":
            return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
          case "checkin-desc":
            return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
          case "amount-desc":
            return b["gross amount"] - a["gross amount"];
          case "amount-asc":
            return a["gross amount"] - b["gross amount"];
          default:
            return 0;
        }
      });

    return sorted;
  }, [bookings, searchQuery, statusFilter, paymentStatusFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
             <Skeleton className="h-12 w-64" />
             <Skeleton className="h-12 w-32" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="space-y-5">
             <Skeleton className="h-48 w-full rounded-xl" />
             <Skeleton className="h-48 w-full rounded-xl" />
             <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <BookingsHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load bookings. {error instanceof Error ? error.message : "Unknown error occured."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-24">
        <BookingsHeader />

        <BookingsFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
        />

        <div className="grid gap-4 sm:gap-6">
          {filteredAndSorted.length === 0 && (
            <Card className="p-8 sm:p-12 text-center border-dashed border-border/60 bg-accent/5">
              <p className="text-lg font-bold text-foreground">No bookings found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </Card>
          )}

          {filteredAndSorted.map((booking, index) => (
            <BookingCard 
              key={booking.booking_ID} 
              booking={booking} 
              index={index} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        <BookingDetailsDialog
          booking={selectedBooking}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
    </div>
  );
};

export default Bookings;
