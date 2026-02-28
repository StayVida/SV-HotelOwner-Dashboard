import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, CreditCard, QrCode, Building, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBankDetails } from "@/api/hotel";
import { Skeleton } from "@/components/ui/skeleton";
import { AddBankDetailsDialog } from "./AddBankDetailsDialog";

export function BankDetailsDialog() {
    const [open, setOpen] = useState(false);

    const { data: bankDetails, isLoading, error } = useQuery({
        queryKey: ["bankDetails"],
        queryFn: fetchBankDetails,
        enabled: open,
    });

    const details = bankDetails?.[0];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-semibold px-6 py-6 text-base">
                    <Landmark className="w-5 h-5 mr-2" />
                    Bank Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Bank Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
                            Failed to load bank details.
                        </div>
                    ) : !details ? (
                        <div className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Landmark className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No bank details found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Bank Info Card */}
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Building className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Bank Name</p>
                                        <p className="text-lg font-bold text-foreground">{details.bank_name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account Number</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            <p className="font-mono font-bold">{details.bank_account_no}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">IFSC Code</p>
                                        <p className="mt-1 font-mono font-bold uppercase">{details.ifsc_code}</p>
                                    </div>
                                </div>
                            </div>

                            {/* UPI Info Card */}
                            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                        <QrCode className="w-5 h-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">UPI ID</p>
                                        <p className="text-lg font-bold text-foreground">{details.upi_id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <AddBankDetailsDialog />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
