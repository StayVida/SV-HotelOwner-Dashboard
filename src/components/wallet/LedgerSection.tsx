import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LedgerItem } from "./LedgerItem";
import { LedgerEntry } from "@/api/hotel";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface LedgerSectionProps {
    isLoading: boolean;
    error: any;
    ledgerEntries: LedgerEntry[];
}

export function LedgerSection({
    isLoading,
    error,
    ledgerEntries,
}: LedgerSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLedger = ledgerEntries.filter(entry => {
        const query = searchQuery.toLowerCase();
        return (
            entry.hotel_id.toLowerCase().includes(query) ||
            (entry.booking_id?.toLowerCase().includes(query)) ||
            entry.transaction_id.toLowerCase().includes(query) ||
            entry.via.toLowerCase().includes(query)
        );
    });

    return (
        <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">All Transactions</h3>
                    <p className="text-sm text-muted-foreground font-medium">Full history of credits and withdrawals</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ledger..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-accent/30 border-border/50 focus:border-primary transition-all rounded-xl"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-border/50">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-14 h-14 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-500 font-medium">Failed to load ledger. Please try again later.</p>
                    </div>
                ) : filteredLedger.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-border/50 rounded-3xl">
                        <p className="text-muted-foreground text-lg">No entries found matching your criteria.</p>
                    </div>
                ) : (
                    filteredLedger.map((entry, index) => (
                        <LedgerItem key={`${entry.transaction_id}-${entry.sr}-${index}`} entry={entry} index={index} />
                    ))
                )}
            </div>
        </Card>
    );
}
