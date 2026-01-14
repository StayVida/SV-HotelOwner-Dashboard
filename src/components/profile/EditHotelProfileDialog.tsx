import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HotelData, updateHotelProfile } from "@/api/hotel";
import { toast } from "sonner";
import { Edit, MapPin, Check, ChevronDown, X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeatures, fetchAmenities, fetchTags } from "@/api/lookup";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Fix Leaflet icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const hotelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phone_no: z.string().min(10, "Phone number must be at least 10 digits"),
  longitude: z.string(),
  latitude: z.string(),
  remark: z.string().optional(),
  tags: z.array(z.string()),
  amenities: z.array(z.string()),
  features: z.array(z.string()),
  images: z.array(z.string()),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

interface EditHotelProfileDialogProps {
  hotel: HotelData;
}

// Map events component to handle clicks
const MapEvents = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to recenter map when lat/lng changes via inputs
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  // Fix rendering issues when map is initialized in a hidden container (Dialog)
  React.useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);

  return null;
};

export const EditHotelProfileDialog = ({ hotel }: EditHotelProfileDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel.name,
      type: hotel.type,
      destination: hotel.destination,
      description: hotel.description,
      phone_no: hotel.phone_no,
      longitude: hotel.longitude,
      latitude: hotel.latitude,
      remark: hotel.remark || "",
      tags: hotel.tags || [],
      amenities: hotel.amenities || [],
    //   features: hotel.features || [],
      images: hotel.images || [],
    },
  });

  const { data: allFeatures = [] } = useQuery({
    queryKey: ["lookup-features"],
    queryFn: fetchFeatures,
  });

  const { data: allAmenities = [] } = useQuery({
    queryKey: ["lookup-amenities"],
    queryFn: fetchAmenities,
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ["lookup-tags"],
    queryFn: fetchTags,
  });

  const enabledFeatures = allFeatures.filter((f) => f.status === "enable");
  const enabledAmenities = allAmenities.filter((a) => a.status === "enable");
  const enabledTags = allTags.filter((t) => t.status === "enable");

  const lat = parseFloat(form.watch("latitude")) || 0;
  const lng = parseFloat(form.watch("longitude")) || 0;

  const formatImageSrc = (image: string) => {
    if (!image) return "/placeholder.svg";
    if (image.startsWith("data:") || image.startsWith("http") || (image.startsWith("/") && image.length < 256)) {
      return image;
    }
    return `data:image/jpeg;base64,${image}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, result], { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const mutation = useMutation({
    mutationFn: (values: HotelFormValues) => {
      return updateHotelProfile({ ...values, hotel_ID: hotel.hotel_ID });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels-profile"] });
      toast.success("Hotel profile updated successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update hotel profile");
    },
  });

  const onSubmit = (values: HotelFormValues) => {
    mutation.mutate(values);
  };

  const watchedImages = form.watch("images") || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hotel Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="font-semibold text-base">Hotel Images</Label>
              <div className="grid grid-cols-4 gap-4">
                {watchedImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border/50">
                    <img src={formatImageSrc(img)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors bg-muted/30"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground font-medium">Upload</span>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Resort, Boutique" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="">
              <FormField
                control={form.control}
                name="phone_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                {/* <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select Location on Map
              </FormLabel>
              <div className="h-[300px] w-full rounded-md border overflow-hidden relative z-0">
                <MapContainer
                  center={[lat, lng]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lng]} />
                  <MapEvents
                    onChange={(newLat, newLng) => {
                      form.setValue("latitude", newLat.toString());
                      form.setValue("longitude", newLng.toString());
                    }}
                  />
                  <RecenterMap lat={lat} lng={lng} />
                </MapContainer>
              </div>
              <FormDescription>
                Click on the map to accurately pin your hotel's location.
              </FormDescription>
            </div>

            {/* Features Multi-Select */}
            {/* <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Features</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-auto min-h-[40px] px-3 py-2",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          <div className="flex flex-wrap gap-1">
                            {field.value?.length > 0 ? (
                              field.value.map((val) => (
                                <Badge key={val} variant="secondary" className="mr-1">
                                  {val}
                                </Badge>
                              ))
                            ) : (
                              <span>Select features...</span>
                            )}
                          </div>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search features..." />
                        <CommandList>
                          <CommandEmpty>No feature found.</CommandEmpty>
                          <CommandGroup>
                            {enabledFeatures.map((item) => (
                              <CommandItem
                                key={item.feature_id}
                                onSelect={() => {
                                  const current = field.value || [];
                                  const next = current.includes(item.name)
                                    ? current.filter((v: string) => v !== item.name)
                                    : [...current, item.name];
                                  form.setValue("features", next, { shouldValidate: true });
                                }}
                              >
                                <Checkbox
                                  checked={field.value?.includes(item.name)}
                                  className="mr-2"
                                />
                                {item.name}
                                {field.value?.includes(item.name) && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tags</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-auto min-h-[40px] px-3 py-2",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                            <div className="flex flex-wrap gap-1">
                              {field.value?.length > 0 ? (
                                field.value.map((val) => (
                                  <Badge key={val} variant="secondary" className="mr-1">
                                    {val}
                                  </Badge>
                                ))
                              ) : (
                                <span>Select tags...</span>
                              )}
                            </div>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search tags..." />
                          <CommandList>
                            <CommandEmpty>No tag found.</CommandEmpty>
                            <CommandGroup>
                              {enabledTags.map((item) => (
                                <CommandItem
                                  key={item.tag_id}
                                  onSelect={() => {
                                    const current = field.value || [];
                                    const next = current.includes(item.name)
                                      ? current.filter((v: string) => v !== item.name)
                                      : [...current, item.name];
                                    form.setValue("tags", next, { shouldValidate: true });
                                  }}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(item.name)}
                                    className="mr-2"
                                  />
                                  {item.name}
                                  {field.value?.includes(item.name) && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Amenities</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-auto min-h-[40px] px-3 py-2",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                            <div className="flex flex-wrap gap-1">
                              {field.value?.length > 0 ? (
                                field.value.map((val) => (
                                  <Badge key={val} variant="secondary" className="mr-1">
                                    {val}
                                  </Badge>
                                ))
                              ) : (
                                <span>Select amenities...</span>
                              )}
                            </div>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search amenities..." />
                          <CommandList>
                            <CommandEmpty>No amenity found.</CommandEmpty>
                            <CommandGroup>
                              {enabledAmenities.map((item) => (
                                <CommandItem
                                  key={item.amenity_id}
                                  onSelect={() => {
                                    const current = field.value || [];
                                    const next = current.includes(item.name)
                                      ? current.filter((v: string) => v !== item.name)
                                      : [...current, item.name];
                                    form.setValue("amenities", next, { shouldValidate: true });
                                  }}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(item.name)}
                                    className="mr-2"
                                  />
                                  {item.name}
                                  {field.value?.includes(item.name) && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
