import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Edit } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const propertyData = {
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200"
  ],
  name: "Sunset Paradise Resort",
  type: "Resort",
  destination: "Maldives, Indian Ocean",
  rating: 4.8,
  tags: ["Luxury", "Beachfront", "Family-Friendly", "All-Inclusive", "Spa & Wellness"],
  amenities: [
    { name: "Pool", icon: "🏊" },
    { name: "WiFi", icon: "📶" },
    { name: "Breakfast", icon: "🍳" },
    { name: "Spa", icon: "💆" },
    { name: "Parking", icon: "🚗" },
    { name: "Restaurant", icon: "🍽️" },
    { name: "Gym", icon: "💪" },
    { name: "Bar", icon: "🍹" }
  ],
  description: "Experience luxury at its finest in our stunning beachfront resort. Nestled in the heart of the Maldives, Sunset Paradise Resort offers an unforgettable escape with world-class amenities, pristine beaches, and exceptional service. Whether you're seeking relaxation or adventure, our resort provides the perfect setting for creating lasting memories. Enjoy breathtaking ocean views, indulge in spa treatments, savor exquisite dining, and immerse yourself in the natural beauty of this tropical paradise."
};

const Profile = () => {
  return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Property Profile</h2>
              <p className="text-muted-foreground text-lg font-medium">Manage your property information</p>
            </div>
          </div>
          <Button className="gap-2 font-semibold">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Hero Image Carousel */}
        <Card className="overflow-hidden border-border/50">
          <Carousel className="w-full">
            <CarouselContent>
              {propertyData.images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${propertyData.name} - View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{propertyData.name}</h1>
                      <div className="flex items-center gap-2 text-lg">
                        <MapPin className="w-5 h-5" />
                        <span>{propertyData.destination}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </Card>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <Card className="lg:col-span-2 p-8 space-y-6 border-border/50 bg-gradient-to-br from-card to-card/80">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">About the Property</h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {propertyData.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">Property Type</h4>
              <Badge className="px-4 py-2 text-base font-semibold gradient-primary text-primary-foreground">
                {propertyData.type}
              </Badge>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {propertyData.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm font-semibold">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {propertyData.amenities.map((amenity, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-3xl">{amenity.icon}</span>
                    <span className="text-sm font-semibold text-foreground text-center">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Rating & Quick Stats */}
          <div className="space-y-6">
            <Card className="p-8 border-border/50 bg-gradient-to-br from-card to-card/80 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary">
                  <Star className="w-10 h-10 text-primary-foreground fill-current" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {propertyData.rating}
                  </div>
                  <p className="text-muted-foreground font-semibold">Overall Rating</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${
                          star <= Math.floor(propertyData.rating) 
                            ? "text-primary fill-current" 
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border/50 bg-gradient-to-br from-card to-card/80">
              <h4 className="text-lg font-bold text-foreground mb-4">Location</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground font-medium">{propertyData.destination}</p>
              </div>
            </Card>

            <Card className="p-8 border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
              <h4 className="text-lg font-bold text-foreground mb-2">Property Status</h4>
              <Badge className="gradient-primary text-primary-foreground px-4 py-2 text-base font-semibold shadow-glow">
                Active
              </Badge>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Profile;
