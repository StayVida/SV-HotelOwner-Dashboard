import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchFeatures } from "@/api/rooms";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface AddRoomDialogProps {
  onAddRoom: (room: {
    room_Type: string;
    room_NO: string;
    features: string[];
    price: number;
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    images: string[];
  }) => void;
}

// Static features removed

export function AddRoomDialog({ onAddRoom }: AddRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    room_Type: "",
    room_NO: "",
    features: [] as string[],
    price: 150,
    maxAdults: 2,
    maxChildren: 1,
    bedCount: 1,
    images: [] as string[],
  });

  const { data: allFeatures = [], isLoading: isLoadingFeatures } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });

  const enabledFeatures = allFeatures.filter(f => f.status === "enable");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.room_Type || !formData.room_NO) {
      toast.error("Please fill in basic room details");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    onAddRoom(formData);
    toast.success("Room added successfully!");
    
    // Reset form
    setFormData({
      room_Type: "",
      room_NO: "",
      features: [],
      price: 150,
      maxAdults: 2,
      maxChildren: 1,
      bedCount: 1,
      images: [],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold px-6 py-6 text-base">
          <Plus className="w-5 h-5 mr-2" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="font-semibold text-base">Room Images</Label>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-border/50">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
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
                className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors bg-muted/30"
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
            <div className="space-y-2">
              <Label htmlFor="room_Type" className="font-semibold">Room Type (Name) *</Label>
              <Input
                id="room_Type"
                placeholder="e.g., Deluxe Suite"
                value={formData.room_Type}
                onChange={(e) => setFormData({ ...formData, room_Type: e.target.value })}
                className="border-border/50 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room_NO" className="font-semibold">Room Number *</Label>
              <Input
                id="room_NO"
                placeholder="e.g., 101"
                value={formData.room_NO}
                onChange={(e) => setFormData({ ...formData, room_NO: e.target.value })}
                className="border-border/50 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Features Selection Dropdown */}
          <div className="space-y-3">
            <Label className="font-semibold text-base">Features & Amenities</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between border-border/50 h-auto min-h-[40px] px-3 py-2"
                >
                  <div className="flex flex-wrap gap-1 items-center">
                    {formData.features.length > 0 ? (
                      formData.features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {f}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Select features...</span>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="w-full">
                  <CommandInput placeholder="Search features..." className="h-9" />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>No feature found.</CommandEmpty>
                    <CommandGroup>
                      {enabledFeatures.map((feature) => (
                        <CommandItem
                          key={feature.feature_id}
                          onSelect={() => toggleFeature(feature.name)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={formData.features.includes(feature.name)}
                            onCheckedChange={() => toggleFeature(feature.name)}
                          />
                          <span className="flex-1">{feature.name}</span>
                          {formData.features.includes(feature.name) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxAdults" className="font-semibold text-sm">Max Adults</Label>
              <Input
                id="maxAdults"
                type="number"
                min="1"
                value={formData.maxAdults}
                onChange={(e) => setFormData({ ...formData, maxAdults: parseInt(e.target.value) })}
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxChildren" className="font-semibold text-sm">Max Children</Label>
              <Input
                id="maxChildren"
                type="number"
                min="0"
                value={formData.maxChildren}
                onChange={(e) => setFormData({ ...formData, maxChildren: parseInt(e.target.value) })}
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedCount" className="font-semibold text-sm">Bed Count</Label>
              <Input
                id="bedCount"
                type="number"
                min="1"
                value={formData.bedCount}
                onChange={(e) => setFormData({ ...formData, bedCount: parseInt(e.target.value) })}
                className="border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="font-semibold">Price per Night ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="10"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
            >
              Add Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
