import { createFileRoute, Outlet, redirect, useRouter, Link, useLocation } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { verifySession, destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  ShieldCheck
} from "lucide-react";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await verifySession();
  return session ? JSON.parse(JSON.stringify(session)) : null;
});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  destroySession();
  return { success: true };
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/login") return;

    const session = await getSessionFn();
    if (!session || session.role !== 'admin') {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutFn();
    router.invalidate();
    router.navigate({ to: "/login" });
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Schedule", href: "/admin/schedule", icon: Calendar },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Applicants", href: "/admin/applicants", icon: Users },
    { name: "Registrations", href: "/admin/registrations", icon: Users },
    { name: "Sponsors", href: "/admin/sponsors", icon: ShieldCheck },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F4F7F6] font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Dark Sidebar */}
      <aside className={`w-64 bg-[#1B2531] text-white flex flex-col h-screen fixed lg:sticky top-0 shadow-xl z-50 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 bg-white rounded-lg p-2 px-3 shadow-sm mb-2 mt-2">
            <div className="w-8 h-8 bg-[#00A86B] text-white font-bold rounded flex items-center justify-center text-lg">
              N
            </div>
            <div className="leading-tight">
              <div className="text-[#0F1A1C] font-bold text-sm">National Electricity</div>
              <div className="text-[#00A86B] font-semibold text-xs">Workshop</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-thin">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive 
                      ? "bg-[#00A86B] text-white shadow-md" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6 mt-auto border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/admin/notifications" className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00A86B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </Link>
            
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#00A86B]/10 overflow-hidden border border-[#00A86B]/20">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=e5f7f0`} alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-[#0F1A1C] group-hover:text-[#00A86B] transition-colors">Admin</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
