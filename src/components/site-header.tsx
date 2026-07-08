import { Link, useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/8/87/Nigerian_Electricity_Regulatory_Commission_logo.png" 
            alt="NERC Logo" 
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
          />
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
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">Login</Button>
          </Link>
          <Link to="/contact">
            <Button size="sm" className="bg-gradient-primary shadow-elegant">Inquire Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}