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

const initialRooms = [
  {
    id: "101",
    roomNumber: "101",
    name: "Deluxe Suite",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    ],
    features: ["King Bed", "City View", "Mini Bar", "Work Desk"],
    price: 200,
    available: false,
  },
  {
    id: "102",
    roomNumber: "102",
    name: "Garden Suite",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
    ],
    features: ["Queen Bed", "Garden View", "Private Terrace", "WiFi"],
    price: 250,
    available: false,
  },
  {
    id: "201",
    roomNumber: "201",
    name: "Standard Room",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    ],
    features: ["Double Bed", "WiFi", "TV", "Air Conditioning"],
    price: 150,
    available: true,
  },
  {
    id: "202",
    roomNumber: "202",
    name: "Standard Room",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    ],
    features: ["Double Bed", "WiFi", "TV", "Air Conditioning"],
    price: 150,
    available: true,
  },
  {
    id: "205",
    roomNumber: "205",
    name: "Standard Room",
    images: [
      "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800",
    ],
    features: ["Twin Beds", "WiFi", "TV", "Mini Fridge"],
    price: 150,
    available: false,
  },
  {
    id: "301",
    roomNumber: "301",
    name: "Ocean View Deluxe",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    ],
    features: ["King Bed", "Ocean View", "Balcony", "Spa Bath"],
    price: 350,
    available: false,
  },
  {
    id: "302",
    roomNumber: "302",
    name: "Ocean View Deluxe",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800",
    ],
    features: ["King Bed", "Ocean View", "Balcony", "Spa Bath"],
    price: 350,
    available: true,
  },
  {
    id: "401",
    roomNumber: "401",
    name: "Penthouse Suite",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800",
    ],
    features: [
      "Master Bedroom",
      "Living Room",
      "Private Terrace",
      "Jacuzzi",
      "Premium Bar",
    ],
    price: 500,
    available: true,
  },
];

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<string>("all");

  const statusColors = {
    available: "gradient-primary text-primary-foreground shadow-md",
    occupied: "bg-destructive text-destructive-foreground shadow-md",
    reserved: "bg-yellow-500 text-white shadow-md",
  };

  const handleAddRoom = (newRoom: {
    name: string;
    type: string;
    capacity: number;
    price: number;
    roomNumber: string;
  }) => {
    const room = {
      id: newRoom.roomNumber,
      roomNumber: newRoom.roomNumber,
      name: newRoom.name,
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      ],
      features: ["WiFi", "TV", "Air Conditioning"],
      price: newRoom.price,
      available: true,
    };
    setRooms([...rooms, room]);
  };

  const filteredRooms = useMemo(() => {
    const matchesSearch = (r: (typeof rooms)[number]) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.features.some((f) => f.toLowerCase().includes(q))
      );
    };
    const matchesAvailability = (r: (typeof rooms)[number]) => {
      if (availability === "all") return true;
      if (availability === "available") return r.available;
      if (availability === "occupied") return !r.available;
      return true;
    };
    return rooms.filter((r) => matchesSearch(r) && matchesAvailability(r));
  }, [rooms, searchQuery, availability]);

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
            Available: {filteredRooms.filter((r) => r.available).length}
          </span>
        </Card>
        <Card className="p-5 flex items-center gap-3 border-destructive/20 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:shadow-lg transition-all duration-300">
          <div className="w-3 h-3 rounded-full bg-destructive shadow-md"></div>
          <span className="text-sm font-bold tracking-tight">
            Occupied: {filteredRooms.filter((r) => !r.available).length}
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
            key={room.id}
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
                          alt={`${room.name} - View ${idx + 1}`}
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
                  room.available
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-destructive text-destructive-foreground"
                )}
              >
                {room.available ? "Available" : "Occupied"}
              </Badge>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                  {room.name}
                </h3>
                <p className="text-sm text-muted-foreground font-semibold">
                  Room {room.roomNumber}
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
