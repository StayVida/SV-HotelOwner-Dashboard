import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, Phone, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  guest: string;
  email: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: string;
  nights: number;
  amount: string;
}

interface BookingDetailsDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-card to-card/80 border-border/50 backdrop-blur h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 p-5 bg-gradient-to-r from-accent/20 to-accent/5">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-sm font-semibold">
                    {booking.guest
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl font-bold tracking-tight truncate">{booking.guest}</DialogTitle>
                  <p className="text-sm text-muted-foreground truncate">{booking.email}</p>
                </div>
              </div>
              <Badge
                className={cn(
                  "px-4 py-1.5 font-semibold tracking-wide",
                  booking.status === "confirmed" 
                    ? "gradient-primary text-primary-foreground shadow-md" 
                    : "bg-yellow-500 text-white shadow-md"
                )}
              >
                {booking.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Booking ID and Amount */}
          <div className="p-5 rounded-2xl gradient-accent border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">Booking ID</p>
                <p className="text-lg font-bold text-foreground tracking-tight">{booking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-semibold mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary tracking-tight">{booking.amount}</p>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground tracking-tight">Guest Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Guest Name</p>
                  <p className="text-sm font-bold text-foreground">{booking.guest}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Email</p>
                  <p className="text-sm font-bold text-foreground truncate">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-bold text-foreground">{booking.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/30 border border-border/50">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Room</p>
                  <p className="text-sm font-bold text-foreground">{booking.room}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Stay Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground tracking-tight">Stay Information</h3>
            
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
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Duration</p>
                  <p className="text-sm font-bold text-foreground">{booking.nights} nights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button className="gradient-primary">Print / Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
