import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFeatures, fetchRoomImages, removeRoomImage, updateRoom, updateRoomImage } from "@/api/rooms";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AddRoomDialogProps {
  onAddRoom: (room: {
    room_Type: string;
    room_NO: string;
    features: string[];
    price: number;
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    images: File[];
  }) => void;
  onUpdateRoom?: (roomId: string, room: {
    room_Type: string;
    room_NO: string;
    features: string[];
    price: number;
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    images?: File[];
  }) => void;
  editingRoom?: {
    room_ID: string;
    room_NO: number;
    room_Type: string;
    features: string[];
    price: number;
    maxAdults?: number;
    maxChildren?: number;
    bedCount?: number;
    images: string[];
  } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isPending?: boolean;
}

// Helper to check and format base64 images
const normalizeImage = (base64Str: string) => {
  if (!base64Str) return '';
  // If it's already a valid url or data URI, return as-is
  if (base64Str.startsWith('http') || base64Str.startsWith('data:')) return base64Str;
  
  // Guess the mime type based on base64 magic numbers
  let mimeType = 'image/jpeg';
  if (base64Str.startsWith('iVBORw0K')) mimeType = 'image/png';
  else if (base64Str.startsWith('R0lGODlh')) mimeType = 'image/gif';
  else if (base64Str.startsWith('UklGR')) mimeType = 'image/webp';
  else if (base64Str.startsWith('AAAA')) mimeType = 'image/avif';
  
  return `data:${mimeType};base64,${base64Str}`;
};

export function AddRoomDialog({ onAddRoom, onUpdateRoom, editingRoom, open: controlledOpen, onOpenChange, isPending }: AddRoomDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    room_Type: "",
    room_NO: "",
    features: [] as string[],
    price: 150,
    maxAdults: 2,
    maxChildren: 1,
    bedCount: 1,
    images: [] as File[],
    previews: [] as string[],
    existingImages: {} as Record<string, string>,
  });

  const [isRemovingImage, setIsRemovingImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadExistingImages = async (roomId: string) => {
    try {
      const images = await fetchRoomImages(roomId);
      const sortedKeys = Object.keys(images).sort((a, b) => parseInt(a) - parseInt(b));
      const sortedImages: Record<string, string> = {};
      sortedKeys.forEach(k => sortedImages[k] = images[k]);
      
      setFormData(prev => ({ 
        ...prev, 
        existingImages: sortedImages,
        previews: [...sortedKeys.map(k => images[k]), ...prev.images.map(file => URL.createObjectURL(file))]
      }));
    } catch (error) {
      console.error("Failed to fetch room images:", error);
    }
  };

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        room_Type: editingRoom.room_Type,
        room_NO: editingRoom.room_NO.toString(),
        features: editingRoom.features,
        price: editingRoom.price,
        maxAdults: editingRoom.maxAdults || 2,
        maxChildren: editingRoom.maxChildren || 1,
        bedCount: editingRoom.bedCount || 1,
        images: [],
        previews: editingRoom.images || [],
        existingImages: {},
      });
      
      loadExistingImages(editingRoom.room_ID);
    } else if (!open) {
      setFormData({
        room_Type: "",
        room_NO: "",
        features: [],
        price: 150,
        maxAdults: 2,
        maxChildren: 1,
        bedCount: 1,
        images: [],
        previews: [],
        existingImages: {},
      });
    }
  }, [editingRoom, open]);

  const { data: allFeatures = [] } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });

  const enabledFeatures = allFeatures.filter(f => f.status === "enable");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    if (editingRoom) {
      setIsUploadingImage(true);
      const loadingToast = toast.loading("Uploading image...");
      try {
        await updateRoomImage(editingRoom.room_ID, newFiles);
        toast.dismiss(loadingToast);
        toast.success("Image uploaded successfully");
        
        // Invalidate and refetch to show the new image
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        
        // Refetch room images to update everything from server
        await loadExistingImages(editingRoom.room_ID);
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to upload image");
        console.error("Upload error:", error);
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } else {
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        previews: [...prev.previews, ...newPreviews]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      // If it's a new upload
      const preview = prev.previews[index];
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
        
        // Find the correct index in the new images array
        // Previews = [existing, existing, new1, new2]
        // Images = [new1, new2]
        const existingCount = Object.keys(prev.existingImages).length;
        const newImageIndex = index - existingCount;

        return {
          ...prev,
          images: prev.images.filter((_, i) => i !== newImageIndex),
          previews: prev.previews.filter((_, i) => i !== index)
        };
      }
      
      return prev; // Should not happen for new uploads
    });
  };

  const handleDeleteExistingImage = async (indexStr: string) => {
    if (!editingRoom) return;
    
    setIsRemovingImage(indexStr);
    try {
      await removeRoomImage(editingRoom.room_ID, parseInt(indexStr));
      toast.success("Image removed successfully");
      
      // Invalidate and refetch everything
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      await loadExistingImages(editingRoom.room_ID);
    } catch (error) {
      toast.error("Failed to remove image");
    } finally {
      setIsRemovingImage(null);
    }
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

    if (editingRoom && onUpdateRoom) {
      onUpdateRoom(editingRoom.room_ID, {
        room_Type: formData.room_Type,
        room_NO: formData.room_NO,
        features: formData.features,
        price: formData.price,
        maxAdults: formData.maxAdults,
        maxChildren: formData.maxChildren,
        bedCount: formData.bedCount,
        images: formData.images.length > 0 ? formData.images : undefined,
      });
    } else {
      if (formData.images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }
      onAddRoom({
        room_Type: formData.room_Type,
        room_NO: formData.room_NO,
        features: formData.features,
        price: formData.price,
        maxAdults: formData.maxAdults,
        maxChildren: formData.maxChildren,
        bedCount: formData.bedCount,
        images: formData.images,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editingRoom && (
        <DialogTrigger asChild>
          <Button className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold px-6 py-6 text-base">
            <Plus className="w-5 h-5 mr-2" />
            Add Room
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[650px] w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-card border-border/50 p-0 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="p-6 sm:p-8 border-b border-border/30">
          <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-center sm:text-left">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details below to add or edit a room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          <div className="space-y-4">
            <Label className="font-bold text-base sm:text-lg tracking-tight">Room Images</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Existing Images */}
              {Object.keys(formData.existingImages).sort((a, b) => parseInt(a) - parseInt(b)).map((indexStr) => (
                <div key={`existing-${indexStr}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-muted/20">
                  <img src={normalizeImage(formData.existingImages[indexStr])} alt="Room" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    disabled={isRemovingImage === indexStr || isPending}
                    onClick={() => handleDeleteExistingImage(indexStr)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    {isRemovingImage === indexStr ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
              
              {/* New Image Previews */}
              {formData.previews.slice(Object.keys(formData.existingImages).length).map((img, idx) => {
                const globalIndex = Object.keys(formData.existingImages).length + idx;
                return (
                  <div key={`new-${idx}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-muted/20">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => removeImage(globalIndex)}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              
              <button
                type="button"
                disabled={isPending || isUploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center aspect-[4/3] rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300 bg-muted/30 group hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className={cn("w-5 h-5 text-primary", isUploadingImage && "animate-bounce")} />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  {isUploadingImage ? "Uploading..." : "Upload"}
                </span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="room_Type" className="font-bold text-sm uppercase tracking-wide">Room Type *</Label>
              <Input
                id="room_Type"
                placeholder="e.g., Deluxe Suite"
                value={formData.room_Type}
                onChange={(e) => setFormData({ ...formData, room_Type: e.target.value })}
                className="h-11 border-border/50 focus:border-primary text-base"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="room_NO" className="font-bold text-sm uppercase tracking-wide">Room Number *</Label>
              <Input
                id="room_NO"
                placeholder="e.g., 101"
                value={formData.room_NO}
                onChange={(e) => setFormData({ ...formData, room_NO: e.target.value })}
                className="h-11 border-border/50 focus:border-primary text-base"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-bold text-base sm:text-lg tracking-tight">Features & Amenities</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" disabled={isPending} className="w-full justify-between border-border/50 h-auto min-h-[48px] px-4 py-2.5 rounded-xl">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {formData.features.length > 0 ? (
                      formData.features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary uppercase">
                          {f}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground font-medium">Select features...</span>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command className="w-full">
                  <CommandInput placeholder="Search features..." className="h-11 border-b" />
                  <CommandList className="max-h-[250px] p-2">
                    <CommandEmpty>No feature found.</CommandEmpty>
                    <CommandGroup className="space-y-1">
                      {enabledFeatures.map((feature) => (
                        <CommandItem
                          key={feature.feature_id}
                          onSelect={() => toggleFeature(feature.name)}
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-lg"
                        >
                          <Checkbox
                            checked={formData.features.includes(feature.name)}
                            onCheckedChange={() => toggleFeature(feature.name)}
                            disabled={isPending}
                          />
                          <span className="flex-1 font-medium">{feature.name}</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="maxAdults" className="font-bold text-sm uppercase tracking-wide">Max Adults</Label>
              <Input
                id="maxAdults"
                type="number"
                min="1"
                value={formData.maxAdults}
                onChange={(e) => setFormData({ ...formData, maxAdults: parseInt(e.target.value) })}
                className="h-11 border-border/50 text-base"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="maxChildren" className="font-bold text-sm uppercase tracking-wide">Max Children</Label>
              <Input
                id="maxChildren"
                type="number"
                min="0"
                value={formData.maxChildren}
                onChange={(e) => setFormData({ ...formData, maxChildren: parseInt(e.target.value) })}
                className="h-11 border-border/50 text-base"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="bedCount" className="font-bold text-sm uppercase tracking-wide">Bed Count</Label>
              <Input
                id="bedCount"
                type="number"
                min="1"
                value={formData.bedCount}
                onChange={(e) => setFormData({ ...formData, bedCount: parseInt(e.target.value) })}
                className="h-11 border-border/50 text-base"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="price" className="font-bold text-sm uppercase tracking-wide">Price per Night (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="h-12 pl-8 border-border/50 focus:border-primary text-lg font-black"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-12 border-border/50 font-bold uppercase tracking-wider text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 gradient-primary hover:shadow-glow transition-all duration-300 font-bold uppercase tracking-wider text-xs"
            >
              {isPending ? (editingRoom ? "Saving..." : "Adding...") : (editingRoom ? "Save Changes" : "Add Room")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
