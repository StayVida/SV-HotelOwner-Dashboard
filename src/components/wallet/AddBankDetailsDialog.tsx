import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, QrCode, Building, CreditCard, Plus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBankDetails, AddBankDetailsRequest } from "@/api/hotel";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddBankDetailsDialog() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"BANK" | "UPI">("BANK");
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<AddBankDetailsRequest>({
        bank_account_no: "",
        ifsc_code: "",
        bank_name: "",
        upi_id: "",
    });

    const mutation = useMutation({
        mutationFn: (details: AddBankDetailsRequest) => addBankDetails(details),
        onSuccess: () => {
            toast.success("Bank details added successfully!");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["bankDetails"] });
            setFormData({ bank_account_no: "", ifsc_code: "", bank_name: "", upi_id: "" });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add bank details");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "BANK") {
            if (!formData.bank_account_no || !formData.ifsc_code || !formData.bank_name) {
                toast.error("Please fill all bank details");
                return;
            }
            mutation.mutate({
                bank_account_no: formData.bank_account_no,
                ifsc_code: formData.ifsc_code,
                bank_name: formData.bank_name,
            });
        } else {
            if (!formData.upi_id) {
                toast.error("Please enter a valid UPI ID");
                return;
            }
            mutation.mutate({ upi_id: formData.upi_id });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full gradient-primary hover:shadow-glow transition-all duration-300 font-semibold h-12">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Bank Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-card border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Add Bank Details</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="BANK" onValueChange={(v) => setMode(v as any)} className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl mb-6">
                        <TabsTrigger value="BANK" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Landmark className="w-4 h-4 mr-2" />
                            Bank Account
                        </TabsTrigger>
                        <TabsTrigger value="UPI" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            UPI ID
                        </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <TabsContent value="BANK" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="bank_name"
                                        placeholder="e.g. State Bank of India"
                                        className="pl-10 h-11"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="account_no">Account Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="account_no"
                                        placeholder="Enter 12-16 digit account number"
                                        className="pl-10 h-11"
                                        value={formData.bank_account_no}
                                        onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ifsc">IFSC Code</Label>
                                <div className="relative">
                                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="ifsc"
                                        placeholder="e.g. SBIN0001234"
                                        className="pl-10 h-11 uppercase"
                                        value={formData.ifsc_code}
                                        onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="UPI" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="upi">UPI ID</Label>
                                <div className="relative">
                                    <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="upi"
                                        placeholder="e.g. hotel@upi"
                                        className="pl-10 h-11"
                                        value={formData.upi_id}
                                        onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1 h-11"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-11 gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Confirm Details"
                                )}
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
