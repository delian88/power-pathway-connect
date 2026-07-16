import { Link, useNavigate, useRouterState, useRouteContext } from "@tanstack/react-router";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { logoutFn } from "@/routes/admin/route";

export function SiteHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const context = useRouteContext({ strict: false });
  const session = (context as any)?.session;
  const settings = (context as any)?.settings || {};

  const handleLogout = async () => {
    await logoutFn();
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Agenda", to: "/agenda" },
    { label: "Registration", to: "/registration" },
    { label: "Sponsorship", to: "/sponsorship" },
    { label: "Exhibition", to: "/exhibition" },
    { label: "Gallery", to: "/gallery" },
    { label: "Reports", to: "/reports" },
  ];

  return (
    <header className="w-full z-50 font-sans">
      {/* Top Header */}
      <div className={`hidden md:block bg-white border-b border-gray-100 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'py-3'}`}>
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-start w-[400px]">
            <div className="flex flex-col items-center">
              <span className="text-[#0F1A1C] font-bold text-[13px] uppercase tracking-wider mb-2">{settings.convenerTitle || "CONVENER"}</span>
              <Link to="/">
                <img src={settings.logoUrl || "/vp-seal.png"} alt="Site Logo" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
              </Link>
            </div>
          </div>

          {/* Center: Details */}
          <div className="flex flex-col items-center justify-center text-center flex-1 mx-4">
            <div className="flex mb-3 text-center gap-2">
              <span className="text-[#0F1A1C] font-bold text-xl md:text-2xl leading-tight tracking-tight uppercase">
                NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023
              </span>
            </div>
            <span className="text-[#0F1A1C] font-bold text-sm tracking-wide">{settings.headerPatronageText || "UNDER THE HIGH PATRONAGE OF H.E. PRESIDENT BOLA AHMED TINUBU, GCFR"}</span>
            <span className="text-[#0F1A1C] font-bold text-sm tracking-wide">{settings.headerPresidentText || "President, Commander in Chief of the Armed Forces, Federal Republic of Nigeria"}</span>
            <span className="text-[#008753] font-bold mt-1 mb-2 text-[15px]">PRESIDENTIAL BANQUET HALL - ASO VILLA, FCT</span>
            
            <div className="bg-[#E6F3EE] text-[#008753] px-6 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {settings.headerDateText || "15TH – 18TH MARCH 2027"}
            </div>
          </div>

          {/* Right: Logos */}
          <div className="flex flex-col items-end justify-center w-[400px]">
            <div className="flex flex-col items-start">
              <span className="text-[#0F1A1C] font-bold text-[13px] uppercase mb-1 tracking-wider pl-4">ORGANIZER</span>
              <img src="/ampsl-logo.png" alt="AMPSL Logo" className="w-56 h-auto object-contain" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <div className={`w-full transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-lg bg-[#008753]' : 'bg-[#008753]'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Mobile Logo (only shows when Top Header is hidden or on mobile) */}
          <Link to="/" className={`flex items-center gap-2 md:${isScrolled ? 'flex' : 'hidden'}`}>
             <div className="w-8 h-8 bg-white rounded border border-[#D4AF37] flex items-center justify-center font-bold text-[#008753] overflow-hidden">
               {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-contain p-0.5" alt="Logo" /> : "N"}
             </div>
             <div className="text-white font-bold leading-tight flex flex-col">
               <span className="text-sm">{settings.appNameFirstPart || "NATIONAL WORKSHOP"}</span>
               <span className="text-[10px] text-[#D4AF37]">{settings.appNameSecondPart || "ON ELECTRICITY ACT"}</span>
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center ${isScrolled ? '' : 'w-full justify-center'} gap-2`}>
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.to} 
                className="text-white hover:bg-[#00A86B] hover:text-[#D4AF37] px-5 py-5 text-sm font-semibold transition-colors border-b-4 border-transparent hover:border-[#D4AF37]"
                activeProps={{
                  className: "bg-[#006B42] text-[#D4AF37] border-[#D4AF37]"
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            {!session ? (
              <Link to="/login" className="hidden sm:inline-flex">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-[#008753] font-semibold">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-[#008753] font-semibold flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-transparent text-white/80 hover:bg-red-500/20 hover:text-white px-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Link to="/contact">
              <Button size="sm" className="bg-[#D4AF37] text-[#0F1A1C] hover:bg-[#E8C257] hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold">
                Inquire Now
              </Button>
            </Link>
            
            <div className="md:hidden ml-1 flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 p-0 text-white hover:bg-[#00A86B]">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-[#008753] border-none text-white">
                  <nav className="flex flex-col gap-2 mt-10">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link to={link.to} className="text-lg font-medium hover:text-[#D4AF37] transition-colors block py-3 border-b border-[#00A86B]">
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: navLinks.length * 0.1 }}
                      className="mt-6 flex flex-col gap-4"
                    >
                      {!session ? (
                        <Link to="/login" className="w-full">
                          <Button variant="outline" className="w-full border-white text-[#008753] hover:bg-white/90">Login</Button>
                        </Link>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link to="/admin" className="w-full">
                            <Button variant="outline" className="w-full border-white text-[#008753] hover:bg-white/90 flex items-center gap-2 justify-center">
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Button>
                          </Link>
                          <Button 
                            onClick={handleLogout}
                            variant="ghost" 
                            className="w-full text-white/80 hover:bg-red-500/20 hover:text-white"
                          >
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                          </Button>
                        </div>
                      )}
                      <Link to="/contact" className="w-full">
                        <Button className="w-full bg-[#D4AF37] text-[#0F1A1C] hover:bg-[#E8C257] font-bold">Inquire Now</Button>
                      </Link>
                    </motion.div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}