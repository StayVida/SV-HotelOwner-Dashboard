import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, ArrowLeft, User, Mail, Globe, Phone, Users, Baby, CreditCard, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAvailableRooms, AvailableRoom, lockRoom, createOfflineBooking, CreateOfflineBookingResponse } from "@/api/bookings";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateOfflineBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateOfflineBookingDialog = ({ open, onOpenChange }: CreateOfflineBookingDialogProps) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);
    const [bookingResult, setBookingResult] = useState<CreateOfflineBookingResponse["data"] | null>(null);

    // Guest Info State
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [paymentType, setPaymentType] = useState("whole");
    const [countryCode, setCountryCode] = useState("+91");
    const [phoneNo, setPhoneNo] = useState("");
    const [adults, setAdults] = useState("1");
    const [children, setChildren] = useState("0");

    const { data: availableRooms, isLoading, isError } = useQuery({
        queryKey: ["available-rooms", checkIn, checkOut],
        queryFn: () => fetchAvailableRooms(format(checkIn!, "yyyy-MM-dd"), format(checkOut!, "yyyy-MM-dd")),
        enabled: !!checkIn && !!checkOut && step === 1,
    });

    const lockMutation = useMutation({
        mutationFn: lockRoom,
    });

    const createMutation = useMutation({
        mutationFn: createOfflineBooking,
        onSuccess: (response) => {
            setBookingResult(response.data);
            setStep(3);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create booking");
        }
    });

    const handleRoomSelect = (room: AvailableRoom) => {
        setSelectedRoom(room);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Delay reset to avoid flicker during close animation
            setTimeout(() => {
                setStep(1);
                setSelectedRoom(null);
                setBookingResult(null);
                // Reset fields
                setGuestName("");
                setGuestEmail("");
                setPaymentType("whole");
                setPhoneNo("");
                setAdults("1");
                setChildren("0");
            }, 300);
        }
        onOpenChange(isOpen);
    };

    const handleConfirm = async () => {
        if (!selectedRoom || !checkIn || !checkOut) return;

        try {
            // First lock the room
            await lockMutation.mutateAsync({
                roomId: selectedRoom.room_ID,
                checkIn: format(checkIn, "yyyy-MM-dd"),
                checkOut: format(checkOut, "yyyy-MM-dd"),
            });

            // Then create the booking
            await createMutation.mutateAsync({
                email: guestEmail,
                lockRoomId: selectedRoom.room_ID,
                adults: parseInt(adults),
                children: parseInt(children),
                paymentType: paymentType === "advance" ? "Advance" : "OnArrival",
                name: guestName,
                countryCode,
                phoneNo,
                checkIn: format(checkIn, "yyyy-MM-dd"),
                checkOut: format(checkOut, "yyyy-MM-dd"),
            });
        } catch (error) {
            console.error("Booking error:", error);
            if (lockMutation.isError) {
                toast.error("Failed to lock room for booking");
            }
        }
    };

    const isSubmitting = lockMutation.isPending || createMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-full h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl sm:rounded-2xl border-none shadow-2xl">
                <DialogHeader className={cn(
                    "px-4 sm:px-6 pt-5 sm:pt-6 pb-2 border-b border-border/40 flex flex-row items-center gap-3 sm:gap-4",
                    step === 3 && "hidden"
                )}>
                    {step === 2 && (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    )}
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                        {step === 1 ? "Create Offline Booking" : "Guest Information"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 py-4">
                    {step === 1 ? (
                        <>
                            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-muted-foreground">Check-in Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-12 border-border/60 hover:border-primary/50 transition-colors",
                                                    !checkIn && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={checkIn}
                                                onSelect={setCheckIn}
                                                initialFocus
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-muted-foreground">Check-out Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-12 border-border/60 hover:border-primary/50 transition-colors",
                                                    !checkOut && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={checkOut}
                                                onSelect={setCheckOut}
                                                initialFocus
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                                    (checkIn ? date <= checkIn : false)
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0 space-y-4 pt-2 overflow-hidden">
                                <div className="flex items-center justify-between flex-none">
                                    <h3 className="font-bold text-xl text-foreground tracking-tight">Available Rooms</h3>
                                    {availableRooms && (
                                        <span className="text-xs font-bold text-muted-foreground bg-accent/50 px-3 py-1 rounded-full border border-border/40">
                                            {availableRooms.length} ROOMS
                                        </span>
                                    )}
                                </div>

                                {!checkIn || !checkOut ? (
                                    <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-2xl bg-accent/5">
                                        <CalendarIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                                        <p className="text-muted-foreground font-medium px-4">Select check-in and check-out dates to see available rooms.</p>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                        <p className="text-muted-foreground animate-pulse">Finding perfect rooms...</p>
                                    </div>
                                ) : isError ? (
                                    <div className="text-center py-16 border-2 border-dashed border-destructive/20 rounded-2xl bg-destructive/5">
                                        <p className="text-destructive font-semibold">Error fetching available rooms</p>
                                        <Button variant="outline" size="sm" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ["available-rooms"] })}>Retry</Button>
                                    </div>
                                ) : availableRooms?.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-2xl bg-accent/5">
                                        <p className="text-muted-foreground font-medium">No rooms available for these dates.</p>
                                    </div>
                                ) : (
                                    <ScrollArea className="flex-1 pr-4 -mr-4 h-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
                                            {availableRooms?.map((room) => (
                                                <Card key={room.room_ID} className="overflow-hidden flex flex-col border-border/60 hover:border-primary/40 transition-all hover:shadow-lg group bg-card">
                                                    <div className="aspect-video relative overflow-hidden bg-accent/20">
                                                        {room.images && room.images.length > 0 ? (
                                                            <img
                                                                src={room.images[0]}
                                                                alt={room.room_Type}
                                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <CalendarIcon className="h-8 w-8 text-muted-foreground/20" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm shadow-sm text-foreground px-3 py-1 rounded-full text-[10px] font-bold border border-border/40 uppercase tracking-wider">
                                                            {room.room_Type}
                                                        </div>
                                                        <div className="absolute bottom-3 left-3 bg-primary/95 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                                                            Room {room.room_NO}
                                                        </div>
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                                        <div className="space-y-1">
                                                            <h4 className="font-bold text-lg text-foreground tracking-tight leading-tight">{room.room_Type}</h4>
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-2xl font-extrabold text-primary">₹{room.price_per_night}</span>
                                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">/ night</span>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <div className="text-sm font-extrabold text-foreground">₹{room.total_price} Total</div>
                                                                <div className="text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground">{room.total_nights} NIGHTS</div>
                                                            </div>
                                                            <Button size="sm" className="gradient-primary hover:shadow-glow transition-all px-5 font-bold" onClick={() => handleRoomSelect(room)}>
                                                                Book Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                        </>
                    ) : step === 2 ? (
                        <ScrollArea className="flex-1 -mx-2 px-2">
                            <div className="space-y-8 pb-10">
                                {/* Room Summary Card */}
                                {selectedRoom && (
                                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex flex-row items-center gap-5 shadow-sm">
                                        <div className="h-20 w-32 rounded-xl overflow-hidden flex-none shadow-md border border-white/20">
                                            <img src={selectedRoom.images[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-1 overflow-hidden">
                                            <h4 className="font-bold text-lg truncate tracking-tight text-foreground">{selectedRoom.room_Type}</h4>
                                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
                                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> Room {selectedRoom.room_NO}</span>
                                                <span className="font-bold text-primary">₹{selectedRoom.total_price} TOTAL</span>
                                            </div>
                                            <div className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-primary/80">
                                                {format(checkIn!, "MMM dd")} - {format(checkOut!, "MMM dd, yyyy")}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 pt-2">
                                    {/* Personal Info */}
                                    <div className="space-y-8">
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-3 w-3" />
                                                </div>
                                                <span className="uppercase text-[10px] tracking-[0.2em]">Guest Profile</span>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="space-y-2.5">
                                                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                                                        <Input id="name" placeholder="John Doe" className="pl-11 h-12 bg-accent/5 focus:bg-background border-border/60" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2.5">
                                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                                                        <Input id="email" type="email" placeholder="john@example.com" className="pl-11 h-12 bg-accent/5 focus:bg-background border-border/60" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Phone className="h-3 w-3" />
                                                </div>
                                                <span className="uppercase text-[10px] tracking-[0.2em]">Communication</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-[110px] space-y-2.5">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Code</Label>
                                                    <Select value={countryCode} onValueChange={setCountryCode}>
                                                        <SelectTrigger className="h-12 bg-accent/5 border-border/60">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="+91">+91 (IN)</SelectItem>
                                                            <SelectItem value="+1">+1 (US)</SelectItem>
                                                            <SelectItem value="+44">+44 (GB)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex-1 space-y-2.5">
                                                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                                    <Input id="phone" placeholder="9876543210" className="h-12 bg-accent/5 border-border/60" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stay & Payment */}
                                    <div className="space-y-8">
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="h-3 w-3" />
                                                </div>
                                                <span className="uppercase text-[10px] tracking-[0.2em]">Occupancy</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="space-y-2.5">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adults</Label>
                                                    <Select value={adults} onValueChange={setAdults}>
                                                        <SelectTrigger className="h-12 bg-accent/5 border-border/60">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[1, 2, 3, 4, 10].map(n => (
                                                                <SelectItem key={n} value={n.toString()}>{n} Adults</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2.5">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Children</Label>
                                                    <Select value={children} onValueChange={setChildren}>
                                                        <SelectTrigger className="h-12 bg-accent/5 border-border/60">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[0, 1, 2, 3, 4, 10].map(n => (
                                                                <SelectItem key={n} value={n.toString()}>{n} Children</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-3 w-3" />
                                                </div>
                                                <span className="uppercase text-[10px] tracking-[0.2em]">Settlement</span>
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Type</Label>
                                                <Select value={paymentType} onValueChange={setPaymentType}>
                                                    <SelectTrigger className="h-14 border-2 border-primary/20 focus:border-primary transition-all bg-accent/5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="advance" className="p-4">
                                                            <div className="flex justify-between items-center w-full gap-10">
                                                                <div className="text-left">
                                                                    <div className="font-extrabold text-sm tracking-tight text-foreground">Advance (30%)</div>
                                                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Reservation Fee</div>
                                                                </div>
                                                                <div className="font-extrabold text-lg text-primary">₹{Math.round((selectedRoom?.total_price || 0) * 0.3)}</div>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="whole" className="p-4">
                                                            <div className="flex justify-between items-center w-full gap-10">
                                                                <div className="text-left">
                                                                    <div className="font-extrabold text-sm tracking-tight text-foreground">Whole (100%)</div>
                                                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Full Settlement</div>
                                                                </div>
                                                                <div className="font-extrabold text-lg text-primary">₹{selectedRoom?.total_price || 0}</div>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Button
                                                className="w-full h-14 text-lg gradient-primary hover:shadow-glow transition-all font-extrabold tracking-tight group"
                                                onClick={handleConfirm}
                                                disabled={isSubmitting || !guestName || !phoneNo}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                        CREATING BOOKING...
                                                    </>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        CONFIRM & SECURE ROOM
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center animate-in fade-in zoom-in duration-500">
                            <div className="mb-8 relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                                <CheckCircle2 className="h-24 w-24 text-green-500 relative z-10 animate-bounce" strokeWidth={1.5} />
                            </div>

                            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Booking Confirmed!</h2>
                            <p className="text-muted-foreground mb-8 max-w-sm">The room has been successfully booked for {bookingResult?.name}.</p>

                            <div className="bg-accent/30 rounded-3xl p-6 w-full max-w-md border border-border/40 mb-10 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Booking ID</span>
                                    <span className="text-sm font-extrabold tracking-tight font-mono">{bookingResult?.bookingId}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Room No</div>
                                        <div className="text-lg font-extrabold">#{selectedRoom?.room_NO}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                                        <div className="text-sm font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full inline-block">
                                            {bookingResult?.bookingStatus}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Amount</div>
                                        <div className="text-lg font-extrabold text-primary">₹{bookingResult?.totalAmount}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Payment</div>
                                        <div className="text-sm font-bold">{bookingResult?.paymentType}</div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full max-w-xs h-12 rounded-xl font-extrabold tracking-tight bg-foreground text-background hover:bg-foreground/90 transition-all"
                                onClick={() => handleOnOpenChange(false)}
                            >
                                CLOSE & RETURN
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
