import { useQuery } from "@tanstack/react-query";
import { fetchHotels } from "@/api/hotel";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { HotelImageCarousel } from "@/components/profile/HotelImageCarousel";
import { HotelDetailsCard } from "@/components/profile/HotelDetailsCard";
import { HotelSidebar } from "@/components/profile/HotelSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Profile = () => {
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ["hotels-profile"],
    queryFn: fetchHotels,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <div className="flex justify-between">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
            <div className="space-y-6">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load profile data. {error instanceof Error ? error.message : "Unknown error occured."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
      return (
          <div className="max-w-7xl mx-auto p-4">
              <ProfileHeader />
              <div className="text-center p-12 text-muted-foreground">
                  No properties found.
              </div>
          </div>
      )
  }

  return (
      <div className="space-y-16 animate-fade-in max-w-7xl mx-auto p-4 pb-20">
        <ProfileHeader hotel={hotels[0]} />
        
        {hotels.map((hotel) => (
            <div key={hotel.hotel_ID} className="space-y-8 border-b pb-12 last:border-0 last:pb-0">
                 {/* Hero Image Carousel */}
                <HotelImageCarousel hotel={hotel} />

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <HotelDetailsCard hotel={hotel} />

                {/* Sidebar Stats */}
                <HotelSidebar hotel={hotel} />
                </div>
            </div>
        ))}
      </div>
  );
};

export default Profile;
