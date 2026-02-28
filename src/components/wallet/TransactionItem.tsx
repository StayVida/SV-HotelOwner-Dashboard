import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionRequest } from "@/api/hotel";

interface TransactionItemProps {
    txn: TransactionRequest;
    index: number;
}

export function TransactionItem({ txn, index }: TransactionItemProps) {
    return (
        <div
            className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300",
                    txn.status === "APPROVED" ? "gradient-accent" : "bg-gradient-to-br from-primary/20 to-primary/10"
                )}>
                    {txn.status === "APPROVED" ? (
                        <Building className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <DollarSign className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-bold text-foreground tracking-tight mb-1">Withdraw</p>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground font-medium flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(txn.txn_date).toLocaleDateString()}
                            </span>
                        </div>
                        {txn.status === "REJECTED" && txn.remark && (
                            <p className="text-red-500 text-xs font-bold leading-tight mt-0.5">
                                Reason: {txn.remark}
                            </p>
                        )}
                        {/* {txn.status !== "REJECTED" && txn.remark && (
                            <span className="text-muted-foreground font-medium italic text-sm">"{txn.remark}"</span>
                        )} */}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary tracking-tight">₹{txn.amount.toLocaleString()}</p>
                </div>
                <Badge
                    className={cn(
                        "px-4 py-1.5 font-semibold tracking-wide",
                        txn.status === "APPROVED"
                            ? "gradient-primary text-primary-foreground shadow-md"
                            : txn.status === "REJECTED"
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-yellow-500 text-white shadow-md"
                    )}
                >
                    {txn.status}
                </Badge>
            </div>
        </div>
    );
}
