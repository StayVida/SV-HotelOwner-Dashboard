import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionItem } from "./TransactionItem";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRequest } from "@/api/hotel";

interface TransactionSectionProps {
    isLoading: boolean;
    error: any;
    filteredTransactions: TransactionRequest[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
}

export function TransactionSection({
    isLoading,
    error,
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
}: TransactionSectionProps) {
    return (
        <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Transaction Requests</h3>
                    <p className="text-sm text-muted-foreground font-medium">Manage and track your payout requests</p>
                </div>

                <TransactionFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
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
                        <p className="text-red-500 font-medium">Failed to load transactions. Please try again later.</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-border/50 rounded-3xl">
                        <p className="text-muted-foreground text-lg">No transactions found matching your criteria.</p>
                    </div>
                ) : (
                    filteredTransactions.map((txn, index) => (
                        <TransactionItem key={`${txn.hotel_id}-${txn.sr}-${index}`} txn={txn} index={index} />
                    ))
                )}
            </div>
        </Card>
    );
}
