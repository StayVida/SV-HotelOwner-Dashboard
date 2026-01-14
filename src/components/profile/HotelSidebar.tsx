import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Info } from "lucide-react";
import { HotelData } from "@/api/hotel";

interface HotelSidebarProps {
  hotel: HotelData;
}

export const HotelSidebar = ({ hotel }: HotelSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-border/50 bg-gradient-to-br from-card to-card/80 text-center">
        <h4 className="text-lg font-bold text-foreground mb-4">Contact Info</h4>
        <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xl font-semibold">{hotel.phone_no}</p>
        </div>
      </Card>

      <Card className="p-8 border-border/50 bg-gradient-to-br from-card to-card/80">
        <h4 className="text-lg font-bold text-foreground mb-4">Location</h4>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <p className="text-muted-foreground font-medium">{hotel.destination}</p>
        </div>
        {hotel.latitude && hotel.longitude && (
             <p className="text-xs text-muted-foreground mt-2 ml-8">
                 Lat: {hotel.latitude}, Long: {hotel.longitude}
             </p>
        )}
      </Card>

      <Card className="p-8 border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
        <h4 className="text-lg font-bold text-foreground mb-2">Property Status</h4>
        <div className="flex flex-col gap-2">
            <Badge className="gradient-primary text-primary-foreground px-4 py-2 text-base font-semibold shadow-glow w-fit">
            {hotel.status}
            </Badge>
            {hotel.remark && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-background/50 rounded text-sm text-muted-foreground">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{hotel.remark}</span>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};
