import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HotelData } from "@/api/hotel";
import { Wifi, Car, Utensils, Waves, Dumbbell, Martini, Tv, Wind } from "lucide-react";

interface HotelDetailsCardProps {
  hotel: HotelData;
}

// Helper to map amenity names to icons
const getAmenityIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-6 h-6" />;
  if (lowerName.includes("parking")) return <Car className="w-6 h-6" />;
  if (lowerName.includes("pool")) return <Waves className="w-6 h-6" />;
  if (lowerName.includes("gym")) return <Dumbbell className="w-6 h-6" />;
  if (lowerName.includes("restaurant") || lowerName.includes("breakfast")) return <Utensils className="w-6 h-6" />;
  if (lowerName.includes("bar")) return <Martini className="w-6 h-6" />;
  if (lowerName.includes("ac") || lowerName.includes("amenities")) return <Wind className="w-6 h-6" />; // General icon
  return <Tv className="w-6 h-6" />; // Default
};

export const HotelDetailsCard = ({ hotel }: HotelDetailsCardProps) => {
  return (
    <Card className="lg:col-span-2 p-8 space-y-6 border-border/50 bg-gradient-to-br from-card to-card/80">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">About the Property</h3>
        <p className="text-muted-foreground leading-relaxed text-base">
          {hotel.description || "No description provided."}
        </p>
      </div>

      <div>
        <h4 className="text-lg font-bold text-foreground mb-3">Property Type</h4>
        <Badge className="px-4 py-2 text-base font-semibold gradient-primary text-primary-foreground">
          {hotel.type}
        </Badge>
      </div>

      {hotel.tags && hotel.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-foreground mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm font-semibold">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hotel.amenities && hotel.amenities.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-foreground mb-4">Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotel.amenities.map((amenity, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                title={amenity}
              >
                <span className="text-foreground">{getAmenityIcon(amenity)}</span>
                <span className="text-sm font-semibold text-foreground text-center truncate w-full">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
