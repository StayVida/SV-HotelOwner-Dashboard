import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Calendar, BedDouble, ListChecks, Hotel, Wallet, ScanLine, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Bookings", url: "/bookings", icon: ListChecks },
  { title: "Rooms", url: "/rooms", icon: BedDouble },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Scanner", url: "/scanner", icon: ScanLine },
  { title: "Wallet", url: "/wallet", icon: Wallet },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          onClick={() => setSidebarOpen(true)}
          size="icon"
          variant="outline"
          className="fixed top-4 left-4 z-40 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-xl z-50 transition-transform duration-300",
        isMobile && !sidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                onClick={() => setSidebarOpen(false)}
                size="icon"
                variant="ghost"
                className="lg:hidden shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
            <div className="relative w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow shrink-0">
              <Hotel className="w-7 h-7 text-primary-foreground" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground tracking-tight">HotelManager</h1>
              <p className="text-xs text-muted-foreground font-medium">Property Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  end
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-foreground hover:bg-accent/50 hover:translate-x-1"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 animate-shimmer" 
                             style={{ backgroundSize: '1000px 100%' }} />
                      )}
                      <item.icon className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} />
                      <span className="font-semibold relative z-10">{item.title}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="gradient-accent rounded-2xl p-5 border border-primary/10 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-foreground mb-1 tracking-tight">Green Hospitality</p>
              <p className="text-xs text-muted-foreground font-medium">Eco-friendly hotel management</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
