import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowUpRight, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { LedgerEntry } from "@/api/hotel";

interface LedgerItemProps {
    entry: LedgerEntry;
    index: number;
}

export function LedgerItem({ entry, index }: LedgerItemProps) {
    const isCredit = entry.type === "CR";

    return (
        <div
            className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 gap-4"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300",
                    isCredit ? "gradient-primary" : "bg-gradient-to-br from-red-500/20 to-red-500/10"
                )}>
                    {isCredit ? (
                        <CreditCard className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <ArrowUpRight className="w-7 h-7 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-foreground tracking-tight">
                            {isCredit ? "Booking Payment" : "Withdrawal"}
                        </p>
                        {entry.booking_id && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 text-primary">
                                {entry.booking_id}
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(entry.txn_date).toLocaleDateString()}
                        </span>
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" />
                            ID: {entry.transaction_id !== "NA" ? entry.transaction_id : "Pending"}
                        </span>
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                            via {entry.via}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                <div className="text-right">
                    <p className={cn(
                        "text-2xl font-bold tracking-tight",
                        isCredit ? "text-primary" : "text-red-500"
                    )}>
                        {isCredit ? "+" : "-"}₹{entry.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        Bal: ₹{entry.balance_after.toLocaleString()}
                    </p>
                </div>
                <Badge
                    className={cn(
                        "px-4 py-1.5 font-semibold tracking-wide",
                        isCredit
                            ? "gradient-primary text-primary-foreground shadow-md"
                            : "bg-red-500 text-white shadow-md"
                    )}
                >
                    {isCredit ? "CREDIT" : "DEBIT"}
                </Badge>
            </div>
        </div>
    );
}
