import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, Hotel, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import usePWAInstall from "@/hooks/usePWAInstall";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const { canInstall, promptInstall } = usePWAInstall();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Top Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 z-40 flex items-center justify-between px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow shrink-0">
              <Hotel className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight leading-tight">Stay Vida</h1>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">Property Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {canInstall && (
              <Button onClick={promptInstall} size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setSidebarOpen(true)}
              size="icon"
              variant="ghost"
              className="h-9 w-9"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>
      )}

      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="flex items-center justify-end pb-2">
            {canInstall && !isMobile && (
              <Button onClick={promptInstall} variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Install App
              </Button>
            )}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
