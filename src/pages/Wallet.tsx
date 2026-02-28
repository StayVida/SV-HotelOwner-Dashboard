import { WithdrawDialog } from "@/components/wallet/WithdrawDialog";
import { BankDetailsDialog } from "@/components/wallet/BankDetailsDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionRequests, fetchLedger, fetchFinancialSummary } from "@/api/hotel";
import { useState } from "react";
import { WalletStats } from "@/components/wallet/WalletStats";
import { TransactionSection } from "@/components/wallet/TransactionSection";
import { LedgerSection } from "@/components/wallet/LedgerSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Wallet as WalletIcon } from "lucide-react";

const Wallet = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactionRequests, isLoading: isLoadingRequests, error: requestsError } = useQuery({
    queryKey: ["transactionRequests", statusFilter],
    queryFn: () => fetchTransactionRequests(statusFilter),
  });

  const { data: ledgerEntries, isLoading: isLoadingLedger, error: ledgerError } = useQuery({
    queryKey: ["ledger"],
    queryFn: fetchLedger,
  });

  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["financialSummary"],
    queryFn: fetchFinancialSummary,
  });

  const filteredTransactions = transactionRequests?.filter((txn) => {
    const matchesSearch =
      txn.hotel_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.remark?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

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
          <WithdrawDialog availableBalance={financialSummary?.balance || 0} />
        </div>
      </div>

      <WalletStats
        totalIncome={financialSummary?.totalIncome || 0}
        totalWithdraw={financialSummary?.totalWithdraw || 0}
        balance={financialSummary?.balance || 0}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 p-1 bg-accent/20 rounded-2xl h-14 border border-border/50">
          <TabsTrigger value="all" className="rounded-xl font-bold text-base data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all flex items-center gap-2">
            <History className="w-4 h-4" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-xl font-bold text-base data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all flex items-center gap-2">
            <WalletIcon className="w-4 h-4" />
            Wallet Transactions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <LedgerSection
            isLoading={isLoadingLedger}
            error={ledgerError}
            ledgerEntries={ledgerEntries || []}
          />
        </TabsContent>
        <TabsContent value="requests" className="mt-0">
          <TransactionSection
            isLoading={isLoadingRequests}
            error={requestsError}
            filteredTransactions={filteredTransactions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;


