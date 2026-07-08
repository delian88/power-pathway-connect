import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function SiteHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/nerc-logo.png" 
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
          <Link to="/login" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/contact">
            <Button size="sm" className="bg-gradient-primary shadow-elegant">Inquire Now</Button>
          </Link>
          
          <div className="md:hidden ml-1 flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-6 mt-10">
                  <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                  <Link to="/events" className="text-lg font-medium hover:text-primary transition-colors">Events</Link>
                  <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors">About</Link>
                  <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors">Contact</Link>
                  <div className="mt-4 border-t pt-4">
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}