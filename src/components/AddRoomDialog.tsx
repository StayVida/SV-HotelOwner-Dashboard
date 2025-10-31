import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddRoomDialogProps {
  onAddRoom: (room: {
    name: string;
    type: string;
    capacity: number;
    price: number;
    roomNumber: string;
  }) => void;
}

export function AddRoomDialog({ onAddRoom }: AddRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: 2,
    price: 150,
    roomNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.roomNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddRoom(formData);
    toast.success("Room added successfully!");
    
    // Reset form
    setFormData({
      name: "",
      type: "",
      capacity: 2,
      price: 150,
      roomNumber: "",
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
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">Room Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Deluxe Suite"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-border/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="font-semibold">Room Number *</Label>
            <Input
              id="roomNumber"
              placeholder="e.g., 101, 205, etc."
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="border-border/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="font-semibold">Room Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger className="border-border/50 focus:border-primary">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="font-semibold">Capacity (guests)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="border-border/50 focus:border-primary transition-colors"
              />
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
                className="border-border/50 focus:border-primary transition-colors"
              />
            </div>
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
