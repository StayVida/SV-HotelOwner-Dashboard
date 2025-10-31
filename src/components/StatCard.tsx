import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="group relative p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-foreground tracking-tight mb-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm mt-2 font-semibold inline-flex items-center gap-1",
                trendUp ? "text-primary" : "text-destructive"
              )}
            >
              {trend}
            </p>
          )}
        </div>
        <div className="relative w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
          <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
    </Card>
  );
}
