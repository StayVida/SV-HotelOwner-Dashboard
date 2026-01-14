import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookingDetails, updateBookingStatus } from "@/api/bookings";
import { BookingDialogHeader } from "./bookings/BookingDialogHeader";
import { BookingGuestInfo } from "./bookings/BookingGuestInfo";
import { BookingStayInfo } from "./bookings/BookingStayInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  booking_ID: string;
}

interface BookingDetailsDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  const queryClient = useQueryClient();

  const { data: bookingDetails, isLoading, error } = useQuery({
    queryKey: ["bookingDetails", booking?.booking_ID],
    queryFn: () => fetchBookingDetails(booking!.booking_ID),
    enabled: !!booking && open,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookingDetails", booking?.booking_ID] });
      queryClient.invalidateQueries({ queryKey: ["activeBookings"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      toast.success(`Booking status updated to ${variables.status} successfully!`);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  if (!booking && !open) return null;

  const handleStatusUpdate = (status: string) => {
    if (booking) {
      mutation.mutate({ id: booking.booking_ID, status });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-card to-card/80 border-border/50 backdrop-blur h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
             <Skeleton className="h-40 w-full rounded-2xl" />
             <Skeleton className="h-20 w-full rounded-xl" />
             <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load booking details. {error instanceof Error ? error.message : "Unknown error occured."}
            </AlertDescription>
          </Alert>
        ) : bookingDetails ? (
          <>
            <BookingDialogHeader booking={bookingDetails} />

            <div className="space-y-6 mt-2">
              <BookingGuestInfo booking={bookingDetails} />
              <Separator className="my-2" />
              <BookingStayInfo booking={bookingDetails} />
            </div>

            <DialogFooter className="mt-6 flex flex-wrap gap-2 sm:justify-between items-center">
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button className="gradient-primary" variant="secondary">Print / Save</Button>
              </div>

              <div className="flex gap-2">
                {bookingDetails.booking_Status === "Confirmed" && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    onClick={() => handleStatusUpdate("CheckIn")}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Check In
                  </Button>
                )}
                
                {bookingDetails.booking_Status === "CheckIn" && (
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    onClick={() => handleStatusUpdate("CheckOut")}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Check Out
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
