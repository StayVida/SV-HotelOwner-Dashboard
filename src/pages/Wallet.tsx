import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { WithdrawDialog } from "@/components/WithdrawDialog";

const incomeData = [
  {
    id: "INC001",
    source: "Stayvida Advance Payment",
    amount: 5000,
    date: "2025-10-01",
    status: "completed",
    type: "advance",
    bookingRef: "BK045"
  },
  {
    id: "INC002",
    source: "Room Payment - Suite 101",
    amount: 800,
    date: "2025-10-05",
    status: "completed",
    type: "booking",
    bookingRef: "BK001"
  },
  {
    id: "INC003",
    source: "Stayvida Advance Payment",
    amount: 3500,
    date: "2025-10-08",
    status: "completed",
    type: "advance",
    bookingRef: "BK052"
  },
  {
    id: "INC004",
    source: "Room Payment - Ocean View 301",
    amount: 1250,
    date: "2025-10-10",
    status: "pending",
    type: "booking",
    bookingRef: "BK003"
  },
  {
    id: "INC005",
    source: "Stayvida Commission",
    amount: 2100,
    date: "2025-10-12",
    status: "completed",
    type: "advance",
    bookingRef: "Multiple"
  },
];

const Wallet = () => {
  const totalIncome = incomeData
    .filter(item => item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);
  
  const pendingIncome = incomeData
    .filter(item => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);
  
  const stayvidaPayments = incomeData
    .filter(item => item.type === "advance" && item.status === "completed")
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
          <WithdrawDialog availableBalance={totalIncome} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Total Income</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">${totalIncome.toLocaleString()}</p>
                <p className="text-sm mt-2 font-semibold text-primary">All completed payments</p>
              </div>
              <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <DollarSign className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </Card>

          <Card className="group p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Stayvida Advances</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">${stayvidaPayments.toLocaleString()}</p>
                <p className="text-sm mt-2 font-semibold text-primary">From Stayvida platform</p>
              </div>
              <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <Building className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </Card>

          <Card className="group p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">${pendingIncome.toLocaleString()}</p>
                <p className="text-sm mt-2 font-semibold text-yellow-600">Awaiting confirmation</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Income Transactions */}
        <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Income Transactions</h3>
            <p className="text-sm text-muted-foreground font-medium">Complete history of all payments received</p>
          </div>

          <div className="space-y-3">
            {incomeData.map((income, index) => (
              <div
                key={income.id}
                className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300",
                    income.type === "advance" ? "gradient-accent" : "bg-gradient-to-br from-primary/20 to-primary/10"
                  )}>
                    {income.type === "advance" ? (
                      <Building className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <DollarSign className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground tracking-tight mb-1">{income.source}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {income.date}
                      </span>
                      <span className="text-muted-foreground font-medium">Ref: {income.bookingRef}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary tracking-tight">${income.amount.toLocaleString()}</p>
                  </div>
                  <Badge
                    className={cn(
                      "px-4 py-1.5 font-semibold tracking-wide",
                      income.status === "completed" 
                        ? "gradient-primary text-primary-foreground shadow-md" 
                        : "bg-yellow-500 text-white shadow-md"
                    )}
                  >
                    {income.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
};

export default Wallet;
