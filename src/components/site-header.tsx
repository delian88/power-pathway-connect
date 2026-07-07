import { Link, useNavigate } from "@tanstack/react-router";
import { Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-hooks";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm tracking-tight">National Electricity</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Workshop</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-primary shadow-elegant">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}