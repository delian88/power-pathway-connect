import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function SiteHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Events", to: "/events" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 border-b border-border/60 shadow-md py-0" 
          : "bg-background/50 border-b border-transparent shadow-none py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between transition-all duration-300">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img 
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            src="/nerc-logo.png" 
            alt="NERC Logo" 
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="leading-tight overflow-hidden">
            <div className="font-semibold text-sm tracking-tight transform transition-transform group-hover:translate-x-1">National Electricity</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground transform transition-transform group-hover:translate-x-1 delay-75">Workshop</div>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.to} 
              className="relative text-foreground/80 hover:text-primary transition-colors group py-2"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">Login</Button>
          </Link>
          <Link to="/contact">
            <Button size="sm" className="bg-gradient-primary shadow-elegant hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300">
              Inquire Now
            </Button>
          </Link>
          
          <div className="md:hidden ml-1 flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={link.to} className="text-lg font-medium hover:text-primary transition-colors block">
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 border-t pt-4"
                  >
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}