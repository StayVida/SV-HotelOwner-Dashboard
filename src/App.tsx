import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Rooms from "./pages/Rooms";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import ActiveBookings from "@/pages/ActiveBookings";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route element={<RequireAuth />}>
                <Route index element={<Dashboard />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="active-bookings" element={<ActiveBookings />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
