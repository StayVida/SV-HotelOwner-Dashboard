import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BedDouble, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const bookingData = [
  { roomId: "101", roomName: "Deluxe Suite 101", dates: ["2025-10-08", "2025-10-09", "2025-10-10", "2025-10-11"], guest: "John Smith" },
  { roomId: "102", roomName: "Garden Suite 102", dates: ["2025-10-12", "2025-10-13"], guest: "Emily Davis" },
  { roomId: "205", roomName: "Standard Room 205", dates: ["2025-10-09", "2025-10-10"], guest: "Sarah Johnson" },
  { roomId: "301", roomName: "Ocean View 301", dates: ["2025-10-10", "2025-10-11", "2025-10-12", "2025-10-13", "2025-10-14"], guest: "Michael Brown" },
  { roomId: "401", roomName: "Penthouse Suite 401", dates: ["2025-10-15", "2025-10-16", "2025-10-17", "2025-10-18", "2025-10-19"], guest: "David Wilson" },
];

const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [query, setQuery] = useState("");

  const getBookingsForDate = (selectedDate: Date) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return bookingData.filter(booking => 
      booking.dates.includes(dateStr)
    );
  };

  const bookedDates = bookingData.flatMap(booking => 
    booking.dates.map(d => new Date(d))
  );

  const currentBookings = date ? getBookingsForDate(date) : [];

  const matchesQuery = (roomName: string, guest: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return roomName.toLowerCase().includes(q) || guest.toLowerCase().includes(q);
  };

  const filteredCurrent = useMemo(
    () => currentBookings.filter(b => matchesQuery(b.roomName, b.guest)),
    [currentBookings, query]
  );

  const filteredAll = useMemo(
    () => bookingData.filter(b => matchesQuery(b.roomName, b.guest)),
    [query]
  );

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Booking Calendar</h2>
            <p className="text-muted-foreground text-lg font-medium">View and manage room bookings by date</p>
          </div>
        </div>

        <Card className="p-4 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by room or guest"
              className="pl-9"
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="p-8 lg:col-span-1 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur min-w-0 h-[70vh] overflow-y-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0 w-full"
              classNames={{
                head_cell: "text-muted-foreground rounded-md w-9 sm:w-10 font-normal text-[0.8rem]",
                cell: "h-9 w-9 sm:h-10 sm:w-10 text-center text-sm p-0 relative",
                day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal",
                table: "w-full border-collapse",
                row: "flex w-full mt-2",
              }}
              modifiers={{
                booked: bookedDates,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'hsl(var(--primary) / 0.15)',
                  color: 'hsl(var(--primary))',
                  fontWeight: '700',
                  borderRadius: '0.5rem',
                },
              }}
            />
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded gradient-accent border border-primary/20"></div>
                  <span className="text-muted-foreground font-semibold">Booked dates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded gradient-primary"></div>
                  <span className="text-muted-foreground font-semibold">Selected date</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-7 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur lg:col-span-2 min-w-0 h-[70vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-5 tracking-tight">
              {date ? format(date, "MMMM dd, yyyy") : "Select a date"}
            </h3>
            
            {filteredCurrent.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4 font-semibold">
                  {filteredCurrent.length} room{filteredCurrent.length > 1 ? 's' : ''} booked
                </p>
                {filteredCurrent.map((booking) => (
                  <div
                    key={booking.roomId}
                    className="group p-5 rounded-2xl gradient-accent border border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all duration-300">
                        <BedDouble className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm mb-2 tracking-tight truncate">
                          {booking.roomName}
                        </p>
                      <p className="text-xs text-muted-foreground mb-3 font-semibold truncate">
                          {booking.guest}
                        </p>
                        <Badge className="gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 shadow-md">
                          Occupied
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full gradient-accent mx-auto mb-4 flex items-center justify-center">
                  <BedDouble className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground mb-2 tracking-tight">No bookings</p>
                <p className="text-xs text-muted-foreground font-medium">
                  All rooms are available for this date
                </p>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <h3 className="text-2xl font-bold text-foreground mb-6 tracking-tight">All Upcoming Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAll.map((booking, index) => (
              <div 
                key={booking.roomId} 
                className="group p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all duration-300">
                    <BedDouble className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground mb-2 tracking-tight">{booking.roomName}</p>
                    <p className="text-sm text-muted-foreground mb-2 font-semibold">{booking.guest}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {booking.dates.length} night{booking.dates.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
};

export default CalendarView;
