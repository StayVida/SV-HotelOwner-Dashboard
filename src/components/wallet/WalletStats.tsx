import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp } from "lucide-react";

interface WalletStatsProps {
    totalIncome: number;
    pendingIncome: number;
    rejectedIncome: number;
}

export function WalletStats({ totalIncome, pendingIncome, rejectedIncome }: WalletStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Approved Income"
                value={`₹${totalIncome.toLocaleString()}`}
                icon={DollarSign}
                trend="All approved payments"
                trendUp
            />

            <StatCard
                title="Pending"
                value={`₹${pendingIncome.toLocaleString()}`}
                icon={TrendingUp}
                trend="Awaiting confirmation"
                trendUp
            />

            <StatCard
                title="Rejected"
                value={`₹${rejectedIncome.toLocaleString()}`}
                icon={TrendingUp}
                trend="Disapproved requests"
            />
        </div>
    );
}
