import { StatCard } from "@/components/StatCard";
import { DollarSign, Wallet, ArrowDownCircle } from "lucide-react";

interface WalletStatsProps {
    totalIncome: number;
    totalWithdraw: number;
    balance: number;
}

export function WalletStats({ totalIncome, totalWithdraw, balance }: WalletStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Income"
                value={`₹${totalIncome.toLocaleString()}`}
                icon={DollarSign}
                trend="Comprehensive earnings"
                trendUp
            />

            <StatCard
                title="Total Withdraw"
                value={`₹${totalWithdraw.toLocaleString()}`}
                icon={ArrowDownCircle}
                trend="Total payouts requested"
            />

            <StatCard
                title="Available Balance"
                value={`₹${balance.toLocaleString()}`}
                icon={Wallet}
                trend="Ready for withdrawal"
                trendUp
            />
        </div>
    );
}

