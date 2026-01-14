import { EditHotelProfileDialog } from "./EditHotelProfileDialog";
import { HotelData } from "@/api/hotel";

interface ProfileHeaderProps {
  hotel?: HotelData;
}

export const ProfileHeader = ({ hotel }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div className="relative flex-1 min-w-[250px]">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Property Profile</h2>
          <p className="text-muted-foreground text-lg font-medium">Manage your property information</p>
        </div>
      </div>
      {hotel && <EditHotelProfileDialog hotel={hotel} />}
    </div>
  );
};
