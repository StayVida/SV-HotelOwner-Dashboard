import { WithdrawDialog } from "@/components/wallet/WithdrawDialog";
import { BankDetailsDialog } from "@/components/wallet/BankDetailsDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionRequests } from "@/api/hotel";
import { useState } from "react";
import { WalletStats } from "@/components/wallet/WalletStats";
import { TransactionSection } from "@/components/wallet/TransactionSection";

const Wallet = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactionRequests, isLoading, error } = useQuery({
    queryKey: ["transactionRequests", statusFilter],
    queryFn: () => fetchTransactionRequests(statusFilter),
  });

  const filteredTransactions = transactionRequests?.filter((txn) => {
    const matchesSearch =
      txn.hotel_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.remark?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const totalIncome = filteredTransactions
    .filter(item => item.status === "APPROVED")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingIncome = filteredTransactions
    .filter(item => item.status === "PENDING")
    .reduce((sum, item) => sum + item.amount, 0);

  const rejectedIncome = filteredTransactions
    .filter(item => item.status === "REJECTED")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Wallet</h2>
            <p className="text-muted-foreground text-lg font-medium">Track your income and payments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BankDetailsDialog />
          <WithdrawDialog availableBalance={2000} />
        </div>
      </div>

      <WalletStats
        totalIncome={totalIncome}
        pendingIncome={pendingIncome}
        rejectedIncome={rejectedIncome}
      />

      <TransactionSection
        isLoading={isLoading}
        error={error}
        filteredTransactions={filteredTransactions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
};

export default Wallet;
