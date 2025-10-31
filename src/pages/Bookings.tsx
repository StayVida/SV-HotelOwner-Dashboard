import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Eye, Search, Filter, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookings = [
  {
    id: "BK001",
    guest: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8901",
    room: "Deluxe Suite 101",
    checkIn: "2025-10-08",
    checkOut: "2025-10-12",
    status: "confirmed",
    nights: 4,
    amount: "$800"
  },
  {
    id: "BK002",
    guest: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8902",
    room: "Standard Room 205",
    checkIn: "2025-10-09",
    checkOut: "2025-10-11",
    status: "pending",
    nights: 2,
    amount: "$300"
  },
  {
    id: "BK003",
    guest: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 234 567 8903",
    room: "Ocean View 301",
    checkIn: "2025-10-10",
    checkOut: "2025-10-15",
    status: "confirmed",
    nights: 5,
    amount: "$1,250"
  },
  {
    id: "BK004",
    guest: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 234 567 8904",
    room: "Garden Suite 102",
    checkIn: "2025-10-12",
    checkOut: "2025-10-14",
    status: "confirmed",
    nights: 2,
    amount: "$500"
  },
  {
    id: "BK005",
    guest: "David Wilson",
    email: "d.wilson@email.com",
    phone: "+1 234 567 8905",
    room: "Penthouse Suite 401",
    checkIn: "2025-10-15",
    checkOut: "2025-10-20",
    status: "confirmed",
    nights: 5,
    amount: "$2,500"
  },
];

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("checkin-asc");

  const handleViewDetails = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const filteredAndSorted = useMemo(() => {
    const normalizeAmount = (value: string) => Number(value.replace(/[^\d.]/g, "")) || 0;
    const matchesSearch = (b: typeof bookings[0]) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.guest.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.room.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    };

    const matchesStatus = (b: typeof bookings[0]) =>
      statusFilter === "all" ? true : b.status === statusFilter;

    const sorted = [...bookings]
      .filter((b) => matchesSearch(b) && matchesStatus(b))
      .sort((a, b) => {
        switch (sortBy) {
          case "checkin-asc":
            return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
          case "checkin-desc":
            return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
          case "amount-desc":
            return normalizeAmount(b.amount) - normalizeAmount(a.amount);
          case "amount-asc":
            return normalizeAmount(a.amount) - normalizeAmount(b.amount);
          default:
            return 0;
        }
      });

    return sorted;
  }, [searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-8 animate-fade-in">
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

        <Card className="p-4 md:p-5 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by guest, email, room, or ID"
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="">
                <div className="inline-flex items-center gap-2">
                  <Filter className="w-4 h-4 opacity-60" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="">
                <div className="inline-flex items-center gap-2">
                  <SortAsc className="w-4 h-4 opacity-60" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkin-asc">Check-in: earliest first</SelectItem>
                <SelectItem value="checkin-desc">Check-in: latest first</SelectItem>
                <SelectItem value="amount-desc">Amount: high to low</SelectItem>
                <SelectItem value="amount-asc">Amount: low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid gap-5">
          {filteredAndSorted.length === 0 && (
            <Card className="p-10 text-center border-dashed border-border/60">
              <p className="text-lg font-semibold text-foreground">No bookings found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </Card>
          )}

          {filteredAndSorted.map((booking, index) => (
            <Card 
              key={booking.id} 
              className="group p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-foreground tracking-tight">{booking.guest}</h3>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={cn(
                            "px-4 py-1.5 font-semibold tracking-wide",
                            booking.status === "confirmed" 
                              ? "gradient-primary text-primary-foreground shadow-md" 
                              : ""
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Booking ID: {booking.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary tracking-tight">{booking.amount}</p>
                      <p className="text-sm text-muted-foreground font-semibold mt-1">{booking.nights} nights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
                      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Room</p>
                        <p className="text-sm font-bold text-foreground truncate">{booking.room}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
                      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-in</p>
                        <p className="text-sm font-bold text-foreground">{booking.checkIn}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
                      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Check-out</p>
                        <p className="text-sm font-bold text-foreground">{booking.checkOut}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-accent/10 border border-border/50">
                      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Email</p>
                        <p className="text-sm font-bold text-foreground truncate">{booking.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => handleViewDetails(booking)}
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/10 hover:border-primary transition-all duration-300 w-full md:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
