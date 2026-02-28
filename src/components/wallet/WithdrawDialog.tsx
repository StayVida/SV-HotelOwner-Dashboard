import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, DollarSign, AlertCircle, Landmark } from "lucide-react";
import { toast } from "sonner";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withdrawFunds, fetchBankDetails } from "@/api/hotel";
import { AddBankDetailsDialog } from "./AddBankDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface WithdrawDialogProps {
  availableBalance: number;
}

export function WithdrawDialog({ availableBalance }: WithdrawDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const { data: bankDetails, isLoading: isLoadingBankDetails } = useQuery({
    queryKey: ["bankDetails"],
    queryFn: fetchBankDetails,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (withdrawAmount: number) => withdrawFunds(withdrawAmount),
    onSuccess: () => {
      toast.success(`Withdrawal request of ₹${parseFloat(amount).toLocaleString()} submitted successfully!`);
      setAmount("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transactionRequests"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process withdrawal");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankDetails || bankDetails.length === 0) {
      toast.error("Please add bank details before withdrawing");
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    mutation.mutate(withdrawAmount);
  };

  const hasBankDetails = bankDetails && bankDetails.length > 0;

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

        {isLoadingBankDetails ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        ) : !hasBankDetails ? (
          <div className="space-y-6 mt-4">
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20 text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">No Bank Details Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You need to provide your bank account or UPI information before you can withdraw funds.
                </p>
              </div>
            </div>

            <AddBankDetailsDialog />

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full h-11 border-border/50"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Available Balance */}
            <div className="p-5 rounded-2xl gradient-accent border border-primary/10">
              <p className="text-sm text-muted-foreground font-semibold mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-primary tracking-tight">
                ₹{availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Bank Info Summary */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-none mb-1">Withdrawing to</p>
                <p className="text-sm font-semibold truncate leading-none">
                  {bankDetails[0].bank_name || bankDetails[0].upi_id}
                </p>
              </div>
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
                Maximum withdrawal: ₹{availableBalance.toLocaleString()}
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
                      className="border-border/50 hover:border-primary hover:bg-accent/50 transition-all text-xs h-9"
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
                className="flex-1 h-11 border-border/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
