import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hotel, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { requestOtp, verifyOtp } from "@/api/auth";
import { toast } from "sonner";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");

  // Mutation for requesting OTP
  const requestOtpMutation = useMutation({
    mutationFn: (email: string) => requestOtp(email),
    onSuccess: (data) => {
      toast.success(data || "OTP sent successfully!");
      setStep("verify");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    },
  });

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
    onSuccess: (data) => {
      if (data.role === "hotel_owner") {
        toast.success(data.message || "Login successful!");
        localStorage.setItem("token", data.token);
        login(data.email, data.role); // Using role as name for now since API doesn't return name
        navigate("/", { replace: true });
      } else {
        toast.error("Access denied. Not a hotel owner.");
        // Redirect to website as requested
        // window.location.href = "https://your-website.com"; 
        setTimeout(() => {
           window.location.href = "https://staybook.in"; // Example redirect
        }, 1500);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to verify OTP");
    },
  });

  if (user) return <Navigate to="/" replace />;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestOtpMutation.mutate(email);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    verifyOtpMutation.mutate({ email, otp });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Hotel className="w-7 h-7 text-primary-foreground" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HotelManager</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {step === "email" ? "Sign in to continue" : "Enter Verification Code"}
            </p>
          </div>
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={requestOtpMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="w-full gradient-primary"
            >
              {requestOtpMutation.isPending ? (
                "Sending OTP..."
              ) : (
                <>
                  Get OTP <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="text-sm font-semibold block">OTP</label>
                 <button 
                   type="button" 
                   onClick={() => setStep("email")}
                   className="text-xs text-muted-foreground hover:text-primary"
                 >
                   Change Email
                 </button>
              </div>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                disabled={verifyOtpMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              disabled={verifyOtpMutation.isPending}
              className="w-full gradient-primary"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
            </Button>
            <div className="text-center">
                 <button 
                  type="button"
                  onClick={() => requestOtpMutation.mutate(email)}
                  disabled={requestOtpMutation.isPending}
                  className="text-xs text-muted-foreground hover:underline"
                 >
                   Resend OTP
                 </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Login;


