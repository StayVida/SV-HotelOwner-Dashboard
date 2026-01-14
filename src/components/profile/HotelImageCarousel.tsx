import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { HotelData } from "@/api/hotel";

interface HotelImageCarouselProps {
  hotel: HotelData;
}

export const HotelImageCarousel = ({ hotel }: HotelImageCarouselProps) => {
  const images = hotel.images && hotel.images.length > 0 ? hotel.images : ["/placeholder.svg"];

  return (
    <Card className="overflow-hidden border-border/50 mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img 
                  src={(image.startsWith("data:") || image.startsWith("http") || (image.startsWith("/") && image.length < 256))
                    ? image 
                    : `data:image/jpeg;base64,${image}`} 
                  alt={`${hotel.name} - View ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"; // Fallback
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" />
                    <span>{hotel.destination}</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
            <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </>
        )}
      </Carousel>
    </Card>
  );
};
