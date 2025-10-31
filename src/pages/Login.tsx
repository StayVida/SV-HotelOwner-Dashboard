import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hotel, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, name);
      navigate("/", { replace: true });
    }, 500);
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
            <p className="text-xs text-muted-foreground font-medium">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary">
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;


