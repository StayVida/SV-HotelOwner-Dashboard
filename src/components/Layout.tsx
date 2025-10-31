import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "@/components/Sidebar";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePWAInstall from "@/hooks/usePWAInstall";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const { canInstall, promptInstall } = usePWAInstall();

  return (
    <div className="min-h-screen bg-background flex">
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

      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <div className="flex items-center justify-end pb-2">
            {canInstall && (
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


