import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Users, Settings, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddRoomDialog } from "@/components/AddRoomDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRooms, RoomData, registerRoomWithImages } from "@/api/rooms";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Static data removed

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });

  const mutation = useMutation({
    mutationFn: registerRoomWithImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room registered successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register room");
    },
  });

  const statusColors = {
    available: "gradient-primary text-primary-foreground shadow-md",
    occupied: "bg-destructive text-destructive-foreground shadow-md",
    reserved: "bg-yellow-500 text-white shadow-md",
  };

  const handleAddRoom = (newRoom: {
    room_Type: string;
    room_NO: string;
    features: string[];
    price: number;
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    images: string[];
  }) => {
    mutation.mutate({
      roomType: newRoom.room_Type,
      features: newRoom.features,
      maxAdults: newRoom.maxAdults,
      maxChildren: newRoom.maxChildren,
      bedCount: newRoom.bedCount,
      price: newRoom.price,
    });
  };

  const filteredRooms = useMemo(() => {
    const matchesSearch = (r: RoomData) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.room_Type.toLowerCase().includes(q) ||
        r.room_NO.toString().includes(q) ||
        r.features.some((f) => f.toLowerCase().includes(q))
      );
    };
    const matchesAvailability = (r: RoomData) => {
      if (availability === "all") return true;
      if (availability === "available") return r.availability;
      if (availability === "occupied") return !r.availability;
      return true;
    };
    return rooms.filter((r) => matchesSearch(r) && matchesAvailability(r));
  }, [rooms, searchQuery, availability]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-bold">Error loading rooms</p>
          <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
              Room Management
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Overview of all rooms and their current status
            </p>
          </div>
        </div>
        <AddRoomDialog onAddRoom={handleAddRoom} />
      </div>

      <Card className="p-4 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, number, or feature"
              className="pl-9"
            />
          </div>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <div className="inline-flex items-center gap-2">
                <Filter className="w-4 h-4 opacity-60" />
                <SelectValue placeholder="Availability" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      <div className="flex gap-5 flex-wrap w-full">
        <Card className="p-5 flex items-center gap-3 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
          <div className="w-3 h-3 rounded-full gradient-primary shadow-glow"></div>
          <span className="text-sm font-bold tracking-tight">
            Available: {filteredRooms.filter((r) => r.availability).length}
          </span>
        </Card>
        <Card className="p-5 flex items-center gap-3 border-destructive/20 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:shadow-lg transition-all duration-300">
          <div className="w-3 h-3 rounded-full bg-destructive shadow-md"></div>
          <span className="text-sm font-bold tracking-tight">
            Occupied: {filteredRooms.filter((r) => !r.availability).length}
          </span>
        </Card>
        <Card className="p-5 flex items-center gap-3 border-border/20 bg-gradient-to-r from-muted to-muted/50 hover:shadow-lg transition-all duration-300">
          <div className="w-3 h-3 rounded-full bg-muted-foreground shadow-md"></div>
          <span className="text-sm font-bold tracking-tight">
            Total: {filteredRooms.length}
          </span>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room, index) => (
          <Card
            key={room.room_ID}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {room.images.map((image, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={image}
                          alt={`${room.room_Type} - View ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {room.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>

              <Badge
                className={cn(
                  "absolute top-3 right-3 px-3 py-1.5 font-semibold tracking-wide shadow-lg",
                  room.availability
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {room.availability ? "Available" : "Occupied"}
              </Badge>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                  {room.room_Type}
                </h3>
                <p className="text-sm text-muted-foreground font-semibold">
                  Room {room.room_NO}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-bold text-primary text-2xl">
                  ${room.price}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  per night
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.features.map((feature, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs font-semibold px-3 py-1"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>

              <Button className="w-full gap-2 font-semibold" variant="outline">
                <Settings className="w-4 h-4" />
                Manage Room
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
