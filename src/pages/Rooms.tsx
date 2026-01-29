import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Users, Settings, Search, Filter, Trash2 } from "lucide-react";
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
import { fetchRooms, RoomData, registerRoomWithImages, updateRoom, deleteRoom } from "@/api/rooms";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Static data removed

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<string>("all");
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{ roomId: string; hotelId: string } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register room");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: any }) => updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room updated successfully!");
      setEditingRoom(null);
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update room");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ roomId, hotelId }: { roomId: string; hotelId: string }) => deleteRoom(roomId, hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted successfully!");
      setIsConfirmOpen(false);
      setRoomToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete room");
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
    images: File[];
  }) => {
    mutation.mutate({
      roomType: newRoom.room_Type,
      room_NO: newRoom.room_NO,
      features: newRoom.features,
      maxAdults: newRoom.maxAdults,
      maxChildren: newRoom.maxChildren,
      bedCount: newRoom.bedCount,
      price: newRoom.price,
      images: newRoom.images,
    });
  };

  const handleUpdateRoom = (roomId: string, updatedData: any) => {
    updateMutation.mutate({
      roomId,
      data: {
        roomType: updatedData.room_Type,
        room_NO: updatedData.room_NO,
        features: updatedData.features,
        maxAdults: updatedData.maxAdults,
        maxChildren: updatedData.maxChildren,
        bedCount: updatedData.bedCount,
        price: updatedData.price,
        images: updatedData.images,
      },
    });
  };

  const handleDeleteRoom = (roomId: string, hotelId: string) => {
    setRoomToDelete({ roomId, hotelId });
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteMutation.mutate(roomToDelete);
    }
  };

  const openAddDialog = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (room: RoomData) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
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
      if (availability === "available") return r.Status === "Available";
      if (availability === "occupied") return r.Status === "Occupied";
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 relative">
        <div className="absolute -top-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 bg-primary/5 rounded-full blur-3xl text-center sm:text-left"></div>
        <div className="relative z-10 space-y-1 text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Room Management
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg font-medium max-w-md mx-auto sm:mx-0">
            Overview of all rooms and their current status
          </p>
        </div>
        <div className="relative z-10 w-full sm:w-auto flex justify-center sm:justify-end">
          <AddRoomDialog 
            onAddRoom={handleAddRoom} 
            onUpdateRoom={handleUpdateRoom}
            editingRoom={editingRoom}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      </div>

      <Card className="p-4 sm:p-5 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="pl-9 h-10 sm:h-11"
            />
          </div>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="h-10 sm:h-11">
              <div className="inline-flex items-center gap-2">
                <Filter className="w-4 h-4 opacity-60" />
                <SelectValue placeholder="Availability" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        <Card className="p-4 flex items-center gap-3 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full gradient-primary shadow-glow shrink-0"></div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Available: {filteredRooms.filter((r) => r.Status === "Available").length}
          </span>
        </Card>
        <Card className="p-4 flex items-center gap-3 border-destructive/20 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:shadow-lg transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-md shrink-0"></div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Occupied: {filteredRooms.filter((r) => r.Status === "Occupied").length}
          </span>
        </Card>
        <Card className="p-4 flex items-center gap-3 border-border/20 bg-gradient-to-r from-muted to-muted/50 hover:shadow-lg transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground shadow-md shrink-0"></div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Total Rooms: {rooms.length}
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
                  room.Status === "Available"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {room.Status}
              </Badge>

              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 left-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoom(room.room_ID, room.hotel_ID);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 tracking-tight truncate">
                  {room.room_Type}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  Room NO: {room.room_NO}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-extrabold text-primary text-xl sm:text-2xl">
                  ₹{room.price}
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  per night
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {room.features.slice(0, 4).map((feature, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-accent/50 text-accent-foreground"
                  >
                    {feature}
                  </Badge>
                ))}
                {room.features.length > 4 && (
                  <Badge variant="outline" className="text-[10px] font-bold">+{room.features.length - 4}</Badge>
                )}
              </div>

              <Button 
                className="w-full gap-2 font-bold h-11 sm:h-12 shadow-md hover:shadow-glow transition-all" 
                variant="outline"
                onClick={() => openEditDialog(room)}
              >
                <Settings className="w-4 h-4" />
                Manage Room
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Rooms;
