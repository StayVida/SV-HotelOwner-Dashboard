import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const BookingsFilter = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  sortBy,
  setSortBy,
}: BookingsFilterProps) => {
  return (
    <Card className="p-4 sm:p-5 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="pl-9 h-10 sm:h-11"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 sm:h-11">
            <div className="inline-flex items-center gap-2">
              <Filter className="w-4 h-4 opacity-60" />
              <SelectValue placeholder="Booking Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="CheckIn">CheckIn</SelectItem>
            <SelectItem value="CheckedOut">CheckedOut</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="h-10 sm:h-11">
            <div className="inline-flex items-center gap-2">
              <Filter className="w-4 h-4 opacity-60" />
              <SelectValue placeholder="Payment Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-10 sm:h-11">
            <div className="inline-flex items-center gap-2">
              <SortAsc className="w-4 h-4 opacity-60" />
              <SelectValue placeholder="Sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checkin-asc">Check-in: earliest</SelectItem>
            <SelectItem value="checkin-desc">Check-in: latest</SelectItem>
            <SelectItem value="amount-desc">Amount: high-low</SelectItem>
            <SelectItem value="amount-asc">Amount: low-high</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
