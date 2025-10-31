import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface WithdrawDialogProps {
  availableBalance: number;
}

export function WithdrawDialog({ availableBalance }: WithdrawDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Here you would typically make an API call to process the withdrawal
    toast.success(`Withdrawal request of $${withdrawAmount.toLocaleString()} submitted successfully!`);
    
    setAmount("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold px-6 py-6 text-base">
          <ArrowDownToLine className="w-5 h-5 mr-2" />
          Withdraw Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Withdraw Funds</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Available Balance */}
          <div className="p-5 rounded-2xl gradient-accent border border-primary/10">
            <p className="text-sm text-muted-foreground font-semibold mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-primary tracking-tight">
              ${availableBalance.toLocaleString()}
            </p>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-semibold text-base">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg border-border/50 focus:border-primary transition-colors h-12"
                step="0.01"
                min="0"
                max={availableBalance}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-2">
              Maximum withdrawal: ${availableBalance.toLocaleString()}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="font-semibold text-sm">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => {
                const quickAmount = (availableBalance * percentage) / 100;
                return (
                  <Button
                    key={percentage}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toFixed(2))}
                    className="border-border/50 hover:border-primary hover:bg-accent/50 transition-all"
                  >
                    {percentage}%
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Submit Buttons */}
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
              Withdraw
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
